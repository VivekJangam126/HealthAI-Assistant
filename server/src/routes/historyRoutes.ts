import express from 'express';
import {
  createHistory,
  getHistory,
  getHistoryById,
  updateHistory,
  deleteHistory,
  toggleBookmark,
  getHistoryByFeature,
} from '../controllers/historyController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// All routes are protected
router.use(protect);

// Main routes
router.post('/', createHistory);
router.get('/', getHistory);
router.get('/feature/:type', getHistoryByFeature);
router.get('/:id', getHistoryById);
router.put('/:id', updateHistory);
router.delete('/:id', deleteHistory);
router.post('/:id/bookmark', toggleBookmark);

export default router;
