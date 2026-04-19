import { Routes, Route, Navigate, useLocation } from 'react-router';
import { LoginPage } from './pages/login/page';
import { SignupPage } from './pages/signup/page';
import { CheckEmailPage } from './pages/check-email/page';
import { ProfilePage } from './pages/profile/page';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicOnlyRoute } from './components/PublicOnlyRoute';

const AUTH_ROUTES = ['/login', '/signup', '/check-email'];

export const App = () => {
  const location = useLocation();
  const showNav = !AUTH_ROUTES.includes(location.pathname);

  return (
    <>
      {showNav && <Navbar />}
      <Routes>
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicOnlyRoute>
              <SignupPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/check-email"
          element={
            <PublicOnlyRoute>
              <CheckEmailPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
};
