import { Routes, Route, Navigate } from 'react-router';
import { LoginPage } from './pages/login/page';

export const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
