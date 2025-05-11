import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchUserStatistics, 
  fetchSessionStatistics, 
  fetchPlaylistStatistics 
} from '../../services/dashboardService';
import { setUsers, setSessions, setPlaylists } from '../../redux/dashboardSlice';
import { executeSqlQuery } from '../../services/api';
import styles from './Dashboard.module.css';

/**
 * Format SQL query with proper indentation and line breaks
 * @param {string} query - The SQL query to format
 * @returns {string} Formatted query
 */
const formatSqlQuery = (query) => {
  // Simple SQL formatting
  return query
    .replace(/SELECT/g, 'SELECT\n  ')
    .replace(/FROM/g, '\nFROM')
    .replace(/WHERE/g, '\nWHERE')
    .replace(/GROUP BY/g, '\nGROUP BY')
    .replace(/ORDER BY/g, '\nORDER BY')
    .replace(/LIMIT/g, '\nLIMIT')
    .replace(/JOIN/g, '\nJOIN');
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const { users, sessions, playlists } = useSelector(state => state.dashboard);
  
  const [activeTab, setActiveTab] = useState('users');
  const [customQuery, setCustomQuery] = useState('');
  const [queryType, setQueryType] = useState('html');
  const [queryResults, setQueryResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user statistics and update Redux store
      const userStats = await fetchUserStatistics();
      dispatch(setUsers(userStats));
      
      // Fetch session statistics and update Redux store
      const sessionStats = await fetchSessionStatistics();
      dispatch(setSessions(sessionStats));
      
      // Fetch playlist statistics and update Redux store
      const playlistStats = await fetchPlaylistStatistics();
      dispatch(setPlaylists(playlistStats));
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const handleCustomQuery = async (e) => {
    e.preventDefault();
    
    if (!customQuery.trim()) {
      setError('Please enter a SQL query');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await executeSqlQuery(customQuery, queryType);
      setQueryResults(result);
      
      setLoading(false);
    } catch (error) {
      console.error('Error executing custom query:', error);
      setError('Failed to execute query: ' + (error.message || 'Unknown error'));
      setLoading(false);
    }
  };

  /**
   * Copy query results to clipboard
   */
  const handleCopyResults = () => {
    // Create a temporary textarea element to copy the text
    const textArea = document.createElement('textarea');
    
    // If HTML results, we need to extract the text content
    if (queryType === 'html') {
      // Create a temporary div to parse the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = queryResults;
      textArea.value = tempDiv.textContent || tempDiv.innerText;
    } else {
      textArea.value = queryResults;
    }
    
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    
    // Show copied confirmation
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return (
          <div className={styles.tabContent}>
            <h3>User Data</h3>
            <button 
              className={styles.refreshButton}
              onClick={() => fetchUserStatistics().then(data => dispatch(setUsers(data)))}
            >
              Refresh Data
            </button>
            <div className={styles.dataContainer}>
              {users ? (
                <div className={styles.htmlContent} dangerouslySetInnerHTML={{ __html: users }} />
              ) : (
                <p>No user data available</p>
              )}
            </div>
          </div>
        );
      
      case 'sessions':
        return (
          <div className={styles.tabContent}>
            <h3>Session Data</h3>
            <button 
              className={styles.refreshButton}
              onClick={() => fetchSessionStatistics().then(data => dispatch(setSessions(data)))}
            >
              Refresh Data
            </button>
            <div className={styles.dataContainer}>
              {sessions ? (
                <div className={styles.htmlContent} dangerouslySetInnerHTML={{ __html: sessions }} />
              ) : (
                <p>No session data available</p>
              )}
            </div>
          </div>
        );
      
      case 'playlists':
        return (
          <div className={styles.tabContent}>
            <h3>Playlist Data</h3>
            <button 
              className={styles.refreshButton}
              onClick={() => fetchPlaylistStatistics().then(data => dispatch(setPlaylists(data)))}
            >
              Refresh Data
            </button>
            <div className={styles.dataContainer}>
              <pre className={styles.preformatted}>
                {playlists || 'No playlist data available'}
              </pre>
            </div>
          </div>
        );
        case 'custom':
        return (
          <div className={styles.tabContent}>
            <h3>Custom SQL Query</h3>
            
            <div className={styles.examplesSection}>
              <h4>Example Queries</h4>
              <div className={styles.exampleButtons}>                <button 
                  type="button"
                  className={styles.exampleButton}
                  onClick={() => setCustomQuery(formatSqlQuery('SELECT * FROM "User"'))}
                >
                  All Users
                </button>
                <button 
                  type="button"
                  className={styles.exampleButton}
                  onClick={() => setCustomQuery(formatSqlQuery('SELECT * FROM "Sessions" LIMIT 5'))}
                >
                  Recent Sessions
                </button>
                <button 
                  type="button"
                  className={styles.exampleButton}
                  onClick={() => setCustomQuery(formatSqlQuery('SELECT * FROM "Playlist" LIMIT 5'))}
                >
                  Playlists
                </button>                <button 
                  type="button"
                  className={styles.exampleButton}
                  onClick={() => setCustomQuery(formatSqlQuery('SELECT user_id, COUNT(*) FROM "Playlist" GROUP BY user_id ORDER BY COUNT(*) DESC'))}
                >
                  Playlists per User
                </button>
                <button 
                  type="button"
                  className={styles.exampleButton}
                  onClick={() => setCustomQuery(formatSqlQuery('SELECT COUNT(*) as total_users FROM "User"'))}
                >
                  Total Users
                </button>
                {/*<button 
                  type="button"
                  className={styles.exampleButton}
                  onClick={() => setCustomQuery(formatSqlQuery('SELECT AVG(duration_minutes) as avg_session_length FROM "Sessions"'))}
                >
                  Avg Session Length
                </button>
                <button 
                  type="button"
                  className={styles.exampleButton}
                  onClick={() => setCustomQuery(formatSqlQuery('SELECT DATE(created_at) as date, COUNT(*) as new_users FROM "User" GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 10'))}
                >
                  New Users by Date
                </button>*/}
              </div>
            </div>
            
            <form onSubmit={handleCustomQuery} className={styles.queryForm}>
              <div className={styles.formRow}>
                <textarea 
                  value={customQuery} 
                  onChange={(e) => setCustomQuery(e.target.value)} 
                  placeholder="Enter SQL query, e.g., SELECT * FROM User LIMIT 10"
                  className={styles.queryTextarea}
                  rows={5}
                />
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input 
                      type="radio" 
                      value="html" 
                      checked={queryType === 'html'} 
                      onChange={() => setQueryType('html')} 
                    />
                    HTML Table
                  </label>
                  <label className={styles.radioLabel}>
                    <input 
                      type="radio" 
                      value="string_table" 
                      checked={queryType === 'string_table'} 
                      onChange={() => setQueryType('string_table')} 
                    />
                    String Table
                  </label>
                </div>
                <button type="submit" className={styles.queryButton} disabled={loading}>
                  {loading ? 'Executing...' : 'Execute Query'}
                </button>
              </div>
            </form>
            
            {error && <p className={styles.error}>{error}</p>}
              {queryResults && (
              <div className={styles.queryResults}>
                <div className={styles.resultsHeader}>
                  <h4>Query Results</h4>
                  <button 
                    className={styles.copyButton} 
                    onClick={handleCopyResults}
                    title="Copy results to clipboard"
                  >
                    {isCopied ? 'Copied!' : 'Copy Results'}
                  </button>
                </div>
                <div className={styles.dataContainer}>
                  {queryType === 'html' ? (
                    <div className={styles.htmlContent} dangerouslySetInnerHTML={{ __html: queryResults }} />
                  ) : (
                    <pre className={styles.preformatted}>{queryResults}</pre>
                  )}
                </div>
                <div className={styles.resultInfo}>
                  <small>
                    {queryType === 'html' ? 
                      'Results displayed as HTML table. Use Copy Results to copy as text.' : 
                      'Results displayed as text table.'}
                  </small>
                </div>
              </div>
            )}
          </div>
        );
      
      default:
        return <div>Select a tab to view data</div>;
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.dashboardHeader}>
        <h1>Focus Flow Admin Dashboard</h1>
        {user && <p className={styles.welcomeText}>Welcome, {user.first_name || user.email}</p>}
      </header>
      
      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'users' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'sessions' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('sessions')}
          >
            Sessions
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'playlists' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('playlists')}
          >
            Playlists
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'custom' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('custom')}
          >
            Custom Query
          </button>
        </div>
        
        <div className={styles.tabContentContainer}>
          {loading && <div className={styles.loader}>Loading...</div>}
          {!loading && renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
