import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../axios';
import { 
  FaPlus, 
  FaTrash, 
  FaCloudUploadAlt 
} from 'react-icons/fa';

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  
  const [productImages, setProductImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [previewNewImages, setPreviewNewImages] = useState([]);

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productResponse = await axios.get(`/products/get-product/${productId}`);
        const product = productResponse.data.data;

        setName(product.name);
        setPrice(product.price);
        setDescription(product.description);
        setCategory(product.category.name);
        setQuantity(product.quantity);
        setProductImages(product.productImages);

        const categoriesResponse = await axios.get('/categories/get-all-categories');
        setCategories(categoriesResponse.data.data);
      } catch (err) {
        setError('Failed to fetch product details');
        console.error(err);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    const newImagePreviews = files.map(file => URL.createObjectURL(file));
    
    setNewImages(prev => [...prev, ...files]);
    setPreviewNewImages(prev => [...prev, ...newImagePreviews]);
  };

  const removeExistingImage = (imageToRemove) => {
    setProductImages(prev => 
      prev.filter(image => image !== imageToRemove)
    );
  };

  const removeNewImage = (indexToRemove) => {
    setNewImages(prev => prev.filter((_, index) => index !== indexToRemove));
    setPreviewNewImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      formData.append('name', name);
      formData.append('price', price);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('quantity', quantity);

      formData.append('productImages', JSON.stringify(productImages));

      newImages.forEach((file) => {
        formData.append('images', file);
      });

      const response = await axios.patch(
        `/products/update-product/${productId}`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      navigate(`/products/${productId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-dark-primary/90 rounded-xl p-4 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-light-blue mb-6 sm:mb-8">Edit Product</h2>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 text-sm sm:text-base">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Product Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-dark-primary border border-slate-gray rounded-lg text-white text-sm sm:text-base"
            />
          </div>

          {/* Price and Quantity Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Price
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-dark-primary border border-slate-gray rounded-lg text-white text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-dark-primary border border-slate-gray rounded-lg text-white text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-dark-primary border border-slate-gray rounded-lg text-white text-sm sm:text-base"
            >
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-dark-primary border border-slate-gray rounded-lg text-white text-sm sm:text-base resize-vertical"
            />
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Product Images
            </label>
            
            {/* Existing Images */}
            {productImages.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm text-gray-400 mb-2">Current Images:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
                  {productImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square">
                        <img 
                          src={image} 
                          alt={`Product Image ${index + 1}`} 
                          className="w-full h-full object-cover rounded-lg" 
                        />
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeExistingImage(image)} 
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 sm:p-1.5 text-xs hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <FaTrash className="w-2 h-2 sm:w-3 sm:h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Image Upload */}
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              onChange={handleImageUpload} 
              className="mb-4"
            />

            {/* New Image Previews */}
            {previewNewImages.length > 0 && (
              <div>
                <h4 className="text-sm text-gray-400 mb-2">New Images to Upload:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
                  {previewNewImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square">
                        <img 
                          src={image} 
                          alt={`New Image Preview ${index + 1}`} 
                          className="w-full h-full object-cover rounded-lg" 
                        />
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeNewImage(index)} 
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 sm:p-1.5 text-xs hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <FaTrash className="w-2 h-2 sm:w-3 sm:h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className={`w-full py-3 sm:py-4 bg-blue-600 text-white rounded-lg font-medium text-sm sm:text-base transition-all ${
              loading 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-blue-700 active:bg-blue-800'
            }`} 
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;