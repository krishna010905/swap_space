import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  FaEye, 
  FaEyeSlash, 
  FaLock, 
  FaEnvelope, 
  FaIdBadge 
} from 'react-icons/fa';
import axios from '../axios';
import { login } from '../store/authSlice';

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sentOTP, setSentOTP] = useState(null);
  const [otpStatus, setOtpStatus] = useState(false);
  const [error, setError] = useState(null);

  
  const {
    register,
    handleSubmit,
    watch, 
    formState: { errors },
  } = useForm();
  
  const emailValue = watch('email');
  const otpValue = watch('otp');
  const isValidEmail = /^[a-zA-Z0-9._%+-]+@(gmail\.com|[a-zA-Z0-9-]+\.nitrr\.ac\.in)$/.test(emailValue);

  useEffect(() => {
    setSentOTP(null);
    setOtpStatus(false);
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
      };

      const response = await axios.post('/users/register', payload);

      if (response?.data?.success) {
        dispatch(
          login({
            user: response.data.user,
            accessToken: response.data.token,
          })
        );
        navigate('/');
      } else {
        console.error('Signup failed:', response?.data?.message);
      }
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSendOTP = async () => {
    setLoading(true);
    try {
      const payload = {
        email: emailValue
      } 
      const response = await axios.post('/users/sendOTP', payload);
      if (response?.data?.success) {
        setSentOTP(response?.data?.data.otp);
        console.log('OTP Sent Successfully');
      }
    } catch (error){
      console.error('OTP Sending error:', error);
    } finally {
      setLoading(false);
    }
  }
  const onVerifyOTP = async () => {
    setLoading(true);
    try {
      const payload = {
        otp: otpValue,
        OTP: sentOTP
      } 
      const response = await axios.post('/users/verifyOTP', payload);
      if (response?.data?.success) {
        setOtpStatus(true);
        console.log('OTP verified Successfully');
      }
    } catch (error){
      console.error('OTP Verification error:', error);
      setError("OTP not Verified!")
    } finally {
      setLoading(false);
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-primary"
    >
      <div className="max-w-md w-full bg-dark-primary/90 backdrop-blur-sm p-10 rounded-xl shadow-2xl border border-dark-primary/50">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-light-blue">
            Create Your Account
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Sign up to start buying and selling items
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaIdBadge className="text-gray-400" />
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
                placeholder="John Doe"
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
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@(gmail\.com|[a-zA-Z0-9-]+\.nitrr\.ac\.in)$/,
                    message: 'Invalid email address. It must be either gmail id or college email id',
                  },
                })}
                className={`
                  appearance-none block w-full px-4 py-3 pl-10
                  bg-dark-primary border rounded-lg
                  ${errors.email ? 'border-red-500' : 'border-slate-gray'}
                  text-white placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-light-blue
                `}
                placeholder="you@gmail.com"
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-sm text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>
          
          {/* Send OTP Button */}
          {isValidEmail && !sentOTP && (
            <button
              type="button"
              onClick={onSendOTP}
              className="w-full py-3 mt-2 rounded-lg text-dark-primary font-semibold bg-light-blue hover:bg-opacity-90 transition-all"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          )}

          {/* OTP Input */}
          {sentOTP && !otpStatus && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Enter OTP</label>
              <div className="relative">
                <input
                  type="text"
                  {...register('otp', { required: 'OTP is required' })}
                  className="block w-full px-4 py-3 bg-dark-primary border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-light-blue"
                  placeholder="Enter OTP"
                />
              </div>
              <button
                type="button"
                onClick={() => onVerifyOTP(watch('otp'))}
                className="w-full py-3 mt-2 rounded-lg text-dark-primary font-semibold bg-light-blue hover:bg-opacity-90 transition-all"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              {errors.otp && <p className="mt-2 text-sm text-red-400">{errors.otp.message}</p>}
              {error && (
                <p className="mt-2 text-sm text-red-400">
                  {error}
                </p>
              )}
            </div>
          )}

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                })}
                className={`
                  appearance-none block w-full px-4 py-3 pl-10 pr-10
                  bg-dark-primary border rounded-lg
                  ${errors.password ? 'border-red-500' : 'border-slate-gray'}
                  text-white placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-light-blue
                `}
                placeholder="********"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-2 text-sm text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading || !otpStatus}
              className={`
                w-full py-3 rounded-lg text-dark-primary font-semibold
                ${loading || !otpStatus 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-light-blue hover:bg-opacity-90'} 
                transition-all duration-300
              `}
            >
              {loading && otpStatus ? 'Signing Up...' : 'Create Account'}
            </button>
          </div>

          {/* Footer Links */}
          <div className="text-center">
            <div className="mt-4 text-sm text-gray-300">
              Already have an account? {' '}
              <Link 
                to="/login" 
                className="text-light-blue hover:underline"
              >
                Log In
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;