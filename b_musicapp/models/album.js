import mongoose from "mongoose";

  const albumSchema = new mongoose.Schema({
    image: String,
    name: String,
    desc: String,
    release_date: Date,
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Liên kết với model 'User' (nghĩa là Artist)
    }
  })

  const albumModel = mongoose.model('Album', albumSchema)
  export default albumModel