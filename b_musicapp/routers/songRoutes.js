import {Router} from 'express'
import upload from '../authMiddleware/multer.js';

import authMiddleware from '../authMiddleware/authMiddleware.js';
import { createSong, deleteSong, getAllSong } from '../controllers/songController.js';

const router = new Router()

router.post('/add-song',authMiddleware, upload.fields([{ name: 'audio', maxCount: 1 }]), createSong); 
router.delete('/delete-song/:songId',authMiddleware, deleteSong);
router.get('/all-song', getAllSong);


export default router 