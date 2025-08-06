import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedVariantIndices, setSelectedVariantIndices] = useState({});
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [subCategoryFilter, setSubCategoryFilter] = useState('');

    const subCategories = {
    Men: ['T-shirt', 'Pant', 'Shirt', 'Sport', 'Banyan', 'Hoodies', 'Tracks', 'Cargo'],
    Women: ['Saree', 'Punjabi', 'Dress', 'Lehnga', 'Kurti', 'T-shirt', 'Pant'],
    Kids: ['T-shirt', 'Pant']
  };

 const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (categoryFilter) params.append('category', categoryFilter);
      if (subCategoryFilter) params.append('subCategory', subCategoryFilter);

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products?${params.toString()}`
      );
      
      setProducts(res.data);
      
      const indices = {};
      res.data.forEach((product) => {
        indices[product._id] = 0;
      });
      setSelectedVariantIndices(indices);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(id);
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/products/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        setProducts(products.filter(product => product._id !== id));
        alert(response.data.message || 'Product deleted successfully');
      } else {
        throw new Error(response.data.error || 'Failed to delete product');
      }
    } catch (err) {
      console.error('Detailed delete error:', {
        message: err.message,
        response: err.response?.data,
        config: err.config
      });
      alert(`Delete failed: ${err.response?.data?.error || err.message || 'Server error'}`);
      fetchProducts();
    } finally {
      setDeletingId(null);
    }
  };

  const deleteVariant = async (productId, variantIndex) => {
    if (!window.confirm('Are you sure you want to delete this color variant?')) {
      return;
    }

    try {
      setDeletingId(productId);
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/products/${productId}/variants`,
        { variantIndex },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        fetchProducts();
        alert('Color variant deleted successfully');
      } else {
        throw new Error(response.data.error || 'Failed to delete variant');
      }
    } catch (err) {
      console.error('Variant delete error:', err);
      alert(`Failed to delete variant: ${err.response?.data?.error || err.message || 'Server error'}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (product) => {
    navigate('/product-form', { state: { product } });
  };

  const handleVariantSelect = (productId, index) => {
    setSelectedVariantIndices(prev => ({
      ...prev,
      [productId]: index
    }));
  };

 useEffect(() => {
    fetchProducts();
  }, [searchTerm, categoryFilter, subCategoryFilter]);

  // Reset subcategory filter when category changes
  useEffect(() => {
    setSubCategoryFilter('');
  }, [categoryFilter]);
  
  return (
    <div className="mt-6 space-y-6">
      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      )}

 {/* Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Categories</option>
            {Object.keys(subCategories).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <select
            value={subCategoryFilter}
            onChange={(e) => setSubCategoryFilter(e.target.value)}
            disabled={!categoryFilter}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <option value="">All Subcategories</option>
            {categoryFilter && subCategories[categoryFilter].map(subCat => (
              <option key={subCat} value={subCat}>{subCat}</option>
            ))}
          </select>
          
          <button
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('');
              setSubCategoryFilter('');
            }}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={fetchProducts}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* No Products Found */}
      {products.length === 0 && !loading && (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500 text-lg">No products found matching your filters</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('');
              setSubCategoryFilter('');
            }}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Clear Filters
          </button>
        </div>
      )}


      {/* Product List */}
       {products.length > 0 && (
        <>
          {/* First full-width card */}
          <div className="bg-white shadow rounded-lg p-6 flex flex-col sm:flex-row gap-4 items-center h-[220px]">
            {products[0].variants[selectedVariantIndices[products[0]._id] || 0]?.images[0] ? (
              <img
                src={products[0].variants[selectedVariantIndices[products[0]._id] || 0].images[0]}
                alt={products[0].name}
                className="w-full sm:w-64 h-full object-cover rounded-md"
              />
            ) : (
              <div className="w-full sm:w-64 h-full bg-gray-100 rounded-md flex items-center justify-center">
                <span className="text-gray-400">No image</span>
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{products[0].name}</h2>
              <p className="text-gray-600">₹{products[0].price}</p>
              
              {/* COD Badge */}
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  products[0].codAvailable 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {products[0].codAvailable ? 'COD Available' : 'COD Not Available'}
                </span>
              </div>

              <p className="text-gray-500">Category: {products[0].category} | Sub: {products[0].subCategory}</p>
              <div className="mt-2">
                <p className="text-sm font-medium">Colors:</p>
                <div className="flex gap-2 mt-1 flex-wrap">
                  {products[0].variants.map((variant, i) => (
                    <div key={i} className="flex items-center">
                      <button
                        onClick={() => handleVariantSelect(products[0]._id, i)}
                        className={`flex items-center p-1 rounded ${(selectedVariantIndices[products[0]._id] || 0) === i ? 'bg-gray-200' : ''}`}
                      >
                        <span 
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: variant.color.toLowerCase() }}
                        />
                        <span className="ml-1 text-xs">{variant.color} ({variant.quantity})</span>
                      </button>
                      <button
                        onClick={() => deleteVariant(products[0]._id, i)}
                        className="ml-1 text-red-500 hover:text-red-700 text-xs"
                        disabled={deletingId === products[0]._id}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleEdit(products[0])}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => deleteProduct(products[0]._id)}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                disabled={deletingId === products[0]._id}
              >
                {deletingId === products[0]._id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>

          {/* Grid for other products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(1).map((product) => (
              <div
                key={product._id}
                className="bg-white shadow rounded-lg overflow-hidden flex flex-col h-[420px]"
              >
                {product.variants[selectedVariantIndices[product._id] || 0]?.images[0] ? (
                  <img
                    src={product.variants[selectedVariantIndices[product._id] || 0].images[0]}
                    alt={product.name}
                    className="w-full h-[180px] object-cover"
                  />
                ) : (
                  <div className="w-full h-[180px] bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="text-gray-600">₹{product.price}</p>
                    
                    {/* COD Badge for grid items */}
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        product.codAvailable 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.codAvailable ? 'COD Available' : 'COD Not Available'}
                      </span>
                    </div>
                    
                    <p className="text-gray-500 text-sm">Category: {product.category} | Sub: {product.subCategory}</p>
                    <div className="mt-2">
                      <p className="text-xs font-medium">Colors:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {product.variants.map((variant, i) => (
                          <div key={i} className="flex items-center">
                            <button
                              onClick={() => handleVariantSelect(product._id, i)}
                              className={`flex items-center p-1 rounded ${(selectedVariantIndices[product._id] || 0) === i ? 'bg-gray-200' : ''}`}
                            >
                              <span 
                                className="w-3 h-3 rounded-full border"
                                style={{ backgroundColor: variant.color.toLowerCase() }}
                              />
                              <span className="ml-1 text-xs">{variant.color}</span>
                            </button>
                            <button
                              onClick={() => deleteVariant(product._id, i)}
                              className="ml-1 text-red-500 hover:text-red-700 text-xs"
                              disabled={deletingId === product._id}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 flex-1"
                      disabled={deletingId === product._id}
                    >
                      {deletingId === product._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}