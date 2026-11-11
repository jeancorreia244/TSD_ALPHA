import { createBrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Layout from './components/layout/Layout';
import { AuthLayout } from './components/layout/AuthLayout';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Bible } from './pages/Bible';
import { Prayer } from './pages/Prayer';
import { Fasting } from './pages/Fasting';
import { Devotional } from './pages/Devotional';
import { Journey } from './pages/Journey';
import { Groups } from './pages/Groups';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider>
        <DataProvider>
          <Layout />
        </DataProvider>
      </AuthProvider>
    ),
    children: [
      // Rotas públicas
      {
        path: 'login',
        element: (
          <AuthLayout>
            <Login />
          </AuthLayout>
        )
      },
      {
        path: 'signup',
        element: (
          <AuthLayout>
            <Signup />
          </AuthLayout>
        )
      },

      // Rotas protegidas
      {
        path: '',
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
        index: true
      },
      {
        path: 'bible',
        element: <ProtectedRoute><Bible /></ProtectedRoute>
      },
      {
        path: 'prayer',
        element: <ProtectedRoute><Prayer /></ProtectedRoute>
      },
      {
        path: 'fasting',
        element: <ProtectedRoute><Fasting /></ProtectedRoute>
      },
      {
        path: 'devotional',
        element: <ProtectedRoute><Devotional /></ProtectedRoute>
      },
      {
        path: 'journey',
        element: <ProtectedRoute><Journey /></ProtectedRoute>
      },
      {
        path: 'groups',
        element: <ProtectedRoute><Groups /></ProtectedRoute>
      },
    ]
  }
]);
