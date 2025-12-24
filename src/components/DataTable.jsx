import React, { useState, useEffect } from 'react'
import Table from 'react-bootstrap/Table';
import { decryptData, encryptData } from '../services/crypto.service';
import { Button, Offcanvas } from 'react-bootstrap';
import EditSecret from './EditSecret';
import '../App.css';

const DataTable = () => {
  const [secrets, setSecrets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSecret, setSelectedSecret] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    loadSecrets();
  }, []);

  // Listen for secrets updated event
  useEffect(() => {
    const handleSecretsUpdated = () => {
      loadSecrets();
    };
    window.addEventListener('secretsUpdated', handleSecretsUpdated);
    return () => {
      window.removeEventListener('secretsUpdated', handleSecretsUpdated);
    };
  }, []);

  const loadSecrets = async () => {
    try {
      const encryptedSecrets = JSON.parse(localStorage.getItem('secrets') || '[]');
      // Get the actual master password from sessionStorage (not the encrypted version)
      const masterPassword = sessionStorage.getItem('masterPassword');
      
      if (!masterPassword) {
        console.error('Master password not found. Please login again.');
        setLoading(false);
        return;
      }

      // Decrypt each secret using the actual master password
      const decryptedSecrets = await Promise.all(
        encryptedSecrets.map(async (secret) => {
          try {
            const decryptedDataString = await decryptData(secret.encryptedData, masterPassword);
            const decryptedData = JSON.parse(decryptedDataString);
            return {
              id: secret.id,
              ...decryptedData,
              createdAt: secret.createdAt
            };
          } catch (error) {
            console.error('Error decrypting secret:', error);
            return null;
          }
        })
      );

      // Filter out any failed decryptions
      setSecrets(decryptedSecrets.filter(secret => secret !== null));
      setLoading(false);
    } catch (error) {
      console.error('Error loading secrets:', error);
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this secret?')) {
      const updatedSecrets = secrets.filter(secret => secret.id !== id);
      setSecrets(updatedSecrets);
      
      // Update localStorage
      const encryptedSecrets = JSON.parse(localStorage.getItem('secrets') || '[]');
      const filteredSecrets = encryptedSecrets.filter(secret => secret.id !== id);
      localStorage.setItem('secrets', JSON.stringify(filteredSecrets));
      
      // Close drawer if the deleted secret was being viewed
      if (selectedSecret && selectedSecret.id === id) {
        handleCloseDrawer();
      }
    }
  };

  const handleViewRecord = (id) => {
    const secret = secrets.find(secret => secret.id === id);
    setSelectedSecret(secret);
    setShowDrawer(true);
    setShowPassword(false);
  };

  const handleEditRecord = (id) => {
    const secret = secrets.find(secret => secret.id === id);
    setSelectedSecret(secret);
    setShowEditModal(true);
    setShowDrawer(false);
  };

  const handleCloseDrawer = () => {
    setShowDrawer(false);
    setSelectedSecret(null);
    setShowPassword(false);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedSecret(null);
  };

  const handleUpdateSecret = async (id, encryptedData) => {
    try {
      // Update in localStorage
      const encryptedSecrets = JSON.parse(localStorage.getItem('secrets') || '[]');
      const updatedSecrets = encryptedSecrets.map(secret => 
        secret.id === id 
          ? { ...secret, encryptedData, updatedAt: new Date().toISOString() }
          : secret
      );
      localStorage.setItem('secrets', JSON.stringify(updatedSecrets));
      
      // Reload secrets to reflect changes
      await loadSecrets();
      
      // Trigger refresh event
      window.dispatchEvent(new Event('secretsUpdated'));
    } catch (error) {
      console.error('Error updating secret:', error);
      throw error;
    }
  };

  const handleCopyToClipboard = (text, fieldName) => {
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        alert(`${fieldName} copied to clipboard!`);
      }).catch(err => {
        console.error('Failed to copy:', err);
      });
    }
  };

  if (loading) {
    return <div>Loading secrets...</div>;
  }

  if (secrets.length === 0) {
    return (
      <div className="data-table-container">
        <p>No secrets found. Add your first secret using the button above.</p>
      </div>
    );
  }

  return (
    <>
      <div className="data-table-container">
        <Table striped bordered hover>
          <thead>
            <tr>
              {/* <th>Serial Number</th> */}
              <th>Name</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {secrets.map((secret, index) => (
              <tr key={secret.id}>
                {/* <td>{index + 1}</td> */}
                <td>{secret.name || '-'}</td>
                <td>{secret.notes || '-'}</td>
                <td>
                  <Button 
                    variant="primary"
                    size="sm"
                    onClick={() => handleViewRecord(secret.id)}
                    className="data-table-button"
                  >
                    View
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDelete(secret.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Offcanvas show={showDrawer} onHide={handleCloseDrawer} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Secret Details</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {selectedSecret && (
            <div>
              <div className="secret-detail-section">
                <label className="secret-detail-label">
                  Name
                </label>
                <div className="secret-detail-field">
                  <span className="secret-detail-field-content">{selectedSecret.name || '-'}</span>
                  {selectedSecret.name && (
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={() => handleCopyToClipboard(selectedSecret.name, 'Name')}
                    >
                      Copy
                    </Button>
                  )}
                </div>
              </div>

              <div className="secret-detail-section">
                <label className="secret-detail-label">
                  User Name
                </label>
                <div className="secret-detail-field">
                  <span className="secret-detail-field-content">{selectedSecret.userName || '-'}</span>
                  {selectedSecret.userName && (
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={() => handleCopyToClipboard(selectedSecret.userName, 'User Name')}
                    >
                      Copy
                    </Button>
                  )}
                </div>
              </div>

              <div className="secret-detail-section">
                <label className="secret-detail-label">
                  Password
                </label>
                <div className="secret-detail-field">
                  <span className="secret-detail-password">
                    {showPassword ? (selectedSecret.password || '-') : (selectedSecret.password ? '••••••••' : '-')}
                  </span>
                  {selectedSecret.password && (
                    <>
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => handleCopyToClipboard(selectedSecret.password, 'Password')}
                      >
                        Copy
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div className="secret-detail-section">
                <label className="secret-detail-label">
                  Notes
                </label>
                <div className="secret-detail-notes">
                  {selectedSecret.notes || '-'}
                </div>
              </div>

              {selectedSecret.createdAt && (
                <div className="secret-detail-section">
                  <label className="secret-detail-label">
                    Created At
                  </label>
                  <div className="secret-detail-created">
                    {new Date(selectedSecret.createdAt).toLocaleString()}
                  </div>
                </div>
              )}

              <div className="secret-detail-actions">
                <Button 
                  variant="primary"
                  onClick={() => handleEditRecord(selectedSecret.id)}
                  style={{ marginRight: '0.5rem' }}
                >
                  Edit
                </Button>
                <Button 
                  variant="danger" 
                  onClick={() => {
                    handleDelete(selectedSecret.id);
                    handleCloseDrawer();
                  }}
                >
                  Delete Secret
                </Button>
              </div>
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>

      <EditSecret
        show={showEditModal}
        onHide={handleCloseEditModal}
        secret={selectedSecret}
        onUpdate={handleUpdateSecret}
      />
    </>
  );
}

export default DataTable;
