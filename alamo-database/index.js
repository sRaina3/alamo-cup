require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose');
const Player = require('./models/player')
const Track = require('./models/track')

const app = express()

app.use(express.json({limit: '50mb'}));
app.use(cors())
app.use(express.static('build'))

app.get('/', (request, response) => {
  response.send('<h1>Server is Functioning!</h1>')
})

const url = process.env.MONGODB_URI;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB');
  });

app.get('/api/players', (request, response) => {
  Player.find({}).then(players => { 
    response.json(players)
  })
})

app.post('/api/players', async (request, response) => {
  try {
    for (let i = 0; i < request.body.length; i++) {
      const player = await Player.findById(request.body[i]._id);
      if (!player) {
        const newPlayer = new Player({ ...request.body[i] });
        await newPlayer.save();
      } else {
        await Player.findByIdAndUpdate(player._id, { ...request.body[i] }, { new: true });
      }
    }
    response.json('success');
  } catch (error) {
    console.error("Error processing request:", error);
    response.status(500).json({ error: "An error occurred while processing the request." });
  }
});

app.get('/api/tracks', (request, response) => {
  Track.find({}).then(tracks => { 
    response.json(tracks)
  })
})

app.post('/api/tracks', async (request, response) => {
  try {
    for (let i = 0; i < request.body.length; i++) {
      const track = await Track.findById(request.body[i]._id);
      if (!track) {
        const newTrack = new Track({ ...request.body[i] });
        await newTrack.save();
      } else {
        await Track.findByIdAndUpdate(trackId, { ...request.body[i] }, { new: true });
      }
    }
    response.json('success');
  } catch (error) {
    console.error("Error processing request:", error);
    response.status(500).json({ error: "An error occurred while processing the request." });
  }
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})