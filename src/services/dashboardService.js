import { executeSqlQuery } from './api';

/**
 * Initialize dashboard data by fetching required information
 * @param {Object} userData - Current user data
 * @returns {Promise<Object>} Dashboard data
 */
export const initializeDashboardData = async (userData) => {
  try {
    // Fetch users data
    const usersData = await executeSqlQuery('SELECT * FROM "User" LIMIT 100', 'html');
    
    // Fetch sessions data
    const sessionsData = await executeSqlQuery('SELECT * FROM "Sessions" LIMIT 100', 'html');
    
    // Fetch playlists data
    const playlistsData = await executeSqlQuery('SELECT * FROM "Playlist" LIMIT 100', 'string_table');
    
    // You can add more queries as needed
    
    return {
      users: usersData,
      sessions: sessionsData,
      playlists: playlistsData,
      // Parse and transform data as needed
      myPlaylists: [], // Will be populated based on user ID
      otherPlaylists: [], // Will be populated based on user ID
      myGenericVideos: [], 
      otherGenericVideos: []
    };
  } catch (error) {
    console.error('Error initializing dashboard data:', error);
    throw error;
  }
};

/**
 * Fetch user statistics
 * @returns {Promise<Object>} User statistics
 */
export const fetchUserStatistics = async () => {
  try {
    const query = `
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN auth_last_used IS NOT NULL AND auth_last_used > NOW() - INTERVAL '7 days' THEN 1 END) as active_users_7d
      FROM "User"
    `;
    
    const result = await executeSqlQuery(query, 'html');
    return result;
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    throw error;
  }
};

/**
 * Fetch all users with pagination
 * @param {number} limit - Maximum number of users to fetch
 * @param {number} offset - Starting position for fetch
 * @returns {Promise<string>} HTML table with user data
 */
export const fetchAllUsers = async (limit = 100, offset = 0) => {
  try {
    const query = `
      SELECT * FROM "User"
      ORDER BY user_id
      LIMIT ${limit} OFFSET ${offset}
    `;
    
    const result = await executeSqlQuery(query, 'html');
    return result;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};

/**
 * Fetch session statistics
 * @returns {Promise<Object>} Session statistics
 */
export const fetchSessionStatistics = async () => {
  try {
    const query = `
      SELECT 
        COUNT(*) as total_sessions,
        COUNT(CASE WHEN created_at > NOW() - INTERVAL '24 hours' THEN 1 END) as sessions_last_24h
      FROM "Sessions"
    `;
    
    const result = await executeSqlQuery(query, 'html');
    return result;
  } catch (error) {
    console.error('Error fetching session statistics:', error);
    throw error;
  }
};

/**
 * Fetch playlist statistics
 * @returns {Promise<Object>} Playlist statistics
 */
export const fetchPlaylistStatistics = async () => {
  try {
    const query = `
      SELECT 
        permission,
        COUNT(*) as count
      FROM "Playlist"
      GROUP BY permission
    `;
    
    const result = await executeSqlQuery(query, 'string_table');
    return result;
  } catch (error) {
    console.error('Error fetching playlist statistics:', error);
    throw error;
  }
};
