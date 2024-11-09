import { v2 as cloudinary } from 'cloudinary';
import albumModel from '../models/album.js';


const createAlbum = async (req, res) => {
  try {
    const { name, desc, release_date } = req.body;
    const userId = req.userId; 
    // console.log("user ID:", userId);

    if (!userId) {
      return res.status(400).send({ message: "user ID is required." });
    }
    
    if (!req.files || !req.files.image || req.files.image.length === 0) {
      return res.status(400).send({ message: "No image uploaded." });
    }
    const imageFile = req.files.image[0];  
    
    if (!name || !desc || !release_date) {
      return res.status(400).send({ message: "Name, description, and release date are required." });
    }
    
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });

    const newAlbum = new albumModel({
      name,
      desc,
      release_date, 
      image: imageUpload.secure_url, 
      artist: userId
    });

    
    await newAlbum.save();
  
    res.status(201).json({
      message: "Album created successfully",
      album: newAlbum
    });

  } catch (err) {
    console.error("Cloudinary Error:", err);
    res.status(500).json({ message: "Error creating album", error: err.message });
  }
};

// Xoá album
const deleteAlbum = async (req, res) => {
  try {
    const { albumId } = req.params;  

    if (!albumId) {
      return res.status(400).send({ message: "Album ID is required." });
    }

    // Tìm album theo ID
    const album = await albumModel.findById(albumId);

    if (!album) {
      return res.status(404).send({ message: "Album not found." });
    }

      // Kiểm tra quyền của người dùng (admin có quyền xóa bất kỳ bài hát nào)
      if (req.role !== 'admin' && album.artist.toString() !== req.userId) {
        return res.status(403).send({ message: "You are not authorized to delete this song." });
    }

    // Xoá album khỏi cơ sở dữ liệu
    await albumModel.findByIdAndDelete(albumId);

    res.status(200).send({ message: "Album deleted successfully." });

  } catch (err) {
    console.error("Error deleting album:", err);
    res.status(500).send({ message: "Error deleting album", error: err.message });
  }
};

// cập nhật album
const updateAlbum = async (req, res) => {
  try {
    const { id } = req.params; 
    const { name, desc, release_date, image } = req.body;

    // Dữ liệu cần cập nhật
    const updatedData = { name, desc, release_date };

    // Nếu có ảnh mới, upload ảnh lên Cloudinary
    if (image) {
      const imageUpload = await cloudinary.uploader.upload(image.path, { resource_type: "image" });
      updatedData.image = imageUpload.secure_url;
    }

    // Cập nhật album theo ID
    const album = await albumModel.findByIdAndUpdate(id, updatedData, { new: true });

    if (!album) {
      return res.status(404).send({ message: "Album not found." });
    }

    if (album.user_id.toString() !== req.userId) {  
      return res.status(403).send({ message: "You are not authorized to update this album." });
    }

    // Trả về album đã được cập nhật
    res.status(200).send({
      message: "Album updated successfully",
      album
    });

  } catch (err) {
    console.error("Error updating album:", err);
    res.status(500).send({ message: "Error updating album", error: err.message });
  }
};
// lấy tất cả album
// Import album model

const getAllAlbums = async (req, res) => {
  try {
    // Lấy tất cả các album từ cơ sở dữ liệu
    const albums = await albumModel.find();

    if (albums.length === 0) {
      return res.status(404).send({ message: "No albums found." });
    }

    // Trả về danh sách album
    res.status(200).send({
      message: "Albums fetched successfully",
      albums
    });
  } catch (err) {
    console.error("Error fetching albums:", err);
    res.status(500).send({ message: "Error fetching albums", error: err.message });
  }
};


export {
  createAlbum,
  deleteAlbum,
  updateAlbum,
  getAllAlbums

}


