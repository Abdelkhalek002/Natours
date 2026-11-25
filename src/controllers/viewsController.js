import mongoose from 'mongoose';
import Tour from '../models/tourModel.js';
import User from '../models/userModel.js';
import Review from '../models/reviewModel.js';
import Booking from '../models/bookingModel.js';
import APIFeatures from '../utils/apiFeatures.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import config from '../config/index.js';

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildPagination = (totalItems, pageParam, limit) => {
  const currentPage = Math.max(1, parseInt(pageParam, 10) || 1);
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  return { totalItems, totalPages, currentPage };
};

export const getOverview = catchAsync(async (req, res, next) => {
  const limit = 6;
  const currentPage = Math.max(1, parseInt(req.query.page, 10) || 1);
  const difficulty = ['easy', 'medium', 'difficult'].includes(
    req.query.difficulty,
  )
    ? req.query.difficulty
    : '';
  const sort = req.query.sort ? String(req.query.sort) : '';

  const filterObj = {};
  if (difficulty) filterObj.difficulty = difficulty;

  const queryParams = {
    ...filterObj,
    page: currentPage,
    limit,
  };
  if (sort) queryParams.sort = sort;

  const features = new APIFeatures(Tour.find(), queryParams)
    .filter()
    .sort()
    .paginate();

  const [tours, totalTours] = await Promise.all([
    features.query,
    Tour.countDocuments({ secretTour: { $ne: true }, ...filterObj }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalTours / limit));
  const showingStart = totalTours === 0 ? 0 : (currentPage - 1) * limit + 1;
  const showingEnd = Math.min(currentPage * limit, totalTours);

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
    filters: { difficulty, sort },
    pagination: {
      totalTours,
      totalPages,
      currentPage,
      showingStart,
      showingEnd,
    },
  });
});

export const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    select: 'review rating user createdAt',
  });
  if (!tour) {
    return next(new AppError('Sorry, There is no tour with that name', 404));
  }
  res.status(200).render('tour', {
    title: tour.name,
    tour,
    stripePublicKey: config.stripe.publishableKey,
  });
});

export const getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

export const getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Create your account',
  });
};

export const getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
    activeNav: 'settings',
  });
};

export const getMyTours = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id })
    .populate({
      path: 'tour',
      select:
        'name slug imageCover duration startDates startLocation maxGroupSize guides',
    })
    .sort('-createdAt');

  const now = new Date();
  const upcomingBookings = [];
  const pastBookings = [];

  for (const booking of bookings) {
    if (!booking.tour) continue;
    const dates = booking.tour.startDates;
    const isUpcoming =
      !Array.isArray(dates) ||
      dates.length === 0 ||
      dates.some((d) => new Date(d) >= now);

    if (isUpcoming) {
      upcomingBookings.push(booking);
    } else {
      pastBookings.push(booking);
    }
  }

  res.status(200).render('myBookings', {
    title: 'My Bookings',
    activeNav: 'bookings',
    upcomingBookings,
    pastBookings,
  });
});

export const getMyReviews = catchAsync(async (req, res, next) => {
  const [reviews, bookings] = await Promise.all([
    Review.find({ user: req.user.id })
      .populate({
        path: 'tour',
        select: 'name slug imageCover startLocation',
      })
      .sort('-createdAt'),
    Booking.find({ user: req.user.id }).populate({
      path: 'tour',
      select: 'name slug imageCover startLocation',
    }),
  ]);

  const reviewedTourIds = new Set(
    reviews.map((r) => String(r.tour?._id || r.tour)),
  );
  const seenPendingIds = new Set();
  const pendingTours = [];

  for (const booking of bookings) {
    const { tour } = booking;
    if (!tour || !tour._id) continue;
    const tourId = String(tour._id);
    if (!reviewedTourIds.has(tourId) && !seenPendingIds.has(tourId)) {
      seenPendingIds.add(tourId);
      pendingTours.push(tour);
    }
  }

  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? Number(
          (
            reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews
          ).toFixed(1),
        )
      : 0;

  res.status(200).render('myReviews', {
    title: 'My Reviews',
    activeNav: 'reviews',
    reviews,
    pendingTours,
    totalReviews,
    avgRating,
  });
});

export const getBilling = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id })
    .populate({ path: 'tour', select: 'name slug price' })
    .sort('-createdAt');

  const totalCount = bookings.length;
  const totalSpent = bookings.reduce((sum, b) => sum + (b.price || 0), 0);

  res.status(200).render('billing', {
    title: 'Billing & Payments',
    activeNav: 'billing',
    bookings,
    totalSpent,
    totalCount,
  });
});

export const getAdminTours = catchAsync(async (req, res, next) => {
  const limit = 10;
  const currentPage = Math.max(1, parseInt(req.query.page, 10) || 1);
  const difficulty = ['easy', 'medium', 'difficult'].includes(
    req.query.difficulty,
  )
    ? req.query.difficulty
    : '';
  const search = req.query.search ? String(req.query.search).trim() : '';

  const filter = {};
  if (difficulty) filter.difficulty = difficulty;
  if (search) filter.name = { $regex: escapeRegex(search), $options: 'i' };

  const skip = (currentPage - 1) * limit;

  const [tours, totalItems, guides] = await Promise.all([
    Tour.find(filter).sort('-createdAt').skip(skip).limit(limit),
    Tour.countDocuments({ secretTour: { $ne: true }, ...filter }),
    User.find({ role: { $in: ['guide', 'lead-guide'] } })
      .select('name email role photo')
      .sort('name'),
  ]);

  res.status(200).render('admin/tours', {
    title: 'Manage Tours',
    activeNav: 'admin-tours',
    tours,
    guides,
    filters: { difficulty, search },
    pagination: buildPagination(totalItems, currentPage, limit),
  });
});

