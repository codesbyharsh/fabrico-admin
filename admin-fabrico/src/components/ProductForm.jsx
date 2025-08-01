// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useLocation, useNavigate } from 'react-router-dom';

// export default function ProductForm() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const isEditMode = location.state?.product;
  
//   // Form state
//   const [name, setName] = useState('');
//   const [price, setPrice] = useState('');
//   const [category, setCategory] = useState('');
//   const [subCategory, setSubCategory] = useState('');
//   const [selectedSizes, setSelectedSizes] = useState([]);
//   const [variants, setVariants] = useState([{ file: null, color: '', quantity: 0 }]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Color suggestions
//   const colorSuggestions = [
//     'Red', 'Blue', 'Green', 'Black', 'White', 'Yellow', 
//     'Purple', 'Pink', 'Orange', 'Brown', 'Gray', 'Silver',
//     'Gold', 'Maroon', 'Navy', 'Teal', 'Olive', 'Lime'
//   ];

//   // Options
//   const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'NA'];
//   const subCategories = {
//     Men: ['T-shirt', 'Pant', 'Shirt', 'Sport', 'Banyan', 'Hoodies', 'Tracks', 'Cargo'],
//     Women: ['Saree', 'Punjabi', 'Dress', 'Lehnga', 'Kurti', 'T-shirt', 'Pant'],
//     Kids: ['T-shirt', 'Pant']
//   };

//   // Initialize form with product data if in edit mode
//   useEffect(() => {
//     if (isEditMode) {
//       const product = location.state.product;
//       setName(product.name);
//       setPrice(product.price);
//       setCategory(product.category);
//       setSubCategory(product.subCategory);
//       setSelectedSizes(product.sizes);
      
//       // Convert existing variants to our format
//       const formattedVariants = product.variants.map(variant => ({
//         color: variant.color,
//         quantity: variant.quantity,
//         file: null,
//         existingImages: variant.images
//       }));
      
//       setVariants(formattedVariants.length ? formattedVariants : [{ file: null, color: '', quantity: 0 }]);
//     }
//   }, [isEditMode, location.state]);

// const handleVariantChange = (index, field, value) => {
//   const newVariants = [...variants];
  
//   if (field === 'quantity') {
//     // Handle empty string case (allow empty input)
//     if (value === '') {
//       newVariants[index][field] = '';
//     } else {
//       // Parse as integer, default to 0 if invalid
//       const numValue = parseInt(value, 10);
//       newVariants[index][field] = isNaN(numValue) ? 0 : numValue;
//     }
//   } else {
//     newVariants[index][field] = value;
//   }
  
//   setVariants(newVariants);
// };

//   const addVariantField = () => {
//     if (variants.length < 10) {
//       setVariants([...variants, { file: null, color: '', quantity: 0 }]);
//     }
//   };

//   const removeVariantField = (index) => {
//     if (variants.length > 1) {
//       const newVariants = [...variants];
//       newVariants.splice(index, 1);
//       setVariants(newVariants);
//     }
//   };

//   const toggleSize = (size) => {
//     setSelectedSizes(prev => 
//       prev.includes(size) 
//         ? prev.filter(s => s !== size) 
//         : [...prev, size]
//     );
//   };

//   const getColorSuggestions = (input) => {
//     if (!input) return colorSuggestions;
//     return colorSuggestions.filter(color => 
//       color.toLowerCase().includes(input.toLowerCase())
//     );
//   };

//   const validateColor = (color) => {
//     return colorSuggestions.some(
//       validColor => validColor.toLowerCase() === color.toLowerCase()
//     );
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       // Validate form
//       if (!name || !price || !category || !subCategory || selectedSizes.length === 0) {
//         throw new Error('Please fill all required fields');
//       }

//       // Validate variants
//       for (const variant of variants) {
//         if ((!variant.file && !variant.existingImages) || !variant.color) {
//           throw new Error('Please fill all variant details');
//         }
        
