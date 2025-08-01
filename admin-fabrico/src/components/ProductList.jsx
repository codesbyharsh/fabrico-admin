import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (!products.length && !loading) return <p className="text-center text-gray-500 mt-10">No products available</p>;

  return (
    <div className="mt-6 space-y-6">
      {/* 🔁 Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={fetchProducts}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* 🟩 First full-width card */}
      {products.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6 flex flex-col sm:flex-row gap-4 items-center h-[220px]">
          <img
            src={products[0].photo}
            alt={products[0].name}
            className="w-full sm:w-64 h-full object-cover rounded-md"
          />
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{products[0].name}</h2>
            <p className="text-gray-600">₹{products[0].price}</p>
            <p className="text-gray-500">Category: {products[0].category} | Sizes: {products[0].sizes.join(', ')}</p>
          </div>
          <button
            onClick={() => deleteProduct(products[0]._id)}
            className="text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>
      )}

      {/* 🔲 Grid for other products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.slice(1).map((p) => (
          <div
            key={p._id}
            className="bg-white shadow rounded-lg overflow-hidden flex flex-col h-[360px]"
          >
            <img
              src={p.photo}
              alt={p.name}
              className="w-full h-[180px] object-cover"
            />
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="text-gray-600">₹{p.price}</p>
                <p className="text-gray-500 text-sm">Category: {p.category}</p>
                <p className="text-gray-500 text-sm">Sizes: {p.sizes.join(', ')}</p>
              </div>
              <button
                onClick={() => deleteProduct(p._id)}
                className="text-sm text-red-600 mt-2 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
