const mongoose = require('mongoose')

const trackSchema = new mongoose.Schema({
  _id: String,
  AT: Number,
  ATcount: Number,
})

trackSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Track', trackSchema)