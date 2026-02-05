import mongoose, { Schema } from 'mongoose';
import { IActivity } from '../types';

const ActivitySchema = new Schema<IActivity>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User',
      index: true,
    },
    action: {
      type: String,
      required: true,
    },
    feature: {
      type: String,
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
ActivitySchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IActivity>('Activity', ActivitySchema);
