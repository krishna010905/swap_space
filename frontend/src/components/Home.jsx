import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaTag, 
  FaHandshake, 
  FaShoppingCart, 
  FaUsers, 
  FaArrowRight
} from 'react-icons/fa';
import { selectUserAuth } from '../store/authSlice.js';
import { useSelector } from 'react-redux';

const SectionSeparator = ({ title }) => (
  <div className="relative my-16 py-4">
    <div className="absolute inset-0 flex items-center" aria-hidden="true">
      <div className="w-full border-t border-dark-primary/50"></div>
    </div>
    {title && (
      <div className="relative flex justify-center">
        <span className="bg-dark-primary px-4 text-light-blue text-sm uppercase tracking-wider">
          {title}
        </span>
      </div>
    )}
  </div>
);

const HomePage = () => {
  
  const userAuth = useSelector(selectUserAuth);

  return (
    <div className="min-h-screen bg-gradient-primary text-white relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-light-blue/10 via-dark-primary/20 to-dark-primary/30 animate-pulse"></div>
      </div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* Hero Section */}
        <section className="text-center mb-20 px-4">
          <div className="inline-block bg-dark-primary/50 rounded-full px-6 py-2 mb-6 text-light-blue text-sm sm:text-base">
            Buy & Sell Second-Hand Products
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-light-blue leading-tight">
            SwapSpace
          </h1>
          <p className="text-base sm:text-lg md:text-2xl max-w-3xl mx-auto text-gray-300 mb-10 leading-relaxed">
            Connecting Students to Buy and Sell Items Effortlessly
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 ">
            {!userAuth && 
              <Link 
                to="/signup" 
                className="flex items-center justify-center gap-3 px-8 sm:px-10 py-3 sm:py-4 text-lg sm:text-xl bg-light-blue text-dark-primary rounded-xl font-semibold hover:bg-opacity-90 transition-all group"
              >
                Get Started
                <FaArrowRight className="transform transition-transform group-hover:translate-x-1" />
              </Link>
            }
            <Link 
              to="/products/allproducts" 
              className="flex items-center justify-center gap-3 px-8 sm:px-10 py-3 sm:py-4 text-lg sm:text-xl bg-light-blue text-dark-primary rounded-xl font-semibold hover:bg-opacity-90 transition-all group"
            >
              Browse Products
              <FaShoppingCart className="transform transition-transform group-hover:scale-110" />
            </Link>
          </div>
        </section>

        <SectionSeparator title="Key Features" />

        {/* Features Section */}
        <section className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {[
            {
              icon: FaTag,
              title: 'Easy Listing',
              description: 'Quickly list your used items with detailed descriptions and photos.',
              color: 'text-light-blue',
              bgGradient: 'from-light-blue/10 to-dark-primary'
            },
            {
              icon: FaUsers,
              title: 'Community Focused',
              description: 'Connect with local buyers and sellers in your community.',
              color: 'text-slate-gray',
              bgGradient: 'from-slate-gray/10 to-dark-primary'
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className={`
                bg-gradient-to-br ${feature.bgGradient} 
                rounded-xl p-8 text-center 
                transform transition-all 
                hover:scale-105 hover:shadow-2xl 
                border border-dark-primary/30
              `}
            >
              <feature.icon className={`mx-auto text-6xl mb-6 ${feature.color}`} />
              <h2 className="text-2xl font-bold mb-4 text-light-blue">{feature.title}</h2>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </section>

        <SectionSeparator title="How It Works" />

        {/* How It Works Section */}
        <section className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            {
              step: '1',
              title: 'Create Account',
              description: 'Sign up and verify your profile to start buying or selling.'
            },
            {
              step: '2',
              title: 'List or Browse',
              description: 'List your items or browse through available products.'
            },
            {
              step: '3',
              title: 'Connect ',
              description: 'Communicate with sellers/buyers and buy/sell your product.'
            }
          ].map((item, index) => (
            <div 
              key={index}
              className="
                bg-dark-primary 
                rounded-xl p-8 
                text-center
                hover:shadow-2xl 
                transition-all 
                border border-dark-primary/30
              "
            >
              <div className="text-6xl font-bold mb-6 text-light-blue">
                {item.step}
              </div>
              <h3 className="text-xl font-bold text-light-blue mb-2">{item.title}</h3>
              <p className="text-gray-300">{item.description}</p>
            </div>
          ))}
        </section>


        {/* Call to Action */}
        { !userAuth && <>
            <SectionSeparator title="Join SwapSpace" />
            <section className="text-center bg-dark-primary rounded-xl p-8 sm:p-16 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-light-blue/10 to-dark-primary/30 opacity-20"></div>
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-light-blue">
                  Start Your Swapping Journey
                </h2>
                <p className="max-w-xl sm:max-w-2xl mx-auto text-gray-300 mb-6 sm:mb-10  text-base sm:text-lg">
                  Join SwapSpace today and be part of a community that makes buying and selling second-hand items easy, affordable, and sustainable.
                </p>
                <Link 
                  to="/signup"
                  className="
                    inline-flex items-center gap-3 
                    px-8 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl 
                    bg-light-blue text-dark-primary 
                    rounded-xl font-bold 
                    hover:bg-opacity-90 
                    transition-all 
                    group
                  "
                >
                  Sign Up Now
                  <FaArrowRight className="transform transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </section>
          </>
        }
        
      </div>
    </div>
  );
};

export default HomePage;