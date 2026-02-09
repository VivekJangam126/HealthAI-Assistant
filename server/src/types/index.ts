import { Request } from 'express';
import { Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  displayName: string;
  avatar?: string;
  preferences: {
    language: string;
    theme: 'light' | 'dark';
    notifications: boolean;
  };
  isEmailVerified: boolean;
  geminiApiKey?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
}

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface IHistory extends Document {
  userId: string;
  feature: 'symptoms' | 'drugs' | 'terms' | 'reports' | 'chat' | 'medical-image' | 'medicine' | 'policy';
  title: string;
  messages: {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    attachments?: string[];
  }[];
  tags: string[];
  bookmarked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBookmarkedTerm extends Document {
  userId: string;
  term: string;
  explanation: string;
  category: string;
  language: string;
  createdAt: Date;
}

export interface IActivity extends Document {
  userId: string;
  action: string;
  feature: string;
  metadata: any;
  createdAt: Date;
}