export const getAdminUsers = catchAsync(async (req, res, next) => {
  const limit = 10;
  const currentPage = Math.max(1, parseInt(req.query.page, 10) || 1);
  const role = ['user', 'guide', 'lead-guide', 'admin'].includes(req.query.role)
    ? req.query.role
    : '';
  const search = req.query.search ? String(req.query.search).trim() : '';

  const filter = {};
  if (role) filter.role = role;
  if (search) {
    const regex = { $regex: escapeRegex(search), $options: 'i' };
    filter.$or = [{ name: regex }, { email: regex }];
  }

  const skip = (currentPage - 1) * limit;

  const [users, totalItems, roleAgg] = await Promise.all([
    User.find(filter).sort('name').skip(skip).limit(limit),
    User.countDocuments({ active: { $ne: false }, ...filter }),
    User.aggregate([
      { $match: { active: { $ne: false } } },
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]),
  ]);

  const roleCounts = roleAgg.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});

  const travelersCount = roleCounts.user || 0;
  const guidesCount = (roleCounts.guide || 0) + (roleCounts['lead-guide'] || 0);
  const adminsCount = roleCounts.admin || 0;
  const totalUsers = travelersCount + guidesCount + adminsCount;

  res.status(200).render('admin/users', {
    title: 'Manage Users',
    activeNav: 'admin-users',
    users,
    stats: { totalUsers, travelersCount, guidesCount, adminsCount },
    filters: { role, search },
    pagination: buildPagination(totalItems, currentPage, limit),
  });
});

export const getAdminReviews = catchAsync(async (req, res, next) => {
  const limit = 10;
  const currentPage = Math.max(1, parseInt(req.query.page, 10) || 1);
  const tour =
    req.query.tour && mongoose.isValidObjectId(req.query.tour)
      ? String(req.query.tour)
      : '';
  const parsedRating = parseInt(req.query.rating, 10);
  const rating =
    Number.isInteger(parsedRating) && parsedRating >= 1 && parsedRating <= 5
      ? parsedRating
      : '';

  const filter = {};
  if (tour) filter.tour = tour;
  if (rating) filter.rating = rating;

  const skip = (currentPage - 1) * limit;

  const [reviews, totalItems, tours, reviewAgg] = await Promise.all([
    Review.find(filter)
      .populate({ path: 'tour', select: 'name slug' })
      .populate({ path: 'user', select: 'name email photo' })
      .sort('-createdAt')
      .skip(skip)
      .limit(limit),
    Review.countDocuments(filter),
    Tour.find().select('name slug').sort('name'),
    Review.aggregate([
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          avgRating: { $avg: '$rating' },
        },
      },
    ]),
  ]);

  const totalReviews = reviewAgg[0]?.totalReviews || 0;
  const avgRating = reviewAgg[0]?.avgRating
    ? Number(reviewAgg[0].avgRating.toFixed(1))
    : 0;

  res.status(200).render('admin/reviews', {
    title: 'Manage Reviews',
    activeNav: 'admin-reviews',
    reviews,
    tours,
    stats: { totalReviews, avgRating },
    filters: { tour, rating },
    pagination: buildPagination(totalItems, currentPage, limit),
  });
});

export const getAdminBookings = catchAsync(async (req, res, next) => {
  const limit = 10;
  const currentPage = Math.max(1, parseInt(req.query.page, 10) || 1);
  const paid =
    req.query.paid === 'true' || req.query.paid === 'false'
      ? req.query.paid
      : '';

  const filter = {};
  if (paid === 'true') filter.paid = true;
  if (paid === 'false') filter.paid = false;

  const skip = (currentPage - 1) * limit;

  const [bookings, totalItems, tours, users, bookingAgg] = await Promise.all([
    Booking.find(filter)
      .populate({ path: 'tour', select: 'name slug price' })
      .populate({ path: 'user', select: 'name email photo' })
      .sort('-createdAt')
      .skip(skip)
      .limit(limit),
    Booking.countDocuments(filter),
    Tour.find().select('name price').sort('name'),
    User.find().select('name email').sort('name'),
    Booking.aggregate([
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          grossRevenue: { $sum: '$price' },
          paidCount: { $sum: { $cond: ['$paid', 1, 0] } },
          unpaidCount: { $sum: { $cond: ['$paid', 0, 1] } },
        },
      },
    ]),
  ]);

  const stats = {
    totalBookings: bookingAgg[0]?.totalBookings || 0,
    grossRevenue: bookingAgg[0]?.grossRevenue || 0,
    paidCount: bookingAgg[0]?.paidCount || 0,
    unpaidCount: bookingAgg[0]?.unpaidCount || 0,
  };

  res.status(200).render('admin/bookings', {
    title: 'Manage Bookings',
    activeNav: 'admin-bookings',
    bookings,
    tours,
    users,
    stats,
    filters: { paid },
    pagination: buildPagination(totalItems, currentPage, limit),
  });
});

export const updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  );
  res.status(200).render('account', {
    title: 'Your account',
    activeNav: 'settings',
    user: updatedUser,
  });
});
