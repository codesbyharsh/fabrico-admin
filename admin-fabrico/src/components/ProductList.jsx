// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// export default function ProductList() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [deletingId, setDeletingId] = useState(null);
//   const [selectedVariantIndices, setSelectedVariantIndices] = useState({});
//   const [editingProduct, setEditingProduct] = useState(null);
//   const navigate = useNavigate();

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
//       setProducts(res.data);
//       // Initialize selected variant indices
//       const indices = {};
//       res.data.forEach((product, i) => {
//         indices[product._id] = 0; // Default to first variant
//       });
//       setSelectedVariantIndices(indices);
//     } catch (err) {
//       console.error('Error fetching products:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteProduct = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
//       return;
//     }

//     try {
//       setDeletingId(id);
//       const response = await axios.delete(
//         `${import.meta.env.VITE_API_URL}/api/products/${id}`,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${localStorage.getItem('token')}`
//           }
//         }
//       );

//       if (response.data.success) {
//         setProducts(products.filter(product => product._id !== id));
//         alert(response.data.message || 'Product deleted successfully');
//       } else {
//         throw new Error(response.data.error || 'Failed to delete product');
//       }
//     } catch (err) {
//       console.error('Detailed delete error:', {
//         message: err.message,
//         response: err.response?.data,
//         config: err.config
//       });
      
