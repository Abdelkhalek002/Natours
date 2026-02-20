import mongoose from 'mongoose';
import Tour from './tourModel.js';
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.index({ user: 1, tour: 1 }, { unique: true });

//QUERY MIDDLEWARE
reviewSchema.pre(/^find/, function () {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  // Persist new data into db
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

// Calculating ratings average after a new review has been created
reviewSchema.post('save', function () {
  // this points to current review
  this.constructor.calcAverageRatings(this.tour);
});

// Calculating ratings average after a new review has been updated or deleted
// We use this.model.findOne(this.getFilter()) instead of this.findOne() because:
// - this.findOne() would try to execute the current query chain (findByIdAndUpdate), causing "Query already executed" error
// - this.model.findOne() creates a SEPARATE independent query to fetch the document before the main operation
// - this.getFilter() extracts the filter condition from the current query to fetch the same document
// The fetched document is stored in this.currentReview so the post-hook can access it to recalculate ratings
reviewSchema.pre(/^findOneAnd/, async function () {
  this.currentReview = await this.model.findOne(this.getFilter());
});
reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); does NOT work here, query has already excuted
  await this.currentReview.constructor.calcAverageRatings(
    this.currentReview.tour,
  );
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