//         // Validate color name
//         if (!validateColor(variant.color)) {
//           throw new Error(`Please choose a valid color for variant: ${variant.color}. Valid colors are: ${colorSuggestions.join(', ')}`);
//         }
        
//         if (variant.quantity < 0 || isNaN(variant.quantity)) {
//           throw new Error('Please enter a valid quantity (0 or higher)');
//         }
        
//         if (variant.file?.size > 5 * 1024 * 1024) {
//           throw new Error(`File ${variant.file.name} exceeds 5MB limit`);
//         }
//       }

//       const formData = new FormData();
//       formData.append('name', name);
//       formData.append('price', price);
//       formData.append('category', category);
//       formData.append('subCategory', subCategory);
//       formData.append('sizes', selectedSizes.join(','));
      
//       // For edit mode, include the product ID
//       if (isEditMode) {
//         formData.append('id', location.state.product._id);
//       }
      
//       // Handle image uploads
//       variants.forEach((variant) => {
//         formData.append('colors', variant.color);
//         formData.append('quantities', variant.quantity.toString()); // Ensure quantity is string
        
//         if (variant.file) {
//           const timestamp = Date.now();
//           const colorName = variant.color.replace(/\s+/g, '-').toLowerCase();
//           const fileName = `${name}-${colorName}-${timestamp}.${variant.file.name.split('.').pop()}`;
          
//           const renamedFile = new File([variant.file], fileName, { 
//             type: variant.file.type 
//           });
          
//           formData.append('images', renamedFile);
//         } else if (variant.existingImages) {
//           variant.existingImages.forEach(img => {
//             formData.append('existingImages', img);
//           });
//         }
//       });

//       const url = isEditMode 
//         ? `${import.meta.env.VITE_API_URL}/api/products/${location.state.product._id}`
//         : `${import.meta.env.VITE_API_URL}/api/products`;

//       const method = isEditMode ? 'put' : 'post';

//       const response = await axios[method](
//         url,
//         formData,
//         {
//           headers: { 'Content-Type': 'multipart/form-data' },
//           timeout: 60000
//         }
//       );

//       alert(isEditMode ? 'Product updated successfully' : 'Product added successfully');
//       navigate('/dashboard');

//     } catch (err) {
//       console.error('Product submission error:', err);
//       setError(err.response?.data?.error || err.message || 
//         (isEditMode ? 'Failed to update product' : 'Failed to add product'));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <h2 className="text-2xl font-bold mb-4">
//         {isEditMode ? 'Edit Product' : 'Add New Product'}
//       </h2>
      
//       {error && (
//         <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       <div>
//         <label className="block text-sm font-medium mb-1">Product Name*</label>
//         <input
//           type="text"
//           placeholder="Enter product name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//           className="block w-full p-2 border rounded"
//         />
//       </div>
      
//       <div>
//         <label className="block text-sm font-medium mb-1">Price*</label>
//         <input
//           type="number"
//           placeholder="Enter price"
//           value={price}
//           onChange={(e) => setPrice(e.target.value)}
//           required
//           min="0"
//           step="0.01"
//           className="block w-full p-2 border rounded"
//         />
//       </div>
      
//       <div>
//         <label className="block text-sm font-medium mb-1">Category*</label>
//         <select
//           value={category}
//           onChange={(e) => {
//             setCategory(e.target.value);
//             setSubCategory('');
//           }}
//           required
//           className="block w-full p-2 border rounded"
//         >
//           <option value="">Select Category</option>
//           <option value="Men">Men</option>
//           <option value="Women">Women</option>
//           <option value="Kids">Kids</option>
//         </select>
//       </div>
      
//       {category && (
//         <div>
//           <label className="block text-sm font-medium mb-1">Subcategory*</label>
//           <select
//             value={subCategory}
//             onChange={(e) => setSubCategory(e.target.value)}
//             required
//             className="block w-full p-2 border rounded"
//           >
//             <option value="">Select Subcategory</option>
//             {subCategories[category].map((sc) => (
//               <option key={sc} value={sc}>{sc}</option>
//             ))}
//           </select>
//         </div>
//       )}
      
