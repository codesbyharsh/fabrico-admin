import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from '../components/Modal';
import UpdateEmail from '../components/UpdateEmail';
import UpdatePassword from '../components/UpdatePassword';
import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList';

export default function Dashboard() {
  const navigate = useNavigate();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`);
      localStorage.removeItem('token');
      localStorage.removeItem('isAuthenticated');
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-10">
        {/* 🔐 Account Management Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
            <div className="space-y-4">
              <button
                onClick={() => setShowEmailModal(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
              >
                Update Email
              </button>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
              >
                Update Password
              </button>
            </div>
          </div>
          
          {/* Add quick stats or other widgets in the second column */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
            {/* Add your stats here */}
          </div>
        </div>

        {/* 👕 Product Management */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Product Management</h2>
            <button
              onClick={() => setShowProductModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
            >
              Add New Product
            </button>
          </div>
          <ProductList />
        </div>

        {/* Modals */}
        <Modal isOpen={showEmailModal} onClose={() => setShowEmailModal(false)}>
          <UpdateEmail onClose={() => setShowEmailModal(false)} />
        </Modal>

        <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)}>
          <UpdatePassword onClose={() => setShowPasswordModal(false)} />
        </Modal>

        <Modal isOpen={showProductModal} onClose={() => setShowProductModal(false)}>
          <ProductForm onClose={() => setShowProductModal(false)} />
        </Modal>
      </main>
    </div>
  );
}