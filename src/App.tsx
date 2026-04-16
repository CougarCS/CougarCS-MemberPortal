import { Routes, Route, Navigate } from 'react-router';
import { LoginPage } from './pages/login/page';
import { SignupPage } from './pages/signup/page';
import { ProfilePage } from './pages/profile/page';

export const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
