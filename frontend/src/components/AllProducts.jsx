import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaTag, 
  FaMoneyBillWave, 
  FaBoxOpen,
  FaFilter,
  FaSearch
} from 'react-icons/fa';
import axios from '../axios';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-dark-primary/80 rounded-xl overflow-hidden shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl">
      <img 
        src={product.productImages[0]} 
        alt={product.name} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-bold text-light-blue truncate">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <span className="flex items-center text-white">
            <FaMoneyBillWave className="mr-2 text-light-blue" />
            ₹{product.price}
          </span>
          <span className="flex items-center text-gray-300">
            <FaBoxOpen className="mr-2 text-light-blue" />
            Quantity: {product.quantity} 
          </span>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-gray-400 flex items-center">
            <FaTag className="mr-2 text-light-blue" />
            {product.productStatus}
          </span>
          <Link 
            to={`/products/${product._id}`}
            className="bg-light-blue text-dark-primary px-3 py-1 rounded-lg hover:bg-opacity-90 transition-all"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    searchQuery: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          axios.get('/products/get-all-products'),
          axios.get('/categories/get-all-categories')
        ]);

        setProducts(productsResponse.data.data);
        setCategories(categoriesResponse.data.data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
        setLoading(false);
      }
    };

    fetchProductsAndCategories();
  }, [navigate]);

  // console.log(products);

  useEffect(() => {
    // Apply filters
    let result = products;

    if (filters.category) {
      result = result.filter(product => 
        product.category.name === filters.category
      );
      // console.log(filters.category)
    }

    if (filters.minPrice) {
      result = result.filter(product => 
        product.price >= parseFloat(filters.minPrice)
      );
    }

    if (filters.maxPrice) {
      result = result.filter(product => 
        product.price <= parseFloat(filters.maxPrice)
      );
    }

    if (filters.searchQuery) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(result);
  }, [products, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-light-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Filters */}
        <div className="mb-8 grid md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="searchQuery"
              value={filters.searchQuery}
              onChange={handleFilterChange}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-dark-primary border border-slate-gray text-white"
            />
          </div>

          {/* Category Filter */}
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 rounded-lg bg-dark-primary border border-slate-gray text-white"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Price Range */}
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleFilterChange}
            placeholder="Min Price"
            className="w-full px-4 py-2 rounded-lg bg-dark-primary border border-slate-gray text-white"
          />
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            placeholder="Max Price"
            className="w-full px-4 py-2 rounded-lg bg-dark-primary border border-slate-gray text-white"
          />
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center text-white text-2xl">
            No products found
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;