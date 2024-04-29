const mongoose = require('mongoose');
const Joi = require('joi');

 const schema = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    price: Joi.number().required(),
    description: Joi.string().min(5).max(300).required()
})
module.exports = schema 


//Custom validator function for price
// function priceValidator(value) {
//   // Check if value is a string with both numbers and alphabetic characters
//   if (typeof value !== 'string' || !/^(?=.*[0-9])(?=.*[a-zA-Z])/.test(value)) {
//     return false;
//   }
//   return true;
// }



const fuelTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3 // Minimum length requirement for name
  },
  price: {
    type:Number, // Change to string type
    required: true,
  },
  description: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('FuelType', fuelTypeSchema);
