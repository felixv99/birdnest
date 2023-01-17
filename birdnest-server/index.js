const {Server} = require('socket.io')
const http = require('http')
const app = require('./app')
const dronesService = require('./services/drones')
const dronesController = require('./controllers/drones')
const config = require('./utils/config')
const logger = require('./utils/logger')

const server = http.createServer(app)
const io = new Server(server,{
  /*cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }*/
})

io.on('connection', (socket) => {
  console.log(`Client connected ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} disconnected`);
  });
});

setInterval(() => {
    const droneserver = async () => {
        const drones = await dronesService.dronesAPI()
        io.emit('drones', drones)

        await Promise.all(drones.map( drone => {
            const dronex = drone.positionX._text
            const droney = drone.positionY._text
            const drone_distance = Math.sqrt(Math.pow((250000-dronex),2) + Math.pow((250000-droney),2))
            if (drone_distance < 100000) {
                dronesService.getPilot(drone.serialNumber._text)
                .then(pilot => {
                    dronesController.getViolatedData(drone.serialNumber._text)
                    .then(violatedData => {
                        if(violatedData) {
                            var updateData = {}
                            if(violatedData.closestDistance > drone_distance) {
                                updateData["closestDistance"] = drone_distance
                            }
                            updateData["enterTime"] = Math.floor(Date.now() / 1000)
                            dronesController.updateViolatedData(drone.serialNumber._text,updateData)
                        } else {
                            const droneObject = {
                                serial: drone.serialNumber._text,
                                name: pilot.firstName + ' ' + pilot.lastName,
                                email: pilot.email,
                                phone: pilot.phoneNumber,
                                closestDistance: Math.round(drone_distance/1000),
                                enterTime: Math.floor(Date.now() / 1000)
                              }
                            dronesController.addViolatedData(droneObject)
                        }
                    })
                })
            }
        }))
    }
    droneserver()
}, 2000)

setInterval(()=>{
    const violations = async () => {
        const violatedDrones = await dronesController.getAllViolatedData()
        const newViolatedDrones = violatedDrones.filter( vdrone => {
            if(Math.floor(Date.now() / 1000) - vdrone.enterTime > 600) {
            dronesController.removeViolatedData(vdrone.serial)
            return false
            } else {
            return true
            }
        })
        io.emit('viodrones', newViolatedDrones)
    }
    violations()
},2000)


server.listen(config.PORT, err=> {
  if(err) logger.error(err)
  logger.info('WebSocket server running on Port ', config.PORT)
})
