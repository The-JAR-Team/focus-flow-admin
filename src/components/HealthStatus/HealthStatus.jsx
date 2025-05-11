import React, { useState, useEffect } from 'react';
import { fetchHealthStatus } from '../../services/api';
import styles from './HealthStatus.module.css';
import config from '../../utils/config';

const HealthStatus = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        setLoading(true);
        const data = await fetchHealthStatus();
        setHealth(data);
        setLoading(false);
      } catch (err) {
        setError('Service unavailable');
        setLoading(false);
      }
    };

    checkHealth();
    
    // Set up polling every 60 seconds
    const interval = setInterval(checkHealth, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };
  if (loading) {
    return <div className={styles.healthContainer}>
      <div className={`${styles.statusIndicator} ${styles.loading}`}></div>
      <span className={styles.statusText}>Checking...</span>
    </div>;
  }

  if (error) {
    return <div className={styles.healthContainer}>
      <div className={`${styles.statusIndicator} ${styles.error}`}></div>
      <span className={styles.statusText}>Error</span>
    </div>;
  }

  const isHealthy = health && health.state === 'running';

  return (
    <div 
      className={styles.healthContainer} 
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className={styles.healthContentWrapper}>
        <div className={`${styles.statusIndicator} ${isHealthy ? styles.healthy : styles.unhealthy}`}></div>
        <div className={styles.statusInfo}>
          <span className={styles.statusText}>
            {isHealthy ? 'API: Healthy' : `API: ${health?.state || 'Unknown'}`}
          </span>
          <span className={styles.versionText}>
            v{health?.version || '?.?.?'}
          </span>
        </div>
      </div>

      {showTooltip && (
        <div className={styles.tooltip}>
          <div className={styles.detailRow}>
            <span className={styles.label}>Status:</span>
            <span className={styles.value}>{health?.state || 'N/A'}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.label}>Version:</span>
            <span className={styles.value}>{health?.version || 'N/A'}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.label}>Build time:</span>
            <span className={styles.value}>{health?.build_timestamp ? formatDate(health.build_timestamp) : 'N/A'}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.label}>API URL:</span>
            <span className={styles.value}>{config.baseURL}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthStatus;
