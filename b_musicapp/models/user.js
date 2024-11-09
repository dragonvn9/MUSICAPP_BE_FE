import mongoose from "mongoose";

const artistSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: {
        type: String,
        required: true
    },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['admin','artist', 'listener'], 
        required: true,  
      }
  })

const artistModel = mongoose.model('User', artistSchema)
export default artistModel