//       <div>
//         <label className="block text-sm font-medium mb-1">Available Sizes*</label>
//         <div className="flex flex-wrap gap-2">
//           {sizeOptions.map((size) => (
//             <button
//               type="button"
//               key={size}
//               onClick={() => toggleSize(size)}
//               className={`px-3 py-1 rounded-full text-sm border ${
//                 selectedSizes.includes(size)
//                   ? 'bg-blue-600 text-white border-blue-600'
//                   : 'bg-white text-gray-700 border-gray-300'
//               }`}
//             >
//               {size}
//             </button>
//           ))}
//         </div>
//       </div>
      
//   <div className="space-y-6">
//         <label className="block text-sm font-medium">Color Variants*</label>
//         {variants.map((variant, index) => (
//           <div key={index} className="border p-4 rounded-lg space-y-4">
//             <h3 className="font-medium">Variant #{index + 1}</h3>

//             <div>
//               <label className="block text-sm font-medium mb-1">Image*</label>
//               {variant.existingImages?.map((img, imgIndex) => (
//                 <div key={imgIndex} className="mb-2">
//                   <img src={img} alt={`Existing ${variant.color}`} className="h-20 object-cover" />
//                   <span className="text-xs text-gray-500">Existing image</span>
//                 </div>
//               ))}
//               <input
//                 type="file"
//                 onChange={(e) => handleVariantChange(index, 'file', e.target.files[0])}
//                 required={!variant.existingImages}
//                 className="block w-full p-2 border rounded"
//                 accept="image/*"
//               />
//             </div>
            
//           <div>
//               <label className="block text-sm font-medium mb-1">Color Name*</label>
//               <input
//                 type="text"
//                 value={variant.color}
//                 onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
//                 placeholder="e.g., Red, Blue, Black"
//                 required
//                 className="block w-full p-2 border rounded"
//                 list={`color-suggestions-${index}`}
//               />
//               <datalist id={`color-suggestions-${index}`}>
//                 {getColorSuggestions(variant.color).map((color, i) => (
//                   <option key={i} value={color} />
//                 ))}
//               </datalist>
//               {variant.color && !validateColor(variant.color) && (
//                 <p className="text-red-500 text-xs mt-1">
//                   Suggested colors: {colorSuggestions.join(', ')}
//                 </p>
//               )}
//             </div>
            
//               <div>
//               <label className="block text-sm font-medium mb-1">Available Quantity*</label>
//              <input
//                 type="number"
//                 value={variant.quantity === undefined || variant.quantity === null ? '' : variant.quantity}
//                 onChange={(e) => handleVariantChange(index, 'quantity', e.target.value)}
//                 placeholder="Enter quantity"
//                 required
//                 min="0"
//                 className="block w-full p-2 border rounded"
//                 />
//             </div>
            
//             {variants.length > 1 && (
//               <button
//                 type="button"
//                 onClick={() => removeVariantField(index)}
//                 className="bg-red-500 text-white px-3 py-1 rounded text-sm"
//               >
//                 Remove Variant
//               </button>
//             )}
//           </div>
//         ))}
        
//         {variants.length < 10 && (
//           <button
//             type="button"
//             onClick={addVariantField}
//             className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//           >
//             Add Another Color Variant
//           </button>
//         )}
//       </div>
      
//       <button 
//         className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full transition ${
//           loading ? 'opacity-70 cursor-not-allowed' : ''
//         }`}
//         type="submit"
//         disabled={loading}
//       >
//         {loading ? (
//           <span className="flex items-center justify-center">
//             <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//             </svg>
//             Processing...
//           </span>
//         ) : isEditMode ? 'Update Product' : 'Add Product'}
//       </button>
//     </form>
//   );
// }



