import React, { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { encryptData } from '../services/crypto.service'
import { validatePassword } from '../services/validation.service'
import { generatePassword } from '../services/passwordGenerator.service'
import '../App.css'

const EditSecret = ({ show, onHide, secret, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    userName: '',
    password: '',
    notes: ''
  });
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Populate form when secret changes
  useEffect(() => {
    if (secret) {
      setFormData({
        name: secret.name || '',
        userName: secret.userName || '',
        password: secret.password || '',
        notes: secret.notes || ''
      });
      setPasswordError("");
      setShowPassword(false);
    }
  }, [secret]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Validate password field when it changes
    if (name === 'password') {
      if (value && !validatePassword(value).isValid) {
        setPasswordError(validatePassword(value).message);
      } else {
        setPasswordError("");
      }
    }
  };

  const handleGeneratePassword = () => {
    const generatedPassword = generatePassword(16);
    setFormData({ ...formData, password: generatedPassword });
    setPasswordError("");
    setShowPassword(true); // Show the generated password
  };

  const handleClose = () => {
    setFormData({
      name: '',
      userName: '',
      password: '',
      notes: ''
    });
    setPasswordError("");
    setShowPassword(false);
    onHide();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password if provided
    if (formData.password) {
      const validation = validatePassword(formData.password);
      if (!validation.isValid) {
        setPasswordError(validation.message);
        return;
      }
    }
    
    try {
      // Get the actual master password from sessionStorage
      const masterPassword = sessionStorage.getItem('masterPassword');
      
      if (!masterPassword) {
        alert('Master password not found. Please login again.');
        return;
      }
      
      // Encrypt the form data using the actual master password
      const encryptedFormData = await encryptData(formData, masterPassword);
      
      // Update the secret
      if (onUpdate) {
        onUpdate(secret.id, encryptedFormData);
      }
      
      handleClose();
      alert('Secret updated successfully!');
    } catch (error) {
      console.error('Error updating secret:', error);
      alert('Failed to update secret: ' + error.message);
    }
  };

  if (!secret) return null;

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Secret</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="editFormName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              autoFocus
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="editFormUserName">
            <Form.Label>User Name</Form.Label>
            <Form.Control
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="editFormPassword">
            <Form.Label>Password</Form.Label>
            <div className="password-input-wrapper">
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                isInvalid={!!passwordError}
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                    <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                    <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                  </svg>
                )}
              </button>
            </div>
            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Button
                variant="outline-secondary"
                size="sm"
                type="button"
                onClick={handleGeneratePassword}
              >
                Generate Password
              </Button>
              {formData.password && (
                <small className="text-muted">
                  {formData.password.length} characters
                </small>
              )}
            </div>
            {passwordError && (
              <Form.Control.Feedback type="invalid">
                {passwordError}
              </Form.Control.Feedback>
            )}
          </Form.Group>
          <Form.Group
            className="mb-3"
            controlId="editFormNotes"
          >
            <Form.Label>Notes (Optional)</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              name="notes"
              value={formData.notes}
              onChange={handleChange} 
            />
          </Form.Group>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Update Secret
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default EditSecret;
