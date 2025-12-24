import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';

const Layout = () => {
  useEffect(() => {
    // Clear sessionStorage on page unload/refresh to auto-lock
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('masterPassword');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default Layout;
