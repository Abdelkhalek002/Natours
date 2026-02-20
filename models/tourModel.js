import mongoose from 'mongoose';
import slugify from 'slugify';
//import User from './userModel.js';

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Empty tour name'],
      unique: true,
      trim: true,
      maxlength: [55, 'Tour name is more than 55 characters'],
      minlength: [10, 'Tour name is less Than 10 characters'],
    },
    slug: String,
    secretTour: {
      type: Boolean,
      default: false,
    },
    duration: {
      type: Number,
      required: [true, 'Empty duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Empty group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'Empty Difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Invalid difficulty (easy, medium, difficult)',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      max: [5, 'Rating is more than 5.0'],
      min: [1, 'Rating is less than 1.0'],
      set: (val) => Math.round(val * 10) / 10, // 4.6666  4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          //important: (this) only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Price discount is higher than actual price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: String,
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Virtual population (very important)
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// DOCUMENT MIDDLEWARE runs before .save() and .create()
tourSchema.pre('save', function () {
  this.slug = slugify(this.name, { lower: true });
});

/*
//performing embedding
tourSchema.pre('save', async function () {
  const guidePromises = this.guides.map(async (id) => await User.findById(id));
  this.guides = await Promise.all(guidePromises);
});
*/

// QUERY MIDDLWARE
tourSchema.pre(/^find/, function () {
  this.start = Date.now();
  this.find({ secretTour: { $ne: true } });
});
tourSchema.post(/^find/, function () {
  console.log(`Query took ${Date.now() - this.start} seconds`);
  this.find({ secretTour: { $ne: true } });
});
tourSchema.pre(/^find/, function () {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
});

//AGGREGATION MIDDLWARE
// tourSchema.pre('aggregate', function () {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   console.log(this.pipeline());
// });

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
