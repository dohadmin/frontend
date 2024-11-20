import { Navigate, Outlet } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import axios from 'axios';
import { GridLoader } from 'react-spinners';
import { useState, useEffect } from 'react';

const PublicRoutes = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const token = localStorage.getItem('token');

  const fetchValidateRole = async () => {
    try {
      const res = await axios.get('http://localhost:8080/auth/validate-role', {
        headers: { Authorization: `Bearer ${token}` }
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

  if (isAuthenticated) {
    const { data, isLoading, isError } = useQuery({
      queryKey: ['publicRoutesData'],
      queryFn: fetchValidateRole,
      enabled: isAuthenticated, // Only run the query if the user is authenticated
    });

    if (isLoading) return (
      <div className="w-screen h-screen flex justify-center items-center ">
        <GridLoader color="orange" size={15} />
      </div>
    );

    if (isError) return <Navigate to="/login" />;
    if (!data) return <Outlet />;

    const role = data.role;

    if (role === "admin") {
      return <Navigate to="/admin/accounts" />;
    }
    if (role === "trainer") {
      return <Navigate to="/trainer/trainees" />;
    }
    if (role === "trainee") {
      return <Navigate to="/trainee/profile" />;
    }
    if (role === "super") {
      return <Navigate to="/super/admins" />;
    }

  }

  return <Outlet />;
};

export default PublicRoutes;