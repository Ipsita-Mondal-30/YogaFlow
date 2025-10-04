-- Yoga Flow App Database Schema
-- Run this SQL in your Supabase SQL Editor to create the required tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types/enums
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE class_type AS ENUM ('live', 'recorded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE video_visibility AS ENUM ('public', 'private');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE asana_difficulty AS ENUM ('beginner', 'intermediate', 'advanced');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE class_level AS ENUM ('beginner', 'intermediate', 'advanced');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE enrollment_status AS ENUM ('enrolled', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Users table (synced with Clerk)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    avatar_url TEXT,
    role user_role DEFAULT 'student',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Teacher-specific fields
    bio TEXT,
    specialization TEXT,
    certifications TEXT[] DEFAULT '{}',
    experience_years INTEGER,
    hourly_rate DECIMAL(10,2),
    
    -- Student-specific fields
    subscription_plan TEXT DEFAULT 'free',
    subscription_end TIMESTAMPTZ,
    total_classes_joined INTEGER DEFAULT 0
);

-- Classes table
CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type class_type NOT NULL,
    start_at TIMESTAMPTZ,
    duration_minutes INTEGER DEFAULT 60,
    video_id UUID,
    meeting_link TEXT,
    max_students INTEGER,
    price DECIMAL(10,2),
    level class_level DEFAULT 'beginner',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Videos table
CREATE TABLE IF NOT EXISTS videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    storage_path TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    visibility video_visibility DEFAULT 'private',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Asanas table
CREATE TABLE IF NOT EXISTS asanas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    sanskrit_name TEXT NOT NULL,
    difficulty asana_difficulty NOT NULL,
    steps TEXT NOT NULL,
    benefits TEXT NOT NULL,
    precautions TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tags TEXT[] DEFAULT '{}',
    published_at TIMESTAMPTZ,
    featured_image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room TEXT DEFAULT 'general',
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    status enrollment_status DEFAULT 'enrolled',
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    UNIQUE(student_id, class_id)
);

-- Add foreign key constraint for video_id in classes table (if not exists)
DO $$ BEGIN
    ALTER TABLE classes ADD CONSTRAINT fk_classes_video_id 
        FOREIGN KEY (video_id) REFERENCES videos(id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_classes_type ON classes(type);
CREATE INDEX IF NOT EXISTS idx_classes_start_at ON classes(start_at);
CREATE INDEX IF NOT EXISTS idx_messages_room ON messages(room);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_class_id ON enrollments(class_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies (drop existing policies first)

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view profiles" ON users;
DROP POLICY IF EXISTS "Users can update profiles" ON users;
DROP POLICY IF EXISTS "Allow user creation" ON users;
DROP POLICY IF EXISTS "Classes are viewable by everyone" ON classes;
DROP POLICY IF EXISTS "Teachers can manage classes" ON classes;
DROP POLICY IF EXISTS "Messages are viewable by everyone" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;
DROP POLICY IF EXISTS "Students can view enrollments" ON enrollments;
DROP POLICY IF EXISTS "Students can enroll in classes" ON enrollments;
DROP POLICY IF EXISTS "Blog posts are viewable by everyone" ON blog_posts;
DROP POLICY IF EXISTS "Authors can manage posts" ON blog_posts;
DROP POLICY IF EXISTS "Public videos are viewable by everyone" ON videos;
DROP POLICY IF EXISTS "Private videos are viewable" ON videos;
DROP POLICY IF EXISTS "Users can upload videos" ON videos;
DROP POLICY IF EXISTS "Asanas are viewable by everyone" ON asanas;
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON contact_messages;

-- Users can read all user data (needed for app functionality)
CREATE POLICY "Users can view profiles" ON users
    FOR SELECT USING (true);

-- Users can update all user data (Clerk handles auth)
CREATE POLICY "Users can update profiles" ON users
    FOR UPDATE USING (true);

-- Allow any client to insert users (Clerk handles authentication)
CREATE POLICY "Allow user creation" ON users
    FOR INSERT WITH CHECK (true);

-- Classes are viewable by everyone
CREATE POLICY "Classes are viewable by everyone" ON classes
    FOR SELECT USING (true);

-- Teachers can manage their own classes (simplified for Clerk auth)
CREATE POLICY "Teachers can manage classes" ON classes
    FOR ALL USING (true);

-- Messages are viewable by everyone
CREATE POLICY "Messages are viewable by everyone" ON messages
    FOR SELECT USING (true);

-- Users can send messages (Clerk handles authentication)
CREATE POLICY "Users can send messages" ON messages
    FOR INSERT WITH CHECK (true);

-- Students can view enrollments (simplified for Clerk auth)
CREATE POLICY "Students can view enrollments" ON enrollments
    FOR SELECT USING (true);

-- Students can enroll in classes (simplified for Clerk auth)
CREATE POLICY "Students can enroll in classes" ON enrollments
    FOR INSERT WITH CHECK (true);

-- Blog posts are viewable by everyone
CREATE POLICY "Blog posts are viewable by everyone" ON blog_posts
    FOR SELECT USING (published_at IS NOT NULL);

-- Authors can manage blog posts (simplified for Clerk auth)
CREATE POLICY "Authors can manage posts" ON blog_posts
    FOR ALL USING (true);

-- Videos are viewable based on visibility
CREATE POLICY "Public videos are viewable by everyone" ON videos
    FOR SELECT USING (visibility = 'public');

-- Private videos are viewable by all (simplified for Clerk auth)
CREATE POLICY "Private videos are viewable" ON videos
    FOR SELECT USING (true);

-- Users can upload videos (simplified for Clerk auth)
CREATE POLICY "Users can upload videos" ON videos
    FOR INSERT WITH CHECK (true);

-- Asanas and contact messages are viewable by everyone
CREATE POLICY "Asanas are viewable by everyone" ON asanas
    FOR SELECT USING (true);

CREATE POLICY "Anyone can submit contact messages" ON contact_messages
    FOR INSERT WITH CHECK (true);

-- Create a function to handle user sync from Clerk
CREATE OR REPLACE FUNCTION handle_user_sync()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the updated_at timestamp
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at column to users table (if not exists)
DO $$ BEGIN
    ALTER TABLE users ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Create trigger for updated_at (drop if exists first)
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION handle_user_sync();

-- Insert some sample data for testing
INSERT INTO asanas (name, sanskrit_name, difficulty, steps, benefits, precautions) VALUES
('Mountain Pose', 'Tadasana', 'beginner', 'Stand tall with feet hip-width apart, arms at sides', 'Improves posture, strengthens legs', 'None'),
('Downward Dog', 'Adho Mukha Svanasana', 'beginner', 'Start on hands and knees, lift hips up and back', 'Stretches hamstrings, strengthens arms', 'Avoid if you have wrist injuries'),
('Warrior I', 'Virabhadrasana I', 'intermediate', 'Step one foot back, bend front knee, raise arms overhead', 'Strengthens legs, opens hips', 'Be careful with knee alignment'),
('Tree Pose', 'Vrikshasana', 'intermediate', 'Stand on one leg, place other foot on inner thigh', 'Improves balance, strengthens core', 'Avoid placing foot on side of knee'),
('Crow Pose', 'Bakasana', 'advanced', 'Squat, place hands on floor, balance on arms', 'Strengthens arms and core', 'Use props for support when learning');

-- Success message
SELECT 'Database schema created successfully! You can now sync users from Clerk.' as message;