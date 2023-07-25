require('dotenv').config()
const express = require('express')
const cors = require('cors')
const MapRecords = require('./models/mapRecords')

const app = express()

app.use(express.json({limit: '50mb'}));
app.use(cors())
app.use(express.static('build'))

app.get('/', (request, response) => {
  response.send('<h1>Server is Functioning!</h1>')
})

app.get('/api/mapRecords', (request, response) => {
  MapRecords.find({}).then(records => { 
    response.json(records)
  })
})

app.post('/api/mapRecords', (request, response) => {
  MapRecords.find({_id: request.body._id}).then(maps => {
    if (maps.length === 0) {
      const newMapRecords = new MapRecords({
        ...request.body,
      });
      newMapRecords.save().then(p => {
        response.json(p)
      })
    } else {
      let newMapRecord = ({
        ...request.body,
      });
      MapRecords.findByIdAndUpdate(maps[0]._id, newMapRecord)
        .then(oldMapRecord => {
          response.json(oldMapRecord)
        })
        .catch(error => next(error))
    }
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})