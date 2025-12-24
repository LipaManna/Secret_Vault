import React, { useState, useEffect } from 'react'
import DataTable from '../components/DataTable'
import AddSecret from '../components/AddSecret'

const Dashboard = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const handleSecretsUpdated = () => {
      setRefreshKey(prev => prev + 1);
    };

    window.addEventListener('secretsUpdated', handleSecretsUpdated);
    return () => {
      window.removeEventListener('secretsUpdated', handleSecretsUpdated);
    };
  }, []);

  return (
    <div className="dashboard-container">
      <AddSecret />
      <DataTable key={refreshKey} />
    </div>
  )
}

export default Dashboard
