import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system';

export const uploadVideo = async (uri: string, fileName: string, userId: string) => {
  try {
    // Read file as base64
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: 'base64',
    });

    // Convert base64 to blob
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'video/mp4' });

    const filePath = `videos/${userId}/${Date.now()}-${fileName}`;

    const { data, error } = await supabase.storage
      .from('videos')
      .upload(filePath, blob);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error uploading video:', error);
    throw error;
  }
};

export const getVideoUrl = async (path: string) => {
  try {
    const { data } = await supabase.storage
      .from('videos')
      .createSignedUrl(path, 3600); // 1 hour expiry

    return data?.signedUrl;
  } catch (error) {
    console.error('Error getting video URL:', error);
    return null;
  }
};