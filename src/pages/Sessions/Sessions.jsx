import React, { useState, useEffect } from 'react';
import { executeSqlQuery } from '../../services/api';
import styles from './Sessions.module.css';

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    userId: '',
    timeRange: 'all', // 'today', 'week', 'month', 'all'
    expired: 'all', // 'yes', 'no', 'all'
  });

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = 'SELECT session_id, user_id, created_at, expires_at FROM "Sessions"';
      
      // Add filters based on user selections
      const whereConditions = [];
      
      if (filterOptions.userId) {
        whereConditions.push(`user_id = ${filterOptions.userId}`);
      }
      
      if (filterOptions.timeRange !== 'all') {
        let timeCondition;
        const now = new Date().toISOString();
        
        switch (filterOptions.timeRange) {
          case 'today':
            timeCondition = `created_at > NOW() - INTERVAL '1 day'`;
            break;
          case 'week':
            timeCondition = `created_at > NOW() - INTERVAL '7 days'`;
            break;
          case 'month':
            timeCondition = `created_at > NOW() - INTERVAL '30 days'`;
            break;
          default:
            timeCondition = null;
        }
        
        if (timeCondition) {
          whereConditions.push(timeCondition);
        }
      }
      
      if (filterOptions.expired !== 'all') {
        if (filterOptions.expired === 'yes') {
          whereConditions.push('expires_at < NOW()');
        } else {
          whereConditions.push('expires_at > NOW()');
        }
      }
      
      // Add WHERE clause if needed
      if (whereConditions.length > 0) {
        query += ' WHERE ' + whereConditions.join(' AND ');
      }
      
      // Add order and limit
      query += ' ORDER BY created_at DESC LIMIT 100';
      
      // Execute query
      const result = await executeSqlQuery(query, 'html');
      setSessions(result);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError('Failed to load sessions. Please try again later.');
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilterOptions(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyFilters = () => {
    fetchSessions();
  };

  const clearFilters = () => {
    setFilterOptions({
      userId: '',
      timeRange: 'all',
      expired: 'all',
    });
    // Fetch sessions without filters
    fetchSessions();
  };

  const activeSessionsCount = () => {
    // Count would be calculated from the data
    // This is just a placeholder
    return "Calculating...";
  };

  const expiredSessionsCount = () => {
    // Count would be calculated from the data
    // This is just a placeholder
    return "Calculating...";
  };

  return (
    <div className={styles.sessionsContainer}>
      <header className={styles.pageHeader}>
        <div>
          <h1>Session Management</h1>
          <p className={styles.subheader}>
            Monitor and manage user sessions
          </p>
        </div>
        <button className={styles.refreshButton} onClick={fetchSessions}>
          Refresh Data
        </button>
      </header>

      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Active Sessions:</span>
          <span className={styles.statValue}>{activeSessionsCount()}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Expired Sessions:</span>
          <span className={styles.statValue}>{expiredSessionsCount()}</span>
        </div>
      </div>

      <div className={styles.filterSection}>
        <h3>Filter Sessions</h3>
        <div className={styles.filterControls}>
          <div className={styles.filterGroup}>
            <label htmlFor="userId">User ID:</label>
            <input
              type="number"
              id="userId"
              value={filterOptions.userId}
              onChange={(e) => handleFilterChange('userId', e.target.value)}
              placeholder="Enter user ID"
              className={styles.filterInput}
            />
          </div>
          
          <div className={styles.filterGroup}>
            <label htmlFor="timeRange">Time Range:</label>
            <select
              id="timeRange"
              value={filterOptions.timeRange}
              onChange={(e) => handleFilterChange('timeRange', e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Time</option>
              <option value="today">Last 24 Hours</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <label htmlFor="expired">Expired:</label>
            <select
              id="expired"
              value={filterOptions.expired}
              onChange={(e) => handleFilterChange('expired', e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          
          <div className={styles.filterActions}>
            <button className={styles.applyButton} onClick={applyFilters}>
              Apply Filters
            </button>
            <button className={styles.clearButton} onClick={clearFilters}>
              Clear
            </button>
          </div>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      
      <div className={styles.sessionsContent}>
        {loading ? (
          <div className={styles.loading}>Loading sessions...</div>
        ) : (
          <div className={styles.sessionsTable}>
            <div className={styles.htmlContent} dangerouslySetInnerHTML={{ __html: sessions }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Sessions;
