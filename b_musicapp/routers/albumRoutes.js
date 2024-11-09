import {Router} from 'express'
import upload from '../authMiddleware/multer.js';
import { createAlbum, deleteAlbum, getAllAlbums, updateAlbum } from '../controllers/albumController.js';
import authMiddleware from '../authMiddleware/authMiddleware.js';

const router = new Router()

router.post('/add-album',authMiddleware, upload.fields([{ name: 'image', maxCount: 1 }]), createAlbum); 
router.delete('/delete-album/:albumId', authMiddleware, deleteAlbum);
router.put('/:id', authMiddleware,upload.fields([{ name: 'image', maxCount: 1 }]), updateAlbum);
router.get('/', getAllAlbums);


export default router