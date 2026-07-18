import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from '../axios';
import { 
  FaTag, 
  FaMoneyBillWave, 
  FaClipboardList, 
  FaBoxOpen,
  FaUser,
  FaEdit,
  FaCheckCircle,
  FaTimesCircle,
  FaEnvelope, 
  FaPhone, 
  FaInstagram
} from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { selectUser } from '../store/authSlice';
import { useSelector, } from 'react-redux';

const ProductOrders = ({ productId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
      const fetchProductOrders = async () => {
          try {
              setLoading(true);
              // console.log('Product Id:', productId);
              const response = await axios.get(`/orders/product-orders/${productId}`);
              // console.log('Full response:', response);
              setOrders(response.data.data);
              // console.log(orders);
          } catch (err) {
              setError(err.response?.data?.message || 'Failed to fetch orders');
          } finally {
              setLoading(false);
          }
      };

      fetchProductOrders();
  }, [productId]);

  const handleAcceptOrder = async (orderId) => {
      try {
          await axios.post('/orders/accept-order', { orderId });
          setOrders(prev => prev.filter(order => order._id !== orderId));
      } catch (err) {
        setError('Failed to Accept order :' , err.response?.data?.message);
      }
  };

  const handleRejectOrder = async (orderId) => {
      try {
          await axios.post('/orders/reject-order', { orderId });
          setOrders(prev => prev.filter(order => order._id !== orderId));
      } catch (err) {
        setError('Failed to Reject order :' , err.response?.data?.message);
      }
  };

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (orders.length === 0) return <div>No pending orders</div>;

  return (
      <div className="space-y-4 mt-8">
          <h3 className="text-2xl font-bold text-light-blue mb-4">
              Pending Orders ({orders.length})
          </h3>

          {orders.map((order) => (
              <div 
                  key={order._id} 
                  className="bg-dark-primary/80 rounded-lg p-4 border border-slate-gray"
              >
                  {/* Order details rendering */}
                  {/* <div className="flex items-center space-x-4 mb-4">
                      <img 
                          src={order.productDetails?.productImages?.[0] || ""} 
                          alt="Product" 
                          className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                          <h4 className="text-white font-semibold truncate">
                              {order.productDetails?.name || 'Unknown Product'}
                          </h4>
                          <p className="text-gray-400 text-sm">
                              Quantity: {order.quantity || 0} | Price: ₹{order.price || 0}
                          </p>
                      </div>
                  </div> */}

                  {/* Buyer details */}
                  <div className="bg-dark-primary/50 rounded-lg p-4 space-y-2">
                      <h5 className="text-light-blue font-semibold">Buyer Details</h5>
                      <div className="flex items-center space-x-2">
                          <FaUser className="text-light-blue" />
                          <Link 
                              to={`/users/${order.buyerDetails?._id}`} 
                              className="text-white hover:text-light-blue hover:underline"
                          >
                              {order.buyerDetails?.name || 'Unknown Buyer'}
                          </Link>
                      </div>
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-4">
                      <button
                          onClick={() => handleAcceptOrder(order._id)}
                          className="
                              w-full sm:w-1/2 py-2 
                              bg-green-600 text-white 
                              rounded-lg 
                              flex items-center justify-center 
                              space-x-2 
                              hover:bg-green-700
                          "
                      >
                          <FaCheckCircle />
                          <span>Accept Order</span>
                      </button>
                      <button
                          onClick={() => handleRejectOrder(order._id)}
                          className="
                              w-full sm:w-1/2 py-2 
                              bg-red-600 text-white 
                              rounded-lg 
                              flex items-center justify-center 
                              space-x-2 
                              hover:bg-red-700
                          "
                      >
                          <FaTimesCircle />
                          <span>Reject Order</span>
                      </button>
                  </div>
              </div>
          ))}
      </div>
  );
};


