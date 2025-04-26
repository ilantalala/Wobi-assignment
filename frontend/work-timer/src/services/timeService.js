import { fetchApi } from './apiService';

/**
 * Get current time from server
 */
export const getCurrentTime = async () => {
  try {
    const data = await fetchApi('/current-time');
    return data;
  } catch (error) {
    console.error('Error fetching time:', error);
    throw new Error('Failed to get current time');
  }
};