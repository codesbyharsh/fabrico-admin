import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';

export default function App() {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/dashboard"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
      />
      <Route
        path="/profile"
        element={isAuthenticated ? <Profile /> : <Navigate to="/" />}
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/product-form" element={<ProductForm />} />
      <Route path="/products" element={<ProductList />} />
    </Routes>
  );
}