const ViewProduct = () => {
  const [product, setProduct] = useState(null);
  const [orders, setOrders] = useState([]);
  const [userOrderHistory, setUserOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { productId } = useParams();
  const navigate = useNavigate()

  const currentUser = useSelector(selectUser);
  const isProductOwner = currentUser?._id === product?.owner?._id;

  useEffect(() => {
    const fetchProductDetails = async () => {
        try {
            const user = await axios.get('/users/current-user')
            // console.log(user);
        } catch (err) {
            console.error('Error fetching current user details:', err);
            navigate('/login');
        }
      try {
        setLoading(true);
        const response = await axios.get(`/products/get-product/${productId}`);
        setProduct(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError(err.response?.data?.message || 'Failed to fetch product');
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  
  useEffect(() => {
    const fetchProductOrders = async () => {
        try {
            setLoading(true);
            // console.log('Product Id:', productId);
            const response = await axios.get(`/orders/product-all-orders/${productId}`);
            // console.log('Full response:', response);
            setOrders(response.data.data);
            // console.log(orders);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    fetchProductOrders();
}, [productId]);

  useEffect(() => {
    const fetchUserOrderHistory = async () => {
        try {
            const ordersResponse = await axios.get('/users/user-order-history')
            // setUserOrderHistory(ordersResponse.data.data);
            // console.log(ordersResponse.data.data.orderHistory);
            setUserOrderHistory(ordersResponse.data.data.orderHistory);
        } catch (err) {
            console.error('Error fetching user-order-history details:', err);
        }
    };
    fetchUserOrderHistory();
  },[]);

  const isProductInOrderHistory = () => {
    return userOrderHistory.some(order => 
      order.product === product._id && order.orderStatus === "Pending"
    );
  };

  const isProductSold = () => {
    return orders.some(order => 
      order.product === product?._id && order.orderStatus === "Accepted"
    );
  };
  // console.log(isProductSold())
  

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-light-blue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const onBuyProduct = async () => {
    try {

        const userResponse = await axios.get('/users/current-user');
        const user = userResponse.data.data;

        if(user._id === product.owner._id){
            return alert('Both Buyer and Seller are Same!');
        }
        const response = await axios.post('/orders/place-order', {
            buyer: user._id,
            seller: product.owner._id,
            product: product._id,
            quantity: product.quantity,
            price: product.price,
        });
        alert('Order placed successfully');
        // console.log(response.data);
        navigate(`/users/${user._id}`)
    } catch (err) {
        console.error('Error buying product:', err);
        // setError(err.response?.data?.message || 'Failed to buy product');
    }
  }

  const onCancelOrder = async () => {
    try {
        const orderToCancel = userOrderHistory.find(order => 
            order.product === product._id && order.orderStatus === "Pending"
        );

        if (!orderToCancel) {
            alert('No order found for this product');
            return;
        }

        const response = await axios.post('/orders/cancel-order', {
            orderId: orderToCancel._id,
            productId: orderToCancel.product
        });
        const ordersResponse = await axios.get('/users/user-order-history');
        setUserOrderHistory(ordersResponse.data.data.orderHistory);
        setProduct(prevProduct => ({
          ...prevProduct,
          productStatus: 'Available'
        }));

        alert('Order cancelled successfully');
        navigate(`/users/${user._id}`)
    } catch (err) {
        console.error('Error cancelling order:', err);
        alert('Failed to cancel order');
    }
  }


  return (
    <div className="min-h-screen bg-gradient-primary py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-dark-primary/90 rounded-xl shadow-2xl p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Image Gallery */}
        <div className="w-full">
          <Swiper
            navigation={true}
            modules={[Navigation]}
            className="product-swiper rounded-xl w-full"
          >
            {product.productImages.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="w-full aspect-square sm:aspect-video lg:aspect-square">
                  <img 
                    src={image} 
                    alt={`Product ${index + 1}`} 
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-light-blue">
            {product.name}
          </h1>
          
          {/* Edit Product Button - Conditional Rendering */}
          {isProductOwner && (
            <Link
              to={`/products/edit/${product._id}`}
              className="
                bg-light-blue text-dark-primary 
                px-4 py-2 rounded-lg 
                flex items-center justify-center space-x-2
                hover:bg-opacity-90
                w-full sm:w-auto
                flex-shrink-0
              "
            >
              <FaEdit />
              <span>Edit Product</span>
            </Link>
          )}
        </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 mb-4">
            <div className="flex items-center space-x-2">
              <FaMoneyBillWave className="text-light-blue" />
              <span className="text-lg sm:text-xl font-semibold text-white">
                ₹{product.price}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <FaBoxOpen className="text-light-blue" />
              <span className="text-white">
                Quantity: {product.quantity}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <FaClipboardList className="text-light-blue mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-white">Description</h3>
                <p className="text-gray-300 break-words">{product.description}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <FaTag className="text-light-blue flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-white">Category</h3>
                <p className="text-gray-300">{product.category.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <FaUser className="text-light-blue flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-white">Seller</h3>
                <p className="text-gray-300">{product.owner.name}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              className="
                w-full sm:flex-1 py-3 
                bg-blue-300 text-dark-primary 
                rounded-lg font-semibold
                hover:border hover:border-light-blue hover:bg-blue-950 hover:text-light-blue
                transition-all
              "
              onClick={() => {
                navigate(`/users/${product.owner._id}`)
              }}
            >
              Contact Seller
            </button>
            {
              isProductSold() ? (
                <button disabled={true}
                className="w-full sm:flex-1 py-3 
                bg-yellow-500 text-white 
                rounded-lg font-semibold
                hover:bg-red-600
                transition-all"
                >
                  Sold
                </button>
              ) : (isProductInOrderHistory() ? (
                <button 
                  onClick={onCancelOrder}
                  className="
                    w-full sm:flex-1 py-3 
                    bg-red-500 text-white 
                    rounded-lg font-semibold
                    hover:bg-red-600
                    transition-all
                  "
                >
                  Cancel Order
                </button>
              ) : (
                <button 
                  onClick={onBuyProduct}
                  className="
                    w-full sm:flex-1 py-3 
                    bg-blue-300 text-dark-primary 
                    rounded-lg font-semibold
                    hover:border hover:border-light-blue hover:bg-blue-950 hover:text-light-blue
                    transition-all
                  "
                >
                  Buy Product
                </button>
              ))
            }
            
          </div>
        </div>
        {isProductOwner && (
          <div className="col-span-1 lg:col-span-2">
            <ProductOrders productId={productId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewProduct;