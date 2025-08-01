import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UpdateEmail from '../components/UpdateEmail';
import UpdatePassword from '../components/UpdatePassword';
import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList';

export default function Dashboard() {
  const navigate = useNavigate();

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

        {/* 🔐 Email & Password Update Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <UpdateEmail />
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <UpdatePassword />
          </div>
        </div>

        {/* 👕 Product Management */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
          <ProductForm />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">All Products</h2>
          <ProductList />
        </div>

        {/* Future: Analytics, Orders, etc */}
        {/* <div className="bg-white p-6 rounded-lg shadow">
            <Analytics />
        </div> */}
      </main>
    </div>
  );
}
