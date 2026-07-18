import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import { 
  FaTag, 
  FaMoneyBillWave, 
  FaClipboardList, 
  FaBoxOpen,
  FaList
} from 'react-icons/fa';

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/categories/get-all-categories');
        setCategories(response.data.data.map(category => ({
            _id: category._id,
            name: category.name
        })));
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const categoryOptions = categories.map(category => ({
    name: category.name,
    value: category.name
  }));

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validImageFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
    );

    if (validImageFiles.length > 4) {
      alert('Maximum 4 images allowed');
      return;
    }

    setImages(validImageFiles);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {

      const formData = new FormData();
      
      console.log('Selected Category:', data.category);

      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });

      images.forEach((file, index) => {
        formData.append(`images`, file);
      });

      const response = await axios.post('/products/add-product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate('/');
    } catch (error) {
      console.error('Product creation error:', error.response?.data || error.message);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-dark-primary/90 rounded-xl shadow-2xl p-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-light-blue">
            List Your Product
          </h2>
          <p className="mt-2 text-gray-300">
            Share your item with the SwapSpace community
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Product Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaTag className="text-gray-400" />
              </div>
              <input
                type="text"
                {...register('name', { 
                  required: 'Product name is required',
                  minLength: {
                    value: 3,
                    message: 'Product name must be at least 3 characters'
                  }
                })}
                className={`
                  appearance-none block w-full px-4 py-3 pl-10
                  bg-dark-primary border rounded-lg
                  ${errors.name ? 'border-red-500' : 'border-slate-gray'}
                  text-white placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-light-blue
                `}
                placeholder="Enter product name"
              />
            </div>
            {errors.name && (
              <p className="mt-2 text-sm text-red-400">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Price
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaMoneyBillWave className="text-gray-400" />
              </div>
              <input
                type="number"
                {...register('price', { 
                  required: 'Price is required',
                  min: {
                    value: 1,
                    message: 'Price must be greater than 0'
                  }
                })}
                className={`
                  appearance-none block w-full px-4 py-3 pl-10
                  bg-dark-primary border rounded-lg
                  ${errors.price ? 'border-red-500' : 'border-slate-gray'}
                  text-white placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-light-blue
                `}
                placeholder="Enter price"
              />
            </div>
            {errors.price && (
              <p className="mt-2 text-sm text-red-400">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <div className="relative">
              <div className="absolute top-3 left-0 pl-3 pointer-events-none">
                <FaClipboardList className="text-gray-400" />
              </div>
              <textarea
                {...register('description', { 
                  required: 'Description is required',
                  minLength: {
                    value: 10,
                    message: 'Description must be at least 10 characters'
                  }
                })}
                className={`
                  appearance-none block w-full px-4 py-3 pl-10
                  bg-dark-primary border rounded-lg
                  ${errors.description ? 'border-red-500' : 'border-slate-gray'}
                  text-white placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-light-blue
                  h-32
                `}
                placeholder="Describe your product in detail"
              />
            </div>
            {errors.description && (
              <p className="mt-2 text-sm text-red-400">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Quantity
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaBoxOpen className="text-gray-400" />
              </div>
              <input
                type="number"
                {...register('quantity', { 
                  required: 'Quantity is required',
                  min: {
                    value: 1,
                    message: 'Quantity must be greater than 0'
                  }
                })}
                className={`
                  appearance-none block w-full px-4 py-3 pl-10
                  bg-dark-primary border rounded-lg
                  ${errors.quantity ? 'border-red-500' : 'border-slate-gray'}
                  text-white placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-light-blue
                `}
                placeholder="Enter quantity"
              />
            </div>
            {errors.quantity && (
              <p className="mt-2 text-sm text-red-400">
                {errors.quantity.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Category
          </label>
          <select
            {...register('category', { required: 'Category is required' })}
            className={`
              block w-full px-4 py-3 bg-dark-primary border rounded-lg
              ${errors.category ? 'border-red-500' : 'border-slate-gray'}
              text-white placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-light-blue
            `}
          >
            <option value="">Select a category</option>
            {categoryOptions.map((cat, index) => {
                // console.log('Category:', cat);  // Log each category
                return (
                <option key={cat._id || index} value={cat.name}>
                    {cat.name}
                </option>
                );
            })}
          </select>
          {errors.category && (
            <p className="mt-2 text-sm text-red-400">
              {errors.category.message}
            </p>
          )}
        </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Product Images
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="block w-full text-white bg-dark-primary border rounded-lg"
            />
            {images.length > 0 && (
              <p className="mt-2 text-sm text-gray-300">
                {images.length} image(s) selected
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className={`w-full py-3 rounded-lg text-white bg-light-blue hover:bg-blue-600 focus:outline-none ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;