//       alert(`Delete failed: ${err.response?.data?.error || err.message || 'Server error'}`);
//       fetchProducts();
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   const deleteVariant = async (productId, variantIndex) => {
//     if (!window.confirm('Are you sure you want to delete this color variant?')) {
//       return;
//     }

//     try {
//       setDeletingId(productId);
//       const response = await axios.patch(
//         `${import.meta.env.VITE_API_URL}/api/products/${productId}/variants`,
//         { variantIndex },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${localStorage.getItem('token')}`
//           }
//         }
//       );

//       if (response.data.success) {
//         fetchProducts(); // Refresh the list
//         alert('Color variant deleted successfully');
//       } else {
//         throw new Error(response.data.error || 'Failed to delete variant');
//       }
//     } catch (err) {
//       console.error('Variant delete error:', err);
//       alert(`Failed to delete variant: ${err.response?.data?.error || err.message || 'Server error'}`);
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   const handleEdit = (product) => {
//         navigate('/product-form', { state: { product } });
//   };

//   const handleVariantSelect = (productId, index) => {
//     setSelectedVariantIndices(prev => ({
//       ...prev,
//       [productId]: index
//     }));
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   if (!products.length && !loading) return <p className="text-center text-gray-500 mt-10">No products available</p>;

//   return (
//     <div className="mt-6 space-y-6">
//       {/* Refresh Button */}
//       <div className="flex justify-end">
//         <button
//           onClick={fetchProducts}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//           disabled={loading}
//         >
//           {loading ? 'Refreshing...' : 'Refresh'}
//         </button>
//       </div>

//       {/* Product List */}
//       {products.length > 0 && (
//         <>
//           {/* First full-width card */}
//           <div className="bg-white shadow rounded-lg p-6 flex flex-col sm:flex-row gap-4 items-center h-[220px]">
//             {products[0].variants[selectedVariantIndices[products[0]._id] || 0]?.images[0] ? (
//               <img
//                 src={products[0].variants[selectedVariantIndices[products[0]._id] || 0].images[0]}
//                 alt={products[0].name}
//                 className="w-full sm:w-64 h-full object-cover rounded-md"
//               />
//             ) : (
//               <div className="w-full sm:w-64 h-full bg-gray-100 rounded-md flex items-center justify-center">
//                 <span className="text-gray-400">No image</span>
//               </div>
//             )}
//             <div className="flex-1">
//               <h2 className="text-xl font-semibold">{products[0].name}</h2>
//               <p className="text-gray-600">₹{products[0].price}</p>
//               <p className="text-gray-500">Category: {products[0].category} | Sub: {products[0].subCategory}</p>
//               <div className="mt-2">
//                 <p className="text-sm font-medium">Colors:</p>
//                 <div className="flex gap-2 mt-1 flex-wrap">
//                   {products[0].variants.map((variant, i) => (
//                     <div key={i} className="flex items-center">
//                       <button
//                         onClick={() => handleVariantSelect(products[0]._id, i)}
//                         className={`flex items-center p-1 rounded ${(selectedVariantIndices[products[0]._id] || 0) === i ? 'bg-gray-200' : ''}`}
//                       >
//                         <span 
//                           className="w-4 h-4 rounded-full border"
//                           style={{ backgroundColor: variant.color.toLowerCase() }}
//                         />
//                         <span className="ml-1 text-xs">{variant.color} ({variant.quantity})</span>
//                       </button>
//                       <button
//                         onClick={() => deleteVariant(products[0]._id, i)}
//                         className="ml-1 text-red-500 hover:text-red-700 text-xs"
//                         disabled={deletingId === products[0]._id}
//                       >
//                         ×
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//             <div className="flex flex-col gap-2">
//               <button
//                 onClick={() => handleEdit(products[0])}
//                 className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
//               >
//                 Edit
//               </button>
//               <button
//                 onClick={() => deleteProduct(products[0]._id)}
//                 className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
//                 disabled={deletingId === products[0]._id}
//               >
//                 {deletingId === products[0]._id ? 'Deleting...' : 'Delete'}
//               </button>
//             </div>
//           </div>

//           {/* Grid for other products */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {products.slice(1).map((p) => (
//               <div
//                 key={p._id}
//                 className="bg-white shadow rounded-lg overflow-hidden flex flex-col h-[420px]"
//               >
//                 {p.variants[selectedVariantIndices[p._id] || 0]?.images[0] ? (
//                   <img
//                     src={p.variants[selectedVariantIndices[p._id] || 0].images[0]}
//                     alt={p.name}
//                     className="w-full h-[180px] object-cover"
//                   />
//                 ) : (
//                   <div className="w-full h-[180px] bg-gray-100 flex items-center justify-center">
//                     <span className="text-gray-400">No image</span>
//                   </div>
//                 )}
//                 <div className="p-4 flex-1 flex flex-col justify-between">
//                   <div className="space-y-1">
//                     <h3 className="text-lg font-semibold">{p.name}</h3>
//                     <p className="text-gray-600">₹{p.price}</p>
//                     <p className="text-gray-500 text-sm">Category: {p.category} | Sub: {p.subCategory}</p>
//                     <div className="mt-2">
//                       <p className="text-xs font-medium">Colors:</p>
//                       <div className="flex flex-wrap gap-1 mt-1">
//                         {p.variants.map((variant, i) => (
//                           <div key={i} className="flex items-center">
//                             <button
//                               onClick={() => handleVariantSelect(p._id, i)}
//                               className={`flex items-center p-1 rounded ${(selectedVariantIndices[p._id] || 0) === i ? 'bg-gray-200' : ''}`}
//                             >
//                               <span 
//                                 className="w-3 h-3 rounded-full border"
//                                 style={{ backgroundColor: variant.color.toLowerCase() }}
//                               />
//                               <span className="ml-1 text-xs">{variant.color}</span>
//                             </button>
//                             <button
//                               onClick={() => deleteVariant(p._id, i)}
//                               className="ml-1 text-red-500 hover:text-red-700 text-xs"
//                               disabled={deletingId === p._id}
//                             >
//                               ×
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex gap-2 mt-4">
//                     <button
//                       onClick={() => handleEdit(p)}
//                       className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex-1"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => deleteProduct(p._id)}
//                       className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 flex-1"
//                       disabled={deletingId === p._id}
//                     >
//                       {deletingId === p._id ? 'Deleting...' : 'Delete'}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }





import { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from './Modal';
import ProductForm from './ProductForm';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedVariantIndices, setSelectedVariantIndices] = useState({});
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
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
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      setDeletingId(id);
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  const deleteVariant = async (productId, variantIndex) => {
    if (!window.confirm('Are you sure you want to delete this color variant?')) return;
    
    try {
      setDeletingId(productId);
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/products/${productId}/variants`,
        { variantIndex },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      fetchProducts();
    } catch (err) {
      console.error('Variant delete error:', err);
      alert('Failed to delete variant');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  const handleVariantSelect = (productId, index) => {
    setSelectedVariantIndices(prev => ({ ...prev, [productId]: index }));
  };

  const handleAddSuccess = () => {
    setShowAddModal(false);
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (!products.length && !loading) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-500 mb-4">No products available</p>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add New Product
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Products</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add New
          </button>
          <button
            onClick={fetchProducts}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* 5-column grid with horizontal scrolling */}
      <div className="overflow-x-auto pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 min-w-max">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white shadow rounded-lg overflow-hidden flex flex-col h-96 w-64"
            >
              {product.variants[selectedVariantIndices[product._id] || 0]?.images[0] ? (
                <img
                  src={product.variants[selectedVariantIndices[product._id] || 0].images[0]}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold truncate">{product.name}</h3>
                  <p className="text-gray-600">₹{product.price}</p>
                  <p className="text-gray-500 text-sm truncate">
                    {product.category} | {product.subCategory}
                  </p>
                  <div className="mt-2">
                    <p className="text-xs font-medium">Colors:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {product.variants.map((variant, i) => (
                        <div key={i} className="flex items-center">
                          <button
                            onClick={() => handleVariantSelect(product._id, i)}
                            className={`flex items-center p-1 rounded ${
                              (selectedVariantIndices[product._id] || 0) === i ? 'bg-gray-200' : ''
                            }`}
                          >
                            <span 
                              className="w-3 h-3 rounded-full border"
                              style={{ backgroundColor: variant.color.toLowerCase() }}
                            />
                            <span className="ml-1 text-xs">
                              {variant.color} ({variant.quantity})
                            </span>
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
      </div>

      {/* Add Product Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <ProductForm 
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAddSuccess}
        />
      </Modal>

      {/* Edit Product Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
        <ProductForm 
          product={editingProduct}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            fetchProducts();
          }}
        />
      </Modal>
    </div>
  );
}