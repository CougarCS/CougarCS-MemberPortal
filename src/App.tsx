import { Routes, Route, Navigate, useLocation } from 'react-router';
import { LoginPage } from './pages/login/page';
import { SignupPage } from './pages/signup/page';
import { ProfilePage } from './pages/profile/page';
import { Navbar } from './components/Navbar';

const AUTH_ROUTES = ['/login', '/signup'];

export const App = () => {
  const location = useLocation();
  const showNav = !AUTH_ROUTES.includes(location.pathname);

  return (
    <>
      {showNav && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
};
