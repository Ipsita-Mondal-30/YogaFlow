import { Alert } from 'react-native';

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || 'your-cloud-name';
const CLOUDINARY_UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'your-upload-preset';
const CLOUDINARY_API_KEY = process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY || 'your-api-key';

export interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  resource_type: string;
  bytes: number;
  duration?: number;
  width?: number;
  height?: number;
  created_at: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

/**
 * Upload video to Cloudinary
 * @param uri - Local file URI
 * @param fileName - Original file name
 * @param onProgress - Progress callback
 * @returns Promise with upload response
 */
export const uploadVideoToCloudinary = async (
  uri: string,
  fileName: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<CloudinaryUploadResponse> => {
  try {
    if (!CLOUDINARY_CLOUD_NAME || CLOUDINARY_CLOUD_NAME === 'your-cloud-name') {
      throw new Error('Cloudinary cloud name not configured. Please set EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME in your environment variables.');
    }

    if (!CLOUDINARY_UPLOAD_PRESET || CLOUDINARY_UPLOAD_PRESET === 'your-upload-preset') {
      throw new Error('Cloudinary upload preset not configured. Please set EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET in your environment variables.');
    }

    const formData = new FormData();
    
    // Add file to form data
    formData.append('file', {
      uri,
      type: 'video/mp4',
      name: fileName,
    } as any);
    
    // Add upload preset
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    // Add resource type for video
    formData.append('resource_type', 'video');
    
    // Add folder for organization
    formData.append('folder', 'yoga-flow/admin-videos');
    
    // Add tags for better organization
    formData.append('tags', 'admin,yoga,video');

    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress: UploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100),
          };
          onProgress(progress);
        }
      });
      
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error('Failed to parse upload response'));
          }
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      });
      
      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });
      
      xhr.addEventListener('timeout', () => {
        reject(new Error('Upload timeout'));
      });
      
      xhr.open('POST', uploadUrl);
      xhr.timeout = 300000; // 5 minutes timeout
      xhr.send(formData);
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

/**
 * Upload image to Cloudinary (for thumbnails)
 * @param uri - Local file URI
 * @param fileName - Original file name
 * @param onProgress - Progress callback
 * @returns Promise with upload response
 */
export const uploadImageToCloudinary = async (
  uri: string,
  fileName: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<CloudinaryUploadResponse> => {
  try {
    if (!CLOUDINARY_CLOUD_NAME || CLOUDINARY_CLOUD_NAME === 'your-cloud-name') {
      throw new Error('Cloudinary cloud name not configured');
    }

    if (!CLOUDINARY_UPLOAD_PRESET || CLOUDINARY_UPLOAD_PRESET === 'your-upload-preset') {
      throw new Error('Cloudinary upload preset not configured');
    }

    const formData = new FormData();
    
    formData.append('file', {
      uri,
      type: 'image/jpeg',
      name: fileName,
    } as any);
    
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('resource_type', 'image');
    formData.append('folder', 'yoga-flow/thumbnails');
    formData.append('tags', 'admin,yoga,thumbnail');

    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress: UploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100),
          };
          onProgress(progress);
        }
      });
      
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error('Failed to parse upload response'));
          }
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      });
      
      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });
      
      xhr.open('POST', uploadUrl);
      xhr.timeout = 120000; // 2 minutes timeout for images
      xhr.send(formData);
    });
  } catch (error) {
    console.error('Cloudinary image upload error:', error);
    throw error;
  }
};

/**
 * Delete video from Cloudinary
 * @param publicId - Cloudinary public ID
 * @returns Promise with deletion response
 */
export const deleteVideoFromCloudinary = async (publicId: string): Promise<any> => {
  try {
    if (!CLOUDINARY_API_KEY || CLOUDINARY_API_KEY === 'your-api-key') {
      throw new Error('Cloudinary API key not configured');
    }

    // Note: For security reasons, deletion should typically be done from a backend
    // This is a simplified client-side implementation
    const deleteUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/destroy`;
    
    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('api_key', CLOUDINARY_API_KEY);
    
    const response = await fetch(deleteUrl, {
      method: 'POST',
      body: formData,
    });
    
    return await response.json();
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};

/**
 * Generate video thumbnail URL from Cloudinary
 * @param publicId - Cloudinary public ID
 * @param options - Transformation options
 * @returns Thumbnail URL
 */
export const generateVideoThumbnail = (
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
  } = {}
): string => {
  const { width = 400, height = 300, quality = 'auto', format = 'jpg' } = options;
  
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/w_${width},h_${height},c_fill,q_${quality},f_${format}/${publicId}.${format}`;
};

/**
 * Validate Cloudinary configuration
 * @returns boolean indicating if configuration is valid
 */
export const validateCloudinaryConfig = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!CLOUDINARY_CLOUD_NAME || CLOUDINARY_CLOUD_NAME === 'your-cloud-name') {
    errors.push('EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME is not configured');
  }
  
  if (!CLOUDINARY_UPLOAD_PRESET || CLOUDINARY_UPLOAD_PRESET === 'your-upload-preset') {
    errors.push('EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET is not configured');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Show configuration alert if Cloudinary is not properly set up
 */
export const showCloudinaryConfigAlert = () => {
  const { isValid, errors } = validateCloudinaryConfig();
  
  if (!isValid) {
    Alert.alert(
      'Cloudinary Configuration Required',
      `Please configure the following environment variables:\n\n${errors.join('\n')}\n\nAdd these to your .env file and restart the app.`,
      [{ text: 'OK' }]
    );
  }
  
  return isValid;
};