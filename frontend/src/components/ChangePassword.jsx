import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaEye, 
  FaEyeSlash, 
  FaLock, 
  FaEnvelope 
} from 'react-icons/fa';
import axios from '../axios';

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [sentOTP, setSentOTP] = useState(null);
  const [otpStatus, setOtpStatus] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  
  const {
    register,
    handleSubmit,
    watch, 
    formState: { errors },
  } = useForm();
  
  const emailValue = watch('email');
  const otpValue = watch('otp');
  const passwordValue = watch('password');
  const confirmPasswordValue = watch('confirmPassword');
  const isValidEmail = /^[a-zA-Z0-9._%+-]+@(gmail\.com|[a-zA-Z0-9-]+\.nitrr\.ac\.in)$/.test(emailValue);

  useEffect(() => {
    setSentOTP(null);
    setOtpStatus(false);
    setError(null);
    setSuccess(null);
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        email: data.email,
        newPassword: data.password,
      };

      const response = await axios.post('/users/change-password', payload);

      if (response?.data?.success) {
        setSuccess('Password changed successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response?.data?.message || 'Password change failed');
      }
    } catch (error) {
      console.error('Password change error:', error);
      setError('Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onSendOTP = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        email: emailValue
      } 
      const response = await axios.post('/users/sendOTP', payload);
      if (response?.data?.success) {
        setSentOTP(response?.data?.data.otp);
        console.log('OTP Sent Successfully');
      } else {
        setError('Failed to send OTP. Please check your email.');
      }
    } catch (error){
      console.error('OTP Sending error:', error);
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const onVerifyOTP = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        otp: otpValue,
        OTP: sentOTP
      } 
      const response = await axios.post('/users/verifyOTP', payload);
      if (response?.data?.success) {
        setOtpStatus(true);
        console.log('OTP verified Successfully');
      } else {
        setError('OTP verification failed');
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
            Change Password
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Enter your email to reset your password
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                disabled={otpStatus}
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
              disabled={loading}
              className="w-full py-3 mt-2 rounded-lg text-dark-primary font-semibold bg-light-blue hover:bg-opacity-90 transition-all disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          )}

          {/* OTP Input */}
          {sentOTP && !otpStatus && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Enter OTP
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register('otp', { required: 'OTP is required' })}
                  className={`
                    block w-full px-4 py-3 bg-dark-primary border rounded-lg
                    ${errors.otp ? 'border-red-500' : 'border-slate-gray'}
                    text-white placeholder-gray-400 
                    focus:outline-none focus:ring-2 focus:ring-light-blue
                  `}
                  placeholder="Enter OTP"
                />
              </div>
              <button
                type="button"
                onClick={onVerifyOTP}
                disabled={loading}
                className="w-full py-3 mt-2 rounded-lg text-dark-primary font-semibold bg-light-blue hover:bg-opacity-90 transition-all disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              {errors.otp && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.otp.message}
                </p>
              )}
            </div>
          )}

          {/* New Password Form - Only show after OTP verification */}
          {otpStatus && (
            <>
              {/* New Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
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
                    placeholder="Enter new password"
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

              {/* Confirm Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) => 
                        value === passwordValue || 'Passwords do not match',
                    })}
                    className={`
                      appearance-none block w-full px-4 py-3 pl-10 pr-10
                      bg-dark-primary border rounded-lg
                      ${errors.confirmPassword ? 'border-red-500' : 'border-slate-gray'}
                      text-white placeholder-gray-400
                      focus:outline-none focus:ring-2 focus:ring-light-blue
                    `}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`
                    w-full py-3 rounded-lg text-dark-primary font-semibold
                    ${loading 
                      ? 'bg-gray-600 cursor-not-allowed' 
                      : 'bg-light-blue hover:bg-opacity-90'} 
                    transition-all duration-300
                  `}
                >
                  {loading ? 'Changing Password...' : 'Change Password'}
                </button>
              </div>
            </>
          )}

          {/* Error Messages */}
          {error && (
            <div className="text-center">
              <p className="text-sm text-red-400">
                {error}
              </p>
            </div>
          )}

          {/* Success Messages */}
          {success && (
            <div className="text-center">
              <p className="text-sm text-green-400">
                {success}
              </p>
            </div>
          )}

          {/* Footer Links */}
          <div className="text-center">
            <div className="mt-4 text-sm text-gray-300">
              Remember your password? {' '}
              <Link 
                to="/login" 
                className="text-light-blue hover:underline"
              >
                Log In
              </Link>
            </div>
            <div className="text-sm text-gray-300">
              Don't have an account? {' '}
              <Link 
                to="/signup" 
                className="text-light-blue hover:underline"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;