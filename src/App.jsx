import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import WeatherApp from './WeatherApp';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/app" 
            element={
              <ProtectedRoute>
                <WeatherApp />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/app" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
