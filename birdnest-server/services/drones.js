const axios = require('axios')
var convert = require('xml-js')


const dronesAPI = async () => {
    const res = await axios.get(`https://assignments.reaktor.com/birdnest/drones`)
    const json_data = convert.xml2json(res.data, {compact: true, ignoreDeclaration: true})
    const parsed_data = JSON.parse(json_data)
    const drones_data = parsed_data.report.capture.drone
    return drones_data
}

const getPilot = async (serial) => {
    const res = await axios.get(`https://assignments.reaktor.com/birdnest/pilots/${serial}`)
    return res.data
}

module.exports = {dronesAPI, getPilot};