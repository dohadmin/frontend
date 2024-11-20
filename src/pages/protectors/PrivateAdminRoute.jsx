import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import useAccountStore from '../../stores/admin/AccountStore';
import { GridLoader } from 'react-spinners';

const PrivateAdminRoutes = () => {
  const token = localStorage.getItem('token');
  const setUser = useAccountStore((state) => state.setUser);
  const user = useAccountStore((state) => state.user);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  const fetchValidateRole = async () => {
    try {
      const res = await axios.get('http://localhost:8080/auth/validate-role', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        return null;
      }
      throw error;
    }
  };

  useEffect(() => {
    if (!token) {
      setIsAuthenticated(false);
    }
  }, [token]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['privateAdminRoutesData'],
    queryFn: fetchValidateRole,
    enabled: isAuthenticated, // Only run the query if the user is authenticated
  });

  useEffect(() => {
    if (data && data.user) {
      setUser(data.user);
      clearHistory(); // Clear history after successful login
    }
  }, [data, setUser]);

  const clearHistory = () => {
    window.history.replaceState(null, '', window.location.pathname);
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (isLoading)
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <GridLoader color="orange" size={15} />
      </div>
    );

  if (isError) return <div>Error loading data</div>;

  const role = data?.role;

  if (role !== 'admin') {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default PrivateAdminRoutes;