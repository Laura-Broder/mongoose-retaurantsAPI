const mongoose = require("mongoose");
const validator = require("validator");
const { Schema } = mongoose;

const addressSchema = new Schema({
  building: String,
  street: String,
  zipcode: Number,
  coord: {
    type: Array,
    validate(value) {
      validator.isLatLong(`${value[0]}, ${value[1]}`);
    },
  },
});

const restSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  borough: {
    type: String,
  },
  cuisine: {
    type: String,
  },
  restaurant_id: {
    type: Number,
    required: true,
    validate(value) {
      if (value < 0) {
        throw new Error("Restaurant id must be a positive number");
      }
    },
  },
  address: {
    type: addressSchema,
  },
});

const Restaurant = mongoose.model("Restaurant", restSchema);

module.exports = Restaurant;
