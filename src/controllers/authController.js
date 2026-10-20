import { promisify } from 'util';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Email from '../utils/email.js';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    maxAge: Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000,
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
  //remove password from output only
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    user,
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });
  const url = `${req.protocol}://${req.get('host')}/me`;
  await new Email(newUser, url).sendWelcome();

  createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //1)check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password'), 400);
  }
  //2)check if email and password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  //1)check if everything is ok, send token to client
  createSendToken(user, 200, res);
});

export const logOut = (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({ status: 'success' });
};

export const protect = catchAsync(async (req, res, next) => {
  let token;
  //1) getting token and check if it's there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Log in to get access.', 401),
    );
  }
  //2) token verfication
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); //using promisify from util module for making the whole project code based on async/await and not cb functions
  //3) check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('the user belongs to this token is no longer exist', 401),
    );
  }
  //4) check if password changed after token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password, please log in again.', 401),
    );
  }

  //GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

// Only for rendered pages, no errors
export const isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    //1) token verfication
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET,
    );
    //2) check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next();
    }
    //3) check if password changed after token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next();
    }
    // ✅ LOGGED USER
    res.locals.user = currentUser;
    return next();
  }
  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          'Access Denied, You are not authorized to perform this action.',
          403,
        ),
      );
    }
    next();
  };
};

export const forgotPassword = catchAsync(async (req, res, next) => {
  //1) get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('there is no user with that email address', 404));
  }

  //2) generate random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3) send the token to user's email
  try {
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError('There was an error sending an email, Try again later', 500),
    );
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  //1) get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  //2) if token hasn't expired, and there is a user, set the new password
  if (!user) {
    return next(new AppError('token has expired or invalid', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  //3) update changedPasswordAt property for the user
  //4) log the user in, send JWT
  createSendToken(user, 200, res);
});

export const updatePassword = catchAsync(async (req, res, next) => {
  //1) get user from collection
  const user = await User.findById(req.user.id).select('+password');
  //2) check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(
      new AppError('your current password is incorrect, try again', 401),
    );
  }
  //3) if so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //4) log user in, send JWT
  createSendToken(user, 200, res);
});
