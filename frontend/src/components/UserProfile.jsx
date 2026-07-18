import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone,
  FaEdit,
  FaBox,
  FaShoppingCart
} from 'react-icons/fa';
import axios from '../axios';
import { selectUser } from '../store/authSlice';
import defaultImage from '../assets/default.jpg' ;

const UserProfile = () => {
  const { userId } = useParams();
  const loggedInUser = useSelector(selectUser);
  const [userProfile, setUserProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isCurrentUser = loggedInUser?._id === userId;

  // const isValidEmail = /^[a-zA-Z0-9._%+-]+@(gmail\.com|[a-zA-Z0-9-]+\.nitrr\.ac\.in)$/.test(userProfile?.email);
  const isValidEmail = /^[a-zA-Z0-9._%+-]+@(gmail\.com)$/.test(userProfile?.email);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const profileResponse = await axios.get(`/users/profile/${userId}`);
        // console.log(profileResponse);
        setUserProfile(profileResponse.data.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error.response?.data?.message || 'Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const renderProfileContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="bg-dark-primary/80 p-6 rounded-lg space-y-4">
            <h2 className="text-2xl font-bold text-light-blue mb-4">Profile Details</h2>
            <ProfileDetailItem 
              icon={<FaUser className="text-light-blue mr-3" />} 
              label="Name" 
              value={userProfile.name} 
            />
            <ProfileDetailItem 
              icon={<FaEnvelope className="text-light-blue mr-3" />} 
              label="Email" 
              value={
                <>
                  {userProfile.email} 
                  {/* {isValidEmail && <span className="text-green-400 ml-2">Verified Account</span>} */}
                </>
              } 
              
            />
            {userProfile.phoneNumber && (
              <ProfileDetailItem 
                icon={<FaPhone className="text-light-blue mr-3" />} 
                label="Phone" 
                value={userProfile.phoneNumber} 
              />
            )}
            {userProfile.instaID && (
              <ProfileDetailItem 
                icon={<FaBox className="text-light-blue mr-3" />} 
                label="Instagram" 
                value={userProfile.instaID} 
              />
            )}
          </div>
        );

      case 'orders':
        return (
          <div className="bg-dark-primary/80 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-light-blue mb-4">Order History</h2>
            {userProfile.orderHistory?.length === 0 ? (
              <EmptyState message="No orders found" />
            ) : (
              <OrdersList orders={userProfile.orderHistory} />
            )}
          </div>
        );

      case 'products':
        return (
          <div className="bg-dark-primary/80 p-6 rounded-lg">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-3 md:space-y-0">
              {/* Section Title */}
              <h2 className="text-2xl font-bold text-light-blue text-center md:text-left w-full">
                My Products
              </h2>

              {/* Add Product Button */}
              {isCurrentUser && (
                <Link 
                  to="/add-product" 
                  className="bg-light-blue text-dark-primary px-4 py-2 rounded-lg hover:bg-opacity-90 flex items-center justify-center w-full md:w-auto"
                >
                  + Add Product
                </Link>
              )}
            </div>
            {userProfile.productHistory?.length === 0 ? (
              <EmptyState message="No products listed" />
            ) : (
              <ProductsList products={userProfile.productHistory} />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  return (
    <div className="min-h-screen bg-gradient-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* User Header */}
        <div className="bg-dark-primary/90 rounded-t-xl p-6 flex flex-col md:flex-row items-center md:justify-between space-y-4 md:space-y-0">
          {/* User Info */}
          <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 text-center md:text-left">
            <div className="w-20 h-20 rounded-full overflow-hidden">
              <img 
                src={userProfile.profileImage || defaultImage} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-light-blue">
                {userProfile.name}
              </h1>
              <p className="text-gray-400">{userProfile.email}</p>
            </div>
          </div>

          {/* Edit Profile or Send Message Button */}
          {isCurrentUser ? (
            <Link 
              to={`/users/edit/${userProfile._id}`} 
              className="bg-light-blue text-dark-primary px-4 py-2 rounded-lg hover:bg-opacity-90 flex items-center justify-center w-full md:w-auto"
            >
              <FaEdit className="mr-2" /> Edit Profile
            </Link>
          ) : (
            <Link 
              to={`/users/conversation/${userProfile._id}`} 
              className="bg-light-blue text-dark-primary px-4 py-2 rounded-lg hover:bg-opacity-90 flex items-center justify-center w-full md:w-auto"
            >
              <FaEnvelope className="mr-2" /> Send Message
            </Link>
          )}
        </div>


        {/* Tabs */}
        {isCurrentUser && (
          <div className="bg-dark-primary/80 border-b border-slate-gray flex">
            {[
              { key: 'profile', icon: FaUser, label: 'Profile' },
              { key: 'orders', icon: FaShoppingCart, label: 'Order History' },
              { key: 'products', icon: FaBox, label: 'My Products' }
            ].map((tab) => (
              <TabButton 
                key={tab.key}
                isActive={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
                icon={tab.icon}
                label={tab.label}
              />
            ))}
          </div>
        )}

        {/* Profile Content */}
        <div className="mt-6">
          {renderProfileContent()}
        </div>
      </div>
    </div>
  );
};

// Sub-components
const ProfileDetailItem = ({ icon, label, value }) => (
  <div className="flex items-center">
    {icon}
    <div>
      <span className="text-light-blue mr-2">{label}:</span>
      <span className="text-white">{value}</span>
    </div>
  </div>
);

const OrdersList = ({ orders }) => (
  <div className="space-y-4">
    {orders.map((order) => (
      <div 
        key={order._id} 
        className="bg-dark-primary border border-slate-gray rounded-lg p-4"
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-white font-semibold">
              Order for {order.productDetails?.name || 'Product'}
            </p>
            <p className="text-gray-400">Status: {order.orderStatus}</p>
          </div>
          <span className="text-light-blue font-bold">
            ₹{order.price}
          </span>
        </div>
      </div>
    ))}
  </div>
);

const ProductsList = ({ products }) => (
  <div className="grid md:grid-cols-2 gap-4">
    {products.map((product) => (
      <div 
        key={product._id} 
        className="bg-dark-primary border border-slate-gray rounded-lg p-4"
      >
        <img 
          src={product.productImages[0]} 
          alt={product.name} 
          className="w-full h-40 object-cover rounded-lg mb-4"
        />
        <div className="flex justify-between items-center"> <div>
            <h3 className="text-white font-semibold">{product.name}</h3>
            <p className="text-gray-400">Price: ₹{product.price}</p>
          </div>
          <Link 
            to={`/products/${product._id}`} 
            className="bg-light-blue text-dark-primary px-2 py-1 rounded-lg hover:bg-opacity-90"
          >
            View
          </Link>
        </div>
      </div>
    ))}
  </div>
);

const EmptyState = ({ message }) => (
  <div className="text-center text-gray-400">
    <p>{message}</p>
  </div>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="loader"></div>
  </div>
);

const ErrorDisplay = ({ message }) => (
  <div className="text-red-500 text-center">
    <p>{message}</p>
  </div>
);

const TabButton = ({ isActive, onClick, icon: Icon, label }) => (
  <button 
    onClick={onClick} 
    className={`flex items-center p-4 transition-colors ${isActive ? 'bg-light-blue text-dark-primary' : 'text-gray-400 hover:bg-dark-primary/70'}`}
  >
    <Icon className="mr-2" />
    {label}
  </button>
);

export default UserProfile;