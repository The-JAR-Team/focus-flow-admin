import React, { useState, useEffect } from 'react';
import { executeSqlQuery } from '../../services/api';
import styles from './Users.module.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Query to get all users with limited fields for security
      const result = await executeSqlQuery(
        'SELECT user_id, first_name, last_name, email, age, auth_last_used FROM "User" ORDER BY user_id DESC LIMIT 100', 
        'html'
      );
      
      setUsers(result);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again later.');
      setLoading(false);
    }
  };

  const handleUserSelect = (userId) => {
    // Find selected user details
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser(null); // Toggle off if already selected
    } else {
      setLoading(true);
      
      // Query to get full user details
      executeSqlQuery(
        `SELECT * FROM "User" WHERE user_id = ${userId}`, 
        'html'
      )
        .then(result => {
          setSelectedUser({
            id: userId,
            details: result
          });
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching user details:', err);
          setError('Failed to load user details.');
          setLoading(false);
        });
    }
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleUserSessionsView = (userId) => {
    // Query to get user's sessions
    setLoading(true);
    
    executeSqlQuery(
      `SELECT * FROM "Sessions" WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT 10`, 
      'html'
    )
      .then(result => {
        setSelectedUser(prev => ({
          ...prev,
          sessions: result
        }));
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching user sessions:', err);
        setError('Failed to load user sessions.');
        setLoading(false);
      });
  };

  const handleUserPlaylistsView = (userId) => {
    // Query to get user's playlists
    setLoading(true);
    
    executeSqlQuery(
      `SELECT * FROM "Playlist" WHERE user_id = ${userId} LIMIT 20`, 
      'string_table'
    )
      .then(result => {
        setSelectedUser(prev => ({
          ...prev,
          playlists: result
        }));
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching user playlists:', err);
        setError('Failed to load user playlists.');
        setLoading(false);
      });
  };

  return (
    <div className={styles.usersContainer}>
      <header className={styles.pageHeader}>
        <h1>User Management</h1>
        <button className={styles.refreshButton} onClick={fetchUsers}>
          Refresh Data
        </button>
      </header>

      {error && <div className={styles.error}>{error}</div>}
      
      <div className={styles.usersContent}>
        <div className={styles.usersList}>
          <h2>Users</h2>
          {loading && !selectedUser ? (
            <div className={styles.loading}>Loading users...</div>
          ) : (
            <div className={styles.usersTable}>
              <div className={styles.htmlContent} dangerouslySetInnerHTML={{ __html: users }} />
            </div>
          )}
        </div>
        
        {selectedUser && (
          <div className={styles.userDetails}>
            <div className={styles.userDetailsHeader}>
              <h2>User Details</h2>
              <div className={styles.detailsActions}>
                <button onClick={() => handleUserSessionsView(selectedUser.id)}>
                  View Sessions
                </button>
                <button onClick={() => handleUserPlaylistsView(selectedUser.id)}>
                  View Playlists
                </button>
                <button onClick={handleEditToggle}>
                  {editMode ? 'Cancel Edit' : 'Edit User'}
                </button>
              </div>
            </div>
            
            {loading ? (
              <div className={styles.loading}>Loading details...</div>
            ) : (
              <>
                <div className={styles.detailsSection}>
                  <h3>Profile Information</h3>
                  <div className={styles.htmlContent} dangerouslySetInnerHTML={{ __html: selectedUser.details }} />
                </div>
                
                {selectedUser.sessions && (
                  <div className={styles.detailsSection}>
                    <h3>Recent Sessions</h3>
                    <div className={styles.htmlContent} dangerouslySetInnerHTML={{ __html: selectedUser.sessions }} />
                  </div>
                )}
                
                {selectedUser.playlists && (
                  <div className={styles.detailsSection}>
                    <h3>Playlists</h3>
                    <pre className={styles.preformatted}>{selectedUser.playlists}</pre>
                  </div>
                )}
                
                {editMode && (
                  <div className={styles.editForm}>
                    <h3>Edit User</h3>
                    <p>This functionality would be implemented with appropriate backend support.</p>
                    {/* Form would go here in a real implementation */}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
