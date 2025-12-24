import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check for masterPassword in sessionStorage (session-based authentication)
  // Also check for encryptedPassword in localStorage (persistent authentication marker)
  const masterPassword = sessionStorage.getItem('masterPassword');
  const encryptedPassword = localStorage.getItem('encryptedPassword');
  
  // If no master password in session (page was refreshed), redirect to login
  if (!masterPassword || !encryptedPassword) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
