import { Response } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/User';
import Activity from '../models/Activity';
import { AuthRequest } from '../types';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array(),
      });
      return;
    }

    const { email, password, displayName } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
      return;
    }

    // Create user
    const user = await User.create({
      email,
      password,
      displayName,
    });

    // Log activity
    await Activity.create({
      userId: user._id.toString(),
      action: 'register',
      feature: 'auth',
      metadata: { email },
    });

    // Generate token
    const token = user.generateAuthToken();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        preferences: user.preferences,
        geminiApiKey: user.geminiApiKey || '',
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array(),
      });
      return;
    }

    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Log activity
    await Activity.create({
      userId: user._id.toString(),
      action: 'login',
      feature: 'auth',
      metadata: { email },
    });

    // Generate token
    const token = user.generateAuthToken();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        preferences: user.preferences,
        geminiApiKey: user.geminiApiKey || '',
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message,
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);

    res.status(200).json({
      success: true,
      user: {
        id: user?._id,
        email: user?.email,
        displayName: user?.displayName,
        avatar: user?.avatar,
        preferences: user?.preferences,
        geminiApiKey: user?.geminiApiKey,
        isEmailVerified: user?.isEmailVerified,
        createdAt: user?.createdAt,
        lastLogin: user?.lastLogin,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message,
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/update-profile
// @access  Private
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array(),
      });
      return;
    }

    const { displayName, avatar, preferences, geminiApiKey } = req.body;

    console.log('[updateProfile] Request received:', {
      userId: req.user?._id,
      hasDisplayName: !!displayName,
      hasGeminiApiKey: geminiApiKey !== undefined,
      geminiApiKeyLength: geminiApiKey?.length || 0,
    });

    const user = await User.findById(req.user?._id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Update fields
    if (displayName) user.displayName = displayName;
    if (avatar) user.avatar = avatar;
    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
    }
    if (geminiApiKey !== undefined) {
      // Trim and validate the API key
      const cleanKey = geminiApiKey?.trim();
      user.geminiApiKey = cleanKey || '';
      console.log('[updateProfile] Setting geminiApiKey:', {
        original: geminiApiKey?.length || 0,
        cleaned: cleanKey?.length || 0,
      });
    }

    await user.save();

    console.log('[updateProfile] User saved, geminiApiKey length:', user.geminiApiKey?.length || 0);

    // Log activity
    await Activity.create({
      userId: user._id.toString(),
      action: 'update_profile',
      feature: 'auth',
      metadata: { displayName, preferences, geminiApiKeyUpdated: geminiApiKey !== undefined },
    });

    const responseUser = {
      id: user._id,
      email: user.email,
      displayName: user.displayName,
      avatar: user.avatar,
      preferences: user.preferences,
      geminiApiKey: user.geminiApiKey,
    };

    console.log('[updateProfile] Sending response with geminiApiKey length:', responseUser.geminiApiKey?.length || 0);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: responseUser,
    });
  } catch (error: any) {
    console.error('[updateProfile] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message,
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Log activity
    if (req.user) {
      await Activity.create({
        userId: req.user._id.toString(),
        action: 'logout',
        feature: 'auth',
        metadata: {},
      });
    }

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error logging out',
      error: error.message,
    });
  }
};
