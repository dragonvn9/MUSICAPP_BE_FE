import mongoose from "mongoose";

  const songSchema = new mongoose.Schema({
    name: String,
    desc: String,
    audio : String,
    album_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', required: true },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Liên kết với model 'User' (nghĩa là Artist)
      required: true,
    }
  })

  const songtModel = mongoose.model('Song', songSchema)
  export default songtModel