import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ProductForm({ product, onClose, onSuccess }) {
  const isEditMode = !!product;
  
  // Form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [variants, setVariants] = useState([{ file: null, color: '', quantity: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Color suggestions
  const colorSuggestions = [
    'Red', 'Blue', 'Green', 'Black', 'White', 'Yellow', 
    'Purple', 'Pink', 'Orange', 'Brown', 'Gray', 'Silver',
    'Gold', 'Maroon', 'Navy', 'Teal', 'Olive', 'Lime'
  ];

  // Options
  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'NA'];
  const subCategories = {
    Men: ['T-shirt', 'Pant', 'Shirt', 'Sport', 'Banyan', 'Hoodies', 'Tracks', 'Cargo'],
    Women: ['Saree', 'Punjabi', 'Dress', 'Lehnga', 'Kurti', 'T-shirt', 'Pant'],
    Kids: ['T-shirt', 'Pant']
  };

  // Initialize form with product data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      setName(product.name);
      setPrice(product.price);
      setCategory(product.category);
      setSubCategory(product.subCategory);
      setSelectedSizes(product.sizes);
      
      const formattedVariants = product.variants.map(variant => ({
        color: variant.color,
        quantity: variant.quantity,
        file: null,
        existingImages: variant.images
      }));
      
      setVariants(formattedVariants.length ? formattedVariants : [{ file: null, color: '', quantity: '' }]);
    }
  }, [isEditMode, product]);

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    
    if (field === 'quantity') {
      // Handle empty string case
      if (value === '') {
        newVariants[index][field] = '';
      } else {
        // Parse as integer, default to empty if invalid
        const numValue = parseInt(value, 10);
        newVariants[index][field] = isNaN(numValue) ? '' : numValue;
      }
    } else {
      newVariants[index][field] = value;
    }
    
    setVariants(newVariants);
  };

  const addVariantField = () => {
    if (variants.length < 10) {
      setVariants([...variants, { file: null, color: '', quantity: '' }]);
    }
  };

  const removeVariantField = (index) => {
    if (variants.length > 1) {
      const newVariants = [...variants];
      newVariants.splice(index, 1);
      setVariants(newVariants);
    }
  };

  const toggleSize = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size) 
        : [...prev, size]
    );
  };

  const getColorSuggestions = (input) => {
    if (!input) return colorSuggestions;
    return colorSuggestions.filter(color => 
      color.toLowerCase().includes(input.toLowerCase())
    );
  };

  const validateColor = (color) => {
    return colorSuggestions.some(
      validColor => validColor.toLowerCase() === color.toLowerCase()
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate form
      if (!name || !price || !category || !subCategory || selectedSizes.length === 0) {
        throw new Error('Please fill all required fields');
      }

      // Validate variants
      for (const variant of variants) {
        if ((!variant.file && !variant.existingImages) || !variant.color) {
          throw new Error('Please fill all variant details');
        }
        
        if (!validateColor(variant.color)) {
          throw new Error(`Please choose a valid color for variant: ${variant.color}. Valid colors are: ${colorSuggestions.join(', ')}`);
        }
        
        // if (variant.quantity === '' || variant.quantity === null || isNaN(variant.quantity) {
        //   throw new Error('Please enter a valid quantity for all variants');
        // }
        
        if (variant.quantity < 0) {
          throw new Error('Quantity cannot be negative');
        }
        
        if (variant.file?.size > 5 * 1024 * 1024) {
          throw new Error(`File ${variant.file.name} exceeds 5MB limit`);
        }
      }

      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('subCategory', subCategory);
      formData.append('sizes', selectedSizes.join(','));
      
      // For edit mode, include the product ID
      if (isEditMode) {
        formData.append('id', product._id);
      }
      
      // Handle image uploads
      variants.forEach((variant) => {
        formData.append('colors', variant.color);
        formData.append('quantities', variant.quantity.toString());
        
        if (variant.file) {
          const timestamp = Date.now();
          const colorName = variant.color.replace(/\s+/g, '-').toLowerCase();
          const fileName = `${name}-${colorName}-${timestamp}.${variant.file.name.split('.').pop()}`;
          
          const renamedFile = new File([variant.file], fileName, { 
            type: variant.file.type 
          });
          
          formData.append('images', renamedFile);
        } else if (variant.existingImages) {
          variant.existingImages.forEach(img => {
            formData.append('existingImages', img);
          });
        }
      });

      const url = isEditMode 
        ? `${import.meta.env.VITE_API_URL}/api/products/${product._id}`
        : `${import.meta.env.VITE_API_URL}/api/products`;

      const method = isEditMode ? 'put' : 'post';

      await axios[method](
        url,
        formData,
        {
          headers: { 
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          timeout: 60000
        }
      );

      if (onSuccess) onSuccess();
      alert(isEditMode ? 'Product updated successfully' : 'Product added successfully');
      if (onClose) onClose();

    } catch (err) {
      console.error('Product submission error:', err);
      setError(err.response?.data?.error || err.message || 
        (isEditMode ? 'Failed to update product' : 'Failed to add product'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isEditMode ? 'Edit Product' : 'Add New Product'}
      </h2>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Product Name*</label>
            <input
              type="text"
              placeholder="Enter product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="block w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Price*</label>
            <input
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="0"
              step="0.01"
              className="block w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Category*</label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSubCategory('');
              }}
              required
              className="block w-full p-2 border rounded"
            >
              <option value="">Select Category</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>
          
          {category && (
            <div>
              <label className="block text-sm font-medium mb-1">Subcategory*</label>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                required
                className="block w-full p-2 border rounded"
              >
                <option value="">Select Subcategory</option>
                {subCategories[category].map((sc) => (
                  <option key={sc} value={sc}>{sc}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Available Sizes*</label>
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map((size) => (
              <button
                type="button"
                key={size}
                onClick={() => toggleSize(size)}
                className={`px-3 py-1 rounded-full text-sm border ${
                  selectedSizes.includes(size)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        
        <div className="space-y-6">
          <label className="block text-sm font-medium">Color Variants*</label>
          {variants.map((variant, index) => (
            <div key={index} className="border p-4 rounded-lg space-y-4 bg-gray-50">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Variant #{index + 1}</h3>
                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariantField(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove Variant
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Image*</label>
                {variant.existingImages?.map((img, imgIndex) => (
                  <div key={imgIndex} className="mb-2">
                    <img src={img} alt={`Existing ${variant.color}`} className="h-20 object-cover rounded" />
                    <span className="text-xs text-gray-500">Existing image</span>
                  </div>
                ))}
                <input
                  type="file"
                  onChange={(e) => handleVariantChange(index, 'file', e.target.files[0])}
                  required={!variant.existingImages}
                  className="block w-full p-2 border rounded"
                  accept="image/*"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Color Name*</label>
                <input
                  type="text"
                  value={variant.color}
                  onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                  placeholder="e.g., Red, Blue, Black"
                  required
                  className="block w-full p-2 border rounded"
                  list={`color-suggestions-${index}`}
                />
                <datalist id={`color-suggestions-${index}`}>
                  {getColorSuggestions(variant.color).map((color, i) => (
                    <option key={i} value={color} />
                  ))}
                </datalist>
                {variant.color && !validateColor(variant.color) && (
                  <p className="text-red-500 text-xs mt-1">
                    Suggested colors: {colorSuggestions.join(', ')}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Available Quantity*</label>
                <input
                  type="number"
                  value={variant.quantity === undefined || variant.quantity === null ? '' : variant.quantity}
                  onChange={(e) => handleVariantChange(index, 'quantity', e.target.value)}
                  placeholder="Enter quantity"
                  required
                  min="0"
                  className="block w-full p-2 border rounded"
                />
              </div>
            </div>
          ))}
          
          {variants.length < 10 && (
            <button
              type="button"
              onClick={addVariantField}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
            >
              + Add Another Color Variant
            </button>
          )}
        </div>
        
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : isEditMode ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
}