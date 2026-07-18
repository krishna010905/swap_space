import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaInstagram, 
  FaEdit 
} from 'react-icons/fa';
import axios from '../axios';
import { selectUser } from '../store/authSlice';
import { login } from '../store/authSlice'; 

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectUser);
  const [loading, setLoading] = useState(false);
  const [profileImageLocalPath, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    if (currentUser) {
      setValue('name', currentUser.name);
      setValue('email', currentUser.email);
      setValue('phoneNumber', currentUser.phoneNumber || '');
      setValue('instaID', currentUser.instaID || '');
    }
  }, [currentUser, setValue]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append('name', data.name);
      formData.append('email', data.email);

      if (data.phoneNumber) formData.append('phoneNumber', data.phoneNumber);
      if (data.instaID) formData.append('instaID', data.instaID);

      if (profileImageLocalPath) {
        console.log('Profile Image File:', profileImageLocalPath);
        formData.append('profileImage', profileImageLocalPath);
      }

      const response = await axios.patch('/users/update-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      dispatch(login({ 
        user: response.data.data,
        accessToken: currentUser.accessToken 
      }));
      console.log("User Data updated successfully")
      navigate(`/users/${currentUser._id}`);
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-dark-primary/90 rounded-xl shadow-2xl p-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-light-blue">
            Edit Profile
          </h2>
          <p className="mt-2 text-gray-300">
            Update your personal information
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Image Upload */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="profileImageUpload"
              />
              <label 
                htmlFor="profileImageUpload" 
                className="cursor-pointer"
              >
                <div className="relative">
                  <img 
                    src={previewImage || currentUser?.profileImage || '/default-avatar.png'} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full object-cover border-4 border-light-blue"
                  />
                  <div className="absolute bottom-0 right-0 bg-light-blue text-dark-primary p-2 rounded-full">
                    <FaEdit />
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                type="text"
                {...register('name', { 
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters'
                  }
                })}
                className={`
                  appearance-none block w-full px-4 py-3 pl-10
                  bg-dark-primary border rounded-lg
                  ${errors.name ? 'border-red-500' : 'border-slate-gray'}
                  text-white placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-light-blue
                `}
                placeholder="Enter your full name"
              />
            </div>
            {errors.name && (
              <p className="mt-2 text-sm text-red-400">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                disabled={true}
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Invalid email address',
                  },
                })}
                className={`
                  appearance-none block w-full px-4 py-3 pl-10
                  bg-dark-primary border rounded-lg
                  ${errors.email ? 'border-red-500' : 'border-slate-gray'}
                  text-white placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-light-blue
                `}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-sm text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone Number Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaPhone className="text-gray-400" />
              </div>
              <input
                type="tel"
                {...register('phoneNumber', {
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message:  'Invalid phone number, must be 10 digits',
                  },
                })}
                className={`
                  appearance-none block w-full px-4 py-3 pl-10
                  bg-dark-primary border rounded-lg
                  ${errors.phoneNumber ? 'border-red-500' : 'border-slate-gray'}
                  text-white placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-light-blue
                `}
                placeholder="Enter your phone number"
              />
            </div>
            {errors.phoneNumber && (
              <p className="mt-2 text-sm text-red-400">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          {/* Instagram ID Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Instagram ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaInstagram className="text-gray-400" />
              </div>
              <input
                type="text"
                {...register('instaID')}
                className={`
                  appearance-none block w-full px-4 py-3 pl-10
                  bg-dark-primary border rounded-lg
                  ${errors.instaID ? 'border-red-500' : 'border-slate-gray'}
                  text-white placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-light-blue
                `}
                placeholder="Enter your Instagram ID"
              />
            </div>
            {errors.instaID && (
              <p className="mt-2 text-sm text-red-400">
                {errors.instaID.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-3 bg-light-blue text-dark-primary font-semibold rounded-lg hover:bg-light-blue/80 transition duration-200"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;