import { Navigate, Outlet } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import axios from 'axios';
import useAccountStore from '../../stores/trainee/AccountStore.js';

import { GridLoader } from 'react-spinners';

const PrivateTraineeRoutes = () => {
  const token = localStorage.getItem('token');
  const setUser = useAccountStore(state => state.setUser)

  if (!token) {
    return <Navigate to="/login" />;
  }

  const fetchValidateRole = async () => {
    try {
      const res = await axios.get('http://localhost:8080/auth/validate-role', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        return <Navigate to="/login" />;
      }
      throw error;
    }
  };


  const { data, isLoading, isError } = useQuery({
    queryKey: ['privateTraineeRoutesData'],
    queryFn: fetchValidateRole,
  });

  if (isLoading) return (
    <div className="w-screen h-screen flex justify-center items-center ">
      <GridLoader color="orange" size={15} />
    </div>
  )
  if (isError) return <div>Error loading data</div>;


  const role = data.role;
  setUser(data.user)

  if (role !== 'trainee') {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}
export default PrivateTraineeRoutes;