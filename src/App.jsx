import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import PublicPage from './pages/PublicPage';
import LoginPage from './pages/LoginPage';

import AdminUsuarios from './pages/admin/AdminUsuarios';
import AdminPontos from './pages/admin/AdminPontos';
import AdminDoacoes from './pages/admin/AdminDoacoes';

import CoordenadorNecessidades from './pages/coordenador/CoordenadorNecessidades';
import RegistrarDoacao from './pages/coordenador/RegistrarDoacao';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* Pública */}
            <Route path="/" element={<PublicPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Admin */}
            <Route path="/admin" element={<Navigate to="/admin/usuarios" replace />} />
            <Route
              path="/admin/usuarios"
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminUsuarios />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/pontos"
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminPontos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/doacoes"
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminDoacoes />
                </ProtectedRoute>
              }
            />

            {/* Coordenador */}
            <Route path="/coordenador" element={<Navigate to="/coordenador/necessidades" replace />} />
            <Route
              path="/coordenador/necessidades"
              element={
                <ProtectedRoute roles={['coordenador']}>
                  <CoordenadorNecessidades />
                </ProtectedRoute>
              }
            />
            <Route
              path="/coordenador/doacoes"
              element={
                <ProtectedRoute roles={['coordenador']}>
                  <RegistrarDoacao />
                </ProtectedRoute>
              }
            />

            {/* Voluntário */}
            <Route path="/voluntario" element={<Navigate to="/voluntario/doacoes" replace />} />
            <Route
              path="/voluntario/doacoes"
              element={
                <ProtectedRoute roles={['voluntario']}>
                  <RegistrarDoacao />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}
