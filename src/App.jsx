import { ToastContainer } from 'react-toastify';
import { Navigate, Route, Router, Routes } from 'react-router-dom'
import AccountPage from './pages/admin/AccountPage'
import AuditTrailPage from './pages/admin/AuditTrailPage'
import LoginPage from './pages/LoginPage'
import PrivateAdminRoutes from './pages/protectors/PrivateAdminRoute'
import PublicRoutes from './pages/protectors/PublicRoute'
import PrivateTrainerRoutes from './pages/protectors/PrivateTrainerRoute'
import CertificatePage from './pages/admin/CertificatePage';
import TrainingPage from './pages/admin/TrainingPage';
import TraineesPage from './pages/trainer/TraineesPage';
import TrainerTrainingPage from './pages/trainer/TrainerTrainingPage';
import PrivateTraineeRoutes from './pages/protectors/PrivateTraineeRoute';
import ProfilePage from './pages/trainee/ProfilePage';
import 'react-toastify/dist/ReactToastify.css';
import PrivateSuperRoute from './pages/protectors/PrivateSuperRoute';
import LogsPage from './pages/super/AuditTrailPage';
import AdminPage from './pages/super/AdminPage';
import CalendarPage from './pages/trainer/CalendarPage';

const App = () => {
  return (
    <div className="w-screen h-screen">
      <ToastContainer 
        position='top-center'
      />
      <Routes>
        {/* Login  */}
        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Admin */}
        <Route element={<PrivateAdminRoutes />}>
          <Route path="/admin/accounts" element={<AccountPage />} />
          <Route path="/admin/training" element={<TrainingPage />} />
          <Route path="/admin/certificate" element={<CertificatePage />} />
          <Route path="/admin/audit" element={<AuditTrailPage />} />
        </Route>

        {/* Trainer Protected Routes */}
        <Route element={<PrivateTrainerRoutes />}>
          <Route path="/trainer/calendar" element={<CalendarPage />} />
          <Route path="/trainer/trainees" element={<TraineesPage />} />
          <Route path="/trainer/training" element={<TrainerTrainingPage />} />
        </Route>

        <Route element={<PrivateTraineeRoutes />}>
          <Route path="/trainee/profile" element={<ProfilePage />} />
        </Route>

        <Route element={<PrivateSuperRoute />}>
          <Route path="/super/admins" element={<AdminPage />} />
          <Route path="/super/logs" element={<LogsPage />} />
        </Route>



        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  )
}

export default App