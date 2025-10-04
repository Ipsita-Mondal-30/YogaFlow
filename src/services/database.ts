// Note: Prisma Client doesn't work directly in React Native
// This is a mock implementation for development
// In production, you would use API calls to a backend server

// Mock Prisma client for React Native compatibility
const createMockPrismaClient = () => {
  return {
    user: {
      create: async (data: any) => {
        console.log('Mock: Creating user', data);
        return { id: 'mock-id', ...data.data };
      },
      findUnique: async (query: any) => {
        console.log('Mock: Finding user', query);
        return null; // Return null for now
      },
      findMany: async (query?: any) => {
        console.log('Mock: Finding users', query);
        return [];
      },
    },
    class: {
      findMany: async (query?: any) => {
        console.log('Mock: Finding classes', query);
        return [];
      },
      create: async (data: any) => {
        console.log('Mock: Creating class', data);
        return { id: 'mock-class-id', ...data };
      },
    },
    video: {
      findMany: async (query?: any) => {
        console.log('Mock: Finding videos', query);
        return [];
      },
      create: async (data: any) => {
        console.log('Mock: Creating video', data);
        return { id: 'mock-video-id', ...data };
      },
    },
    asana: {
      findMany: async (query?: any) => {
        console.log('Mock: Finding asanas', query);
        return [];
      },
    },
    blogPost: {
      findMany: async (query?: any) => {
        console.log('Mock: Finding blog posts', query);
        return [];
      },
      create: async (data: any) => {
        console.log('Mock: Creating blog post', data);
        return { id: 'mock-blog-id', ...data };
      },
    },
    message: {
      findMany: async (query?: any) => {
        console.log('Mock: Finding messages', query);
        return [];
      },
      create: async (data: any) => {
        console.log('Mock: Creating message', data);
        return { id: 'mock-message-id', ...data };
      },
    },
    contactMessage: {
      create: async (data: any) => {
        console.log('Mock: Creating contact message', data);
        return { id: 'mock-contact-id', ...data };
      },
      findMany: async (query?: any) => {
        console.log('Mock: Finding contact messages', query);
        return [];
      },
    },
  };
};

export const prisma = createMockPrismaClient();

// Database service functions
export class DatabaseService {
  // User operations
  static async createUser(data: {
    clerkId: string;
    name: string;
    email: string;
    avatarUrl?: string;
    role?: 'STUDENT' | 'TEACHER' | 'ADMIN';
  }) {
    return await prisma.user.create({
      data: {
        clerkId: data.clerkId,
        name: data.name,
        email: data.email,
        avatarUrl: data.avatarUrl,
        role: data.role || 'STUDENT',
      },
    });
  }

  static async getUserByClerkId(clerkId: string) {
    return await prisma.user.findUnique({
      where: { clerkId },
    });
  }

  static async getAllUsers() {
    return await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // Class operations
  static async getAllClasses() {
    return await prisma.class.findMany({
      include: {
        teacher: true,
        video: true,
      },
      orderBy: { startAt: 'asc' },
    });
  }

  static async createClass(data: {
    title: string;
    description?: string;
    teacherId: string;
    type: 'LIVE' | 'RECORDED';
    startAt?: Date;
    durationMinutes?: number;
    videoId?: string;
    meetingLink?: string;
  }) {
    return await prisma.class.create({
      data,
      include: {
        teacher: true,
        video: true,
      },
    });
  }

  // Video operations
  static async getAllVideos() {
    return await prisma.video.findMany({
      include: {
        uploader: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getPublicVideos() {
    return await prisma.video.findMany({
      where: { visibility: 'PUBLIC' },
      include: {
        uploader: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createVideo(data: {
    storagePath: string;
    title: string;
    description?: string;
    uploadedBy: string;
    visibility?: 'PUBLIC' | 'PRIVATE';
  }) {
    return await prisma.video.create({
      data: {
        ...data,
        visibility: data.visibility || 'PRIVATE',
      },
      include: {
        uploader: true,
      },
    });
  }

  // Asana operations
  static async getAllAsanas() {
    return await prisma.asana.findMany({
      orderBy: { name: 'asc' },
    });
  }

  static async getAsanasByDifficulty(difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED') {
    return await prisma.asana.findMany({
      where: { difficulty },
      orderBy: { name: 'asc' },
    });
  }

  static async searchAsanas(query: string) {
    return await prisma.asana.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { sanskritName: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { name: 'asc' },
    });
  }

  // Blog post operations
  static async getPublishedBlogPosts() {
    return await prisma.blogPost.findMany({
      where: {
        publishedAt: {
          not: null,
        },
      },
      include: {
        author: true,
      },
      orderBy: { publishedAt: 'desc' },
    });
  }

  static async createBlogPost(data: {
    title: string;
    slug: string;
    content: string;
    authorId: string;
    tags?: string[];
    publishedAt?: Date;
    featuredImage?: string;
  }) {
    return await prisma.blogPost.create({
      data,
      include: {
        author: true,
      },
    });
  }

  // Message operations
  static async getMessagesByRoom(room: string = 'general', limit: number = 50) {
    return await prisma.message.findMany({
      where: { room },
      include: {
        sender: true,
      },
      orderBy: { createdAt: 'asc' },
      take: limit,
    });
  }

  static async createMessage(data: {
    room?: string;
    senderId: string;
    content: string;
  }) {
    return await prisma.message.create({
      data: {
        room: data.room || 'general',
        senderId: data.senderId,
        content: data.content,
      },
      include: {
        sender: true,
      },
    });
  }

  // Contact message operations
  static async createContactMessage(data: {
    name: string;
    email: string;
    message: string;
  }) {
    return await prisma.contactMessage.create({
      data,
    });
  }

  static async getAllContactMessages() {
    return await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}

export default DatabaseService;