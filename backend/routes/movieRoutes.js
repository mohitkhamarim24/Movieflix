import express from 'express';
import { searchMovies } from '../components/movieController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, searchMovies); // 🔐 protected

export default router;
