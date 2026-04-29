import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicHomePage from './pages/PublicHomePage';
import PublicBuilderPage from './pages/PublicBuilderPage';
import ComponentListPage from './pages/ComponentListPage';
import FeaturedBuildsPage from './pages/FeaturedBuildsPage';
import RegisterPage from './pages/RegisterPage';
import CustomerLoginPage from './pages/CustomerLoginPage';
import MyBuildsPage from './pages/MyBuildsPage';
import PublicLayout from './crud/PublicLayout';
import Login from './crud/Login';
import AdminPanel from './crud/AdminPanel';


// ==========================================
// COMPONENT CHÍNH QUẢN LÝ ĐIỀU HƯỚNG
// ==========================================
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('adminToken'));
  const [isCustomer, setIsCustomer] = useState(!!localStorage.getItem('customerToken'));

  const refreshCustomerState = () => setIsCustomer(!!localStorage.getItem('customerToken'));

  return (
    <Routes>
      {/* Trang công khai cho khách vãng lai */}
      <Route path="/" element={<PublicLayout><PublicHomePage /></PublicLayout>} />
      <Route path="/builder" element={<PublicLayout><PublicBuilderPage /></PublicLayout>} />
      <Route path="/components/:categoryCode" element={<PublicLayout><ComponentListPage /></PublicLayout>} />
      <Route path="/featured-builds" element={<PublicLayout><FeaturedBuildsPage /></PublicLayout>} />
      
      {/* Đăng ký / Đăng nhập khách hàng */}
      <Route path="/register" element={
        isCustomer ? <Navigate to="/my-builds" /> : <RegisterPage onRegisterSuccess={refreshCustomerState} />
      } />
      <Route path="/customer-login" element={
        isCustomer ? <Navigate to="/my-builds" /> : <CustomerLoginPage onLoginSuccess={refreshCustomerState} />
      } />

      {/* Cấu hình đã lưu (cần đăng nhập khách hàng) */}
      <Route path="/my-builds" element={
        isCustomer
          ? <PublicLayout><MyBuildsPage onLogout={refreshCustomerState} /></PublicLayout>
          : <Navigate to="/customer-login" />
      } />

      {/* Đăng nhập quản trị */}
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/admin" /> : <Login onLoginSuccess={setIsAuthenticated} />
      } />
      
      {/* Trang quản trị (bảo vệ bởi token) */}
      <Route path="/admin" element={
        isAuthenticated ? <AdminPanel onLogout={setIsAuthenticated} /> : <Navigate to="/login" />
      } />
    </Routes>
  );
}

export default App;