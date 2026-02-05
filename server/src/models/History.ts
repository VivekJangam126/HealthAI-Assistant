import mongoose, { Schema } from 'mongoose';
import { IHistory } from '../types';

const HistorySchema = new Schema<IHistory>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User',
      index: true,
    },
    feature: {
      type: String,
      required: true,
      enum: ['symptoms', 'drugs', 'terms', 'reports', 'chat', 'medical-image', 'medicine', 'policy'],
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    messages: [
      {
        role: {
          type: String,
          enum: ['user', 'assistant'],
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        attachments: [String],
      },
    ],
    tags: [String],
    bookmarked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
HistorySchema.index({ userId: 1, createdAt: -1 });
HistorySchema.index({ userId: 1, feature: 1 });
HistorySchema.index({ userId: 1, bookmarked: 1 });

export default mongoose.model<IHistory>('History', HistorySchema);
