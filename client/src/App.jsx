// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';

// Layouts
import Layout from './components/layout/Layout';
import AdminLayout from './components/admin/AdminLayout';

// Public routes
import Home from './pages/Home';
import Login from './pages/Login';
<<<<<<< HEAD
import About from './pages/About';
import Contact from './pages/Contact';
=======
import AdminLogin from './pages/AdminLogin';
>>>>>>> 4d0537ae3492b3a5866bb436ed2f6147755a87f9

// User routes
import UserDashboard from './pages/user/UserDashboard';
import LoanApplication from './pages/user/LoanApplication';
import TaxCalculator from './pages/user/TaxCalculator';
import UserProfile from './pages/user/UserProfile';
import Settings from './pages/user/UserSettings';
import DocumentVerify from './pages/user/DocumentVerification';
import UserNotification from './pages/user/UserNotification';
import UserAnalysis from './pages/user/UserAnalysis';

// Admin routes
import AdminDashboard from './pages/admin/AdminDashboard';
import ApplicationReview from './pages/admin/ApplicationReview';
import LoanAssesment from './pages/admin/LoanAssesment';
import UserList from './pages/admin/UserList';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AdminAuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* User routes */}
            <Route
              path="/user"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<UserProfile />} />
              <Route path="apply" element={<LoanApplication />} />
              <Route path="verification" element={<DocumentVerify />} />
              <Route path="calculator" element={<TaxCalculator />} />
              <Route path="analysis" element={<UserAnalysis />} />
              <Route path="notification" element={<UserNotification />} />
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="applications" element={<ApplicationReview />} />
              <Route path="assessment" element={<LoanAssesment />} />
              <Route path="userlist" element={<UserList />} />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AdminAuthProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
