import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DatabaseService } from './database';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Keep Supabase client for auth and storage only
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Export database service
export { DatabaseService };

// Define types manually for React Native compatibility
export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';
export type ClassType = 'LIVE' | 'RECORDED';
export type VideoVisibility = 'PUBLIC' | 'PRIVATE';
export type AsanaDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface UserType {
  id: string;
  clerkId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: Date;
}

export interface Class {
  id: string;
  title: string;
  description?: string;
  teacher_id: string;
  type: 'live' | 'recorded';
  start_at?: string;
  duration_minutes: number;
  video_url?: string;
  thumbnail_url?: string;
  meeting_link?: string;
  price?: number;
  level?: 'beginner' | 'intermediate' | 'advanced';
  created_at: string;
  teacher?: {
    name: string;
    email: string;
  };
}

// Keep the old interface for backward compatibility
export interface ClassModel {
  id: string;
  title: string;
  description?: string;
  teacherId: string;
  type: ClassType;
  startAt?: Date;
  durationMinutes: number;
  videoId?: string;
  meetingLink?: string;
  createdAt: Date;
}

export interface VideoType {
  id: string;
  storagePath: string;
  title: string;
  description?: string;
  uploadedBy: string;
  visibility: VideoVisibility;
  createdAt: Date;
}

export interface AsanaType {
  id: string;
  name: string;
  sanskrit_name: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  steps: string;
  benefits: string;
  precautions: string;
  image_url?: string;
  created_at: string;
}

export interface BlogPostType {
  id: string;
  title: string;
  slug: string;
  content: string;
  author_id: string;
  tags: string[];
  published_at: string;
  featured_image?: string;
  created_at: string;
  author?: {
    name: string;
    email: string;
  };
}

export interface MessageType {
  id: string;
  room: string;
  senderId: string;
  content: string;
  createdAt: Date;
}

export interface ContactMessageType {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

// Type aliases for backward compatibility
export type User = UserType;
export type Video = VideoType;
export type Asana = AsanaType;
export type BlogPost = BlogPostType;
export type Message = MessageType;
export type ContactMessage = ContactMessageType;