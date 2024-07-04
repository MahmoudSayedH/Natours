const mongoose = require('mongoose');
const slugify = require('slugify');
//create schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, //make it by default not getted in the select
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
    startDates: [Date],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
//add virtual field which is not saved in the database but calculated when we query data
tourSchema.virtual('durationInWeeks').get(function () {
  return this.duration / 7;
});

//mongoose document middleware:
//this middlware is triggered only on save or create and activated before it save
tourSchema.pre('save', function (next) {
  // set the slug field based on the name
  this.slug = slugify(this.name, { lower: true });
  next();
});
//the post property make a middleware affter the hook is triggered
tourSchema.post('save', function (doc, next) {
  console.log(doc);
  next();
});

//Query middleware:
tourSchema.pre(/^find/, function (next) {
  // /^find/==> hundle all querys the starts with find
  // we want to get all the tour except the secret tours:
  this.find({
    secretTour: { $ne: true },
  });
  next();
});
// aggregation middleware:
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); // add the match as first obj in the aggrigate pipline
  next();
});
//create model
const Tour = mongoose.model('Tour', tourSchema);

//export the model
module.exports = Tour;
