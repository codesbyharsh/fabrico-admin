import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import UpdateCredentials from '../components/UpdateCredentials';
import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList';
import AnalyticsCard from '../components/AnalyticsCard';
import PincodeForm from '../components/PincodeForm';
import PincodeList from '../components/PincodeList';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [stats, setStats] = useState({
    totalProducts: 0,
    outOfStock: 0,
    categories: {}
  });
   const [pincodes, setPincodes] = useState([]);



  useEffect(() => {
  if (activeTab === 'dashboard') {
    axios.get(`${import.meta.env.VITE_API_URL}/api/pincodes`)
      .then(res => setPincodes(res.data))
      .catch(console.error);
  }
}, [activeTab]);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

 const fetchDashboardStats = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/stats`);
    setStats(response.data);
  } catch (err) {
    console.error('Error fetching stats:', err);
    // Set default values if API fails
    setStats({
      totalProducts: 0,
      outOfStock: 0,
      categories: {},
      recentActivity: []
    });
  }
};

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`);
      localStorage.removeItem('admin');
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <div className="fixed inset-y-0 left-0 w-64 bg-indigo-700 text-white transform -translate-x-full md:translate-x-0 transition-transform duration-200 ease-in-out z-10">
        <div className="flex items-center justify-center h-16 px-4 border-b border-indigo-600">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        <nav className="p-4 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === 'dashboard' ? 'bg-indigo-600' : 'hover:bg-indigo-600'}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === 'products' ? 'bg-indigo-600' : 'hover:bg-indigo-600'}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Products
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === 'settings' ? 'bg-indigo-600' : 'hover:bg-indigo-600'}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </button>
        </nav>
        <div className="absolute bottom-0 w-full p-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 rounded-lg bg-indigo-800 hover:bg-indigo-900 transition"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Header */}
      <header className="md:hidden bg-white shadow-sm">
        <div className="px-4 py-3 flex justify-between items-center">
          <button
            onClick={() => document.querySelector('.sidebar').classList.toggle('translate-x-0')}
            className="p-2 rounded-md text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
          <div className="w-6"></div> {/* Spacer */}
        </div>
      </header>

      {/* Main Content */}
      <main className="md:ml-64 p-4 md:p-6">
       {activeTab === 'pincodes' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Pincode Management</h2>
              <div className="bg-white rounded-xl shadow p-6">
                <PincodeForm
                  onSaved={() => axios.get(`${import.meta.env.VITE_API_URL}/api/pincodes`).then(r => setPincodes(r.data))}
                />
              </div>
              <div className="bg-white rounded-xl shadow p-6">
                <PincodeList
                  pincodes={pincodes}
                  onDeleted={(id) => {
                    setPincodes(p => p.filter(x => x._id !== id));
                  }}
                />
              </div>
            </div>
          )}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
            
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AnalyticsCard 
                title="Total Products" 
                value={stats.totalProducts} 
                icon="📦" 
                trend="up"
                color="blue"
              />
              <AnalyticsCard 
                title="Out of Stock" 
                value={stats.outOfStock} 
                icon="⚠️" 
                trend={stats.outOfStock > 0 ? "up" : "down"}
                color="red"
              />
              <AnalyticsCard 
                title="Categories" 
                value={Object.keys(stats.categories).length} 
                icon="🏷️" 
                trend="neutral"
                color="green"
              />
            </div>

              <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Pincode Management</h3>
      <PincodeForm
        onSaved={() => {
          axios.get(`${import.meta.env.VITE_API_URL}/api/pincodes`)
            .then(res => setPincodes(res.data))
            .catch(console.error);
        }}
      />
      <div className="mt-6">
        <PincodeList
          pincodes={pincodes}
          onDeleted={(id) => {
            setPincodes(p => p.filter(x => x._id !== id));
          }}
        />
      </div>
    </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button 
                  onClick={() => setActiveTab('products')}
                  className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition flex flex-col items-center"
                >
                  <span className="text-2xl mb-2">➕</span>
                  <span>Add Product</span>
                </button>

                <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition flex flex-col items-center">
                  <span className="text-2xl mb-2">📦</span>
                  <span>Inventory</span>
                </button>
                <button 
                  onClick={() => setActiveTab('settings')}
                  className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition flex flex-col items-center"
                >
                  <span className="text-2xl mb-2">⚙️</span>
                  <span>Settings</span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow p-6">
  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
  <div className="space-y-4">
    {stats.recentActivity?.length > 0 ? (
      stats.recentActivity.map((activity, index) => (
        <div key={index} className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition">
          <div className="bg-blue-100 p-2 rounded-full mr-3">
            <span className="text-blue-600">📝</span>
          </div>
          <div className="flex-1">
            <div className="flex justify-between">
              <p className="font-medium">{activity.name}</p>
              <span className="text-xs text-gray-500">
                {new Date(activity.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="flex justify-between mt-1">
              <p className="text-sm text-gray-600">
                Colors: {activity.colors}
              </p>
              <p className="text-sm text-gray-600">
                Stock: {activity.stock}
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(activity.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))
    ) : (
      <p className="text-gray-500 text-center py-4">No recent activity</p>
    )}
  </div>
</div>
</div>
        )}

       {activeTab === 'products' && (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
              <button
                onClick={() => window.scrollTo({ top: document.querySelector('#product-form').offsetTop, behavior: 'smooth' })}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Product
              </button>
            </div>

            <div className="bg-white rounded-xl shadow p-6" id="product-form">
              <ProductForm />
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">All Products</h3>

              </div>
              <ProductList />
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Account Settings</h2>
            
            <div className="bg-white rounded-xl shadow p-6">
              <UpdateCredentials />
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-xl font-semibold mb-4">System Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                 
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notifications</p>
                    <p className="text-sm text-gray-500">Enable or disable system notifications</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}