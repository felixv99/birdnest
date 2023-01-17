const mongoose = require('mongoose')

const droneSchema = mongoose.Schema({
    serial: {
        type: String,
        required: true
      },
    name: {
        type: String,
        required: true
      },
    email: String,
    phone: String,
    closestDistance: Number,
    enterTime: {
      type: Number,
    }
  })

  droneSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
  

module.exports = mongoose.model('Drone', droneSchema)