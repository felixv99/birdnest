
const Drone = require('../models/drone')

const getViolatedData = async (serial) => {
    return await Drone.findOne({serial: serial})
    
}

const addViolatedData = async (data) => {
    const obj = new Drone({ ...data})
    console.log(data.serial, " added")
    return await obj.save()
}

const updateViolatedData = async (serial, data) => {
        console.log(serial," updated")
        return await Drone.findOneAndUpdate({serial: serial}, data, { new: true })     

}

const getAllViolatedData = async () => {
    return await Drone.find({}).populate()
}

const removeViolatedData = async (serial) => {
    console.log(serial," removed")
    await Drone.deleteOne({serial: serial})
}


module.exports = {getViolatedData, addViolatedData, updateViolatedData, getAllViolatedData, removeViolatedData};