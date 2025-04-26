import { fetchApi } from './apiService';

/**
 * Fetch all time records
 */
export const getAllRecords = async () => {
  try {
    return await fetchApi('/time-records');
  } catch (error) {
    console.error('Error fetching records:', error);
    throw new Error('Failed to fetch records');
  }
};

/**
 * Add new attendance record
 */
export const addRecord = async (username, type) => {
  try {
    return await fetchApi('/time-record', {
      method: 'POST',
      body: JSON.stringify({ username, type })
    });
  } catch (error) {
    console.error('Error adding record:', error);
    throw new Error('Failed to record time');
  }
};

/**
 * Update existing record
 */
export const updateRecord = async (username, recordIndex, updatedRecord) => {
  try {
    return await fetchApi(`/time-records/${username}/${recordIndex}`, {
      method: 'PUT',
      body: JSON.stringify(updatedRecord)
    });
  } catch (error) {
    console.error('Error updating record:', error);
    throw new Error('Failed to update record');
  }
};

/**
 * Delete record
 */
export const deleteRecord = async (username, recordIndex) => {
  try {
    return await fetchApi(`/time-records/${username}/${recordIndex}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Error deleting record:', error);
    throw new Error('Failed to delete record');
  }
};

/**
 * Get attendance statistics
 */
export const getStatistics = async () => {
  try {
    return await fetchApi('/statistics');
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw new Error('Failed to get statistics');
  }
};