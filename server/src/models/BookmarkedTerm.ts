import mongoose, { Schema } from 'mongoose';
import { IBookmarkedTerm } from '../types';

const BookmarkedTermSchema = new Schema<IBookmarkedTerm>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User',
      index: true,
    },
    term: {
      type: String,
      required: true,
      trim: true,
    },
    explanation: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: 'general',
    },
    language: {
      type: String,
      default: 'en',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
BookmarkedTermSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IBookmarkedTerm>('BookmarkedTerm', BookmarkedTermSchema);
