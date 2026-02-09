import { Response } from 'express';
import History from '../models/History';
import Activity from '../models/Activity';
import { AuthRequest } from '../types';

// @desc    Create or update conversation history
// @route   POST /api/history
// @access  Private
export const createHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { feature, title, messages, tags } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
      return;
    }

    // Create new history
    const history = await History.create({
      userId: userId.toString(),
      feature,
      title: title || messages[0]?.content.substring(0, 50) || 'Untitled',
      messages,
      tags: tags || [],
      bookmarked: false,
    });

    // Log activity
    await Activity.create({
      userId: userId.toString(),
      action: 'create_history',
      feature: 'history',
      metadata: { historyId: history._id.toString(), feature },
    });

    res.status(201).json({
      success: true,
      message: 'Conversation saved',
      history,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error saving conversation',
      error: error.message,
    });
  }
};

// @desc    Get all user's conversation history
// @route   GET /api/history
// @access  Private
export const getHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const feature = req.query.feature as string;
    const bookmarked = req.query.bookmarked === 'true';
    const search = req.query.search as string;

    if (!userId) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
      return;
    }

    // Build query
    const query: any = { userId: userId.toString() };
    if (feature) query.feature = feature;
    if (bookmarked) query.bookmarked = true;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'messages.content': { $regex: search, $options: 'i' } },
      ];
    }

    // Get total count
    const total = await History.countDocuments(query);

    // Get paginated results
    const history = await History.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-messages'); // Exclude messages for list view

    res.status(200).json({
      success: true,
      history,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching history',
      error: error.message,
    });
  }
};

// @desc    Get single conversation
// @route   GET /api/history/:id
// @access  Private
export const getHistoryById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
      return;
    }

    const history = await History.findOne({ _id: id, userId: userId.toString() });

    if (!history) {
      res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      history,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching conversation',
      error: error.message,
    });
  }
};

// @desc    Update conversation (add messages)
// @route   PUT /api/history/:id
// @access  Private
export const updateHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;
    const { messages, title, tags } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
      return;
    }

    const history = await History.findOne({ _id: id, userId: userId.toString() });

    if (!history) {
      res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
      return;
    }

    // Update fields
    if (messages) history.messages = messages;
    if (title) history.title = title;
    if (tags) history.tags = tags;

    await history.save();

    res.status(200).json({
      success: true,
      message: 'Conversation updated',
      history,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating conversation',
      error: error.message,
    });
  }
};

// @desc    Delete conversation
// @route   DELETE /api/history/:id
// @access  Private
export const deleteHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
      return;
    }

    const history = await History.findOneAndDelete({ _id: id, userId: userId.toString() });

    if (!history) {
      res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
      return;
    }

    // Log activity
    await Activity.create({
      userId: userId.toString(),
      action: 'delete_history',
      feature: 'history',
      metadata: { historyId: id },
    });

    res.status(200).json({
      success: true,
      message: 'Conversation deleted',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting conversation',
      error: error.message,
    });
  }
};

// @desc    Toggle bookmark
// @route   POST /api/history/:id/bookmark
// @access  Private
export const toggleBookmark = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
      return;
    }

    const history = await History.findOne({ _id: id, userId: userId.toString() });

    if (!history) {
      res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
      return;
    }

    history.bookmarked = !history.bookmarked;
    await history.save();

    res.status(200).json({
      success: true,
      message: history.bookmarked ? 'Bookmarked' : 'Bookmark removed',
      bookmarked: history.bookmarked,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error toggling bookmark',
      error: error.message,
    });
  }
};

// @desc    Get history by feature type
// @route   GET /api/history/feature/:type
// @access  Private
export const getHistoryByFeature = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { type } = req.params;

    if (!userId) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
      return;
    }

    const history = await History.find({ userId: userId.toString(), feature: type })
      .sort({ createdAt: -1 })
      .select('-messages');

    res.status(200).json({
      success: true,
      history,
      count: history.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching history',
      error: error.message,
    });
  }
};
