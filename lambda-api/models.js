const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  _id: String,
  ATcount: Number,
  WRcount: Number,
  Mapcount: Number,
});

playerSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Player = mongoose.model('Player', playerSchema);

const trackSchema = new mongoose.Schema({
  _id: String,
  AT: Number,
  ATcount: Number,
});

trackSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Track = mongoose.model('Track', trackSchema);

module.exports = { Player, Track };