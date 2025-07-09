import express from 'express';
import { searchMovies,getMovieById,getMovieAnalytics} from '../components/movieController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, searchMovies); 
router.get('/:id', verifyToken, getMovieById);
router.get('/analytics', verifyToken, getMovieAnalytics);

export default router;
