import { v2 as cloudinary } from 'cloudinary';
import songModel from '../models/song.js'
import albumModel from '../models/album.js';

const createSong = async (req, res) => {
    try {
        const { name, desc, album_id } = req.body;

        const userId = req.userId;  // Lấy thông tin user từ token

        // Kiểm tra xem userId có hợp lệ không
        if (!userId) {
            return res.status(400).send({ message: "user ID is required." });
        }
        const file = req.files.audio[0];  // Lấy file ảnh từ yêu cầ

        // Kiểm tra file đã được gửi chưa
        if (!req.files || !req.files.audio || req.files.audio.length === 0) {
            return res.status(400).send({ message: "Song file is required." });
        } else {
            console.log('File received:', file)
        }

        // Kiểm tra các trường name, desc và album_id
        if (!name || !desc || !album_id) {
            return res.status(400).send({ message: "Name, description, and album ID are required." });
        }

        // Tải file bài hát lên Cloudinary

        const fileUpload = await cloudinary.uploader.upload(file.path, { resource_type: "auto" })
            .then(response => {
                console.log('Cloudinary Response:', response);
                return response;
            })
            .catch(error => {
                console.error('Cloudinary Upload Error:', error);
                throw error; // Ném lỗi lại để xử lý tiếp
            });


        // Tạo bài hát mới
        const newSong = new songModel({
            name,
            desc,
            audio: fileUpload.secure_url,  // Đường dẫn bài hát đã tải lên
            album_id,                    // ID album
            artist: userId          // ID user
        });

        // Lưu bài hát vào cơ sở dữ liệu
        await newSong.save();

        res.status(201).json({
            message: "Song created successfully",
            song: newSong
        });

    } catch (err) {
        console.error("Cloudinary Error:", err);
        res.status(500).json({ message: "Error creating song", error: err.message });
    }
};

// xoá bài hát dựa vào id
const deleteSong = async (req, res) => {
    try {
        const { songId } = req.params;  

        // Kiểm tra nếu songId không tồn tại
        if (!songId) {
            return res.status(400).send({ message: "Song ID is required." });
        }
        const song = await songModel.findById(songId);
        if (!song) {
            return res.status(404).send({ message: "Song not found." });
        }

        // Tìm album chứa bài hát
        const album = await albumModel.findById(song.album_id);  

        // Kiểm tra nếu album không tồn tại
        if (!album) {
            return res.status(404).send({ message: "Album not found." });
        }

        // Kiểm tra quyền của người dùng (admin có quyền xóa bất kỳ bài hát nào)
        if (req.role !== 'admin' && album.artist.toString() !== req.userId) {
            return res.status(403).send({ message: "You are not authorized to delete this song." });
        }
        // Tìm và xóa bài hát
        await songModel.findByIdAndDelete(songId);


        res.status(200).json({ message: "Song deleted successfully." });
    } catch (err) {
        console.error("Error deleting song:", err);
        res.status(500).json({ message: "Error deleting song", error: err.message });
    }
};

// lấy tất cả bài hát
const getAllSong = async (req, res) => {
    try {
        // Lấy tất cả các bài hát từ cơ sở dữ liệu
        const songs = await songModel.find().populate('album_id artist', 'image');  

        // Kiểm tra nếu không có bài hát nào
        if (songs.length === 0) {
            return res.status(404).send({ message: "No songs found." });
        }

        res.status(200).json({
            message: "Songs fetched successfully",
            songs
        });
    } catch (err) {
        console.error("Error fetching songs:", err);
        res.status(500).json({ message: "Error fetching songs", error: err.message });
    }
};

export {
    createSong,
    deleteSong,
    getAllSong
}