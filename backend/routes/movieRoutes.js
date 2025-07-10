import express from 'express';
import { getMovieById,getMovieAnalytics,getMovies} from '../components/movieController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getMovies);
router.get('/:id', verifyToken, getMovieById);
router.get('/analytics', verifyToken, getMovieAnalytics);


export default router;
