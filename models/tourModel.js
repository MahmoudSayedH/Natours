const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
//create schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      minlength: [5, 'The name must have at least 5 characters'],
      maxlength: [25, 'The name cannt be more than 25 characters'],
      // validate: [validator.isAlpha, 'name must have only characters'],//validator dont allow spaces in the name
      match: [/^[a-zA-Z\s]+$/, 'Name must contain only alphabetic characters'], //this validate the name and escape the spaces
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium or difficult',
      },
    },
    // custom validators are boolean function
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be higher than 1'],
      max: [5, 'Rating must be lower than 5'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
      min: [0, 'The price cannt be lower than zero'],
      max: [9999, 'The price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        // this is points on NEW documents only not UPDATE
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount value {VALUE} cannt be greater than price',
      },
    },
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
