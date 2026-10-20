import crypto from 'crypto';
import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User doesn't have name"],
  },
  email: {
    type: String,
    required: [true, "User doesn't have email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Invalid email'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, "User doesn't have password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Password confirmation is missing'],
    validate: {
      // This only works for CREATE and  SAVE!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
  },
});

// QUERY MIDDLWARE
userSchema.pre('save', async function () {
  // 1) Only run this function if password was actually modified
  if (!this.isModified('password')) return;

  // 2) Hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // 3) Delete passwordConfirm field
  this.passwordConfirm = undefined;
});

userSchema.pre('save', async function () {
  if (!this.isModified('password') || this.isNew) return;
  this.passwordChangedAt = Date.now() - 1000;
});

userSchema.pre(/^find/, function () {
  this.find({ active: { $ne: false } });
});

// INSTANCE METHODS
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    //        5:00             5:30         true, which means password changed after token was issued
    return JWTTimeStamp < changedTimeStamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  //1) create a hashed version of the token and save it into db
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  //2) saving the token expires date in db (10 minutes)
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);

export default User;
