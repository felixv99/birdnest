
import './App.css';
import io from 'socket.io-client';
import { useState, useEffect} from 'react'
const location = document.location
/*
let socket;
if (location.hostname === "localhost") {
  socket = io.connect(`http://localhost:5000`);
} else {
  socket = io.connect(`wss://${location.host}/`); 
}*/
const socket = io.connect(`wss://${location.host}/`); 

const VisualDrone = ({coordinates}) => {
  const droneStyle = {
    left: `${Math.round(coordinates.x/1000)}px`,
    bottom: `${Math.round(coordinates.y/1000)}px`
  }
  return (
    <div className="drone" style={droneStyle}></div>
  )
}

const Drone = ({drone}) => {
  const secondsSinceViolation = Math.floor(Date.now() / 1000) - drone.enterTime
  const minutes = Math.floor( secondsSinceViolation / 60)
  const seconds = secondsSinceViolation - (minutes * 60)
  return (
    <div className="drone-info-box">
      <div>Serial: {drone.serial}</div>
      <div>Pilot: {drone.name}</div>
      <div>Email: {drone.email}</div>
      <div>Tel: {drone.phone}</div>
      <div>Time since violation: {minutes} min  {seconds} s</div>
      <div>Closest distance: {drone.closestDistance} m</div>
    </div>
  )
}

const App = () => {
  const [drones, setDrones] = useState([])
  const [violatedDrones, setViolatedDrones] = useState([])

  useEffect(() => {

    socket.on('drones', (data) => {
      setDrones(data)
    })

    socket.on('viodrones', (data) => {
      setViolatedDrones(data)
    })

    return () => {
      socket.off('drones')
      socket.off('viodrones')
    };
  }, [])

  return (
    <div id="site-container">
      <div id="drone-info-container-outer">
        <div style={{width: "100%", borderBottom: "1px solid black", textAlign: "center"}}><h3>Violations in the past 10 minutes</h3></div>
        <div id="drone-info-container">
          {Object.keys(violatedDrones).length !== 0 ? violatedDrones.map( drone => <Drone key={drone.serial} drone={drone}/>)
          : <></>}
        </div>
      </div>
      <div id="drone-container">
        <div id="circle">
          <div id="inner-circle">
            <div id="nest"></div>
          </div>
          {Object.keys(drones).length !== 0 ? drones.map( drone => <VisualDrone key={drone.serialNumber._text} coordinates={{x: drone.positionX._text, y: drone.positionY._text}}/>)
          : <></>
          }
        </div>
        <div id="graph-info-container">
          <div className="graph-info-pair">
            <p className="p-info">Nest: </p>
            <div id="nest" style={{position:"relative"}}></div>
          </div>
          <div className="graph-info-pair">
            <p className="p-info">Drone: </p>
            <div className="drone" style={{position:"relative"}}></div>
          </div>
          <div className="graph-info-pair">
            <p className="p-info">500m radius: </p>
            <div className="info-line" style={{background: "black"}}></div>
          </div>
          <div className="graph-info-pair">
            <p className="p-info">100m radius: </p>
            <div className="info-line" style={{background: "red"}}></div>
          </div>
        </div>
      </div>
   </div>
  );
}

export default App;
