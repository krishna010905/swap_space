import React from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaInstagram, FaGithub } from 'react-icons/fa';

const Footer = () => {
  const socialLinks = [
    // { name: 'LinkedIn', url: 'https://www.linkedin.com/in/aashish-shukla-240472288/', icon: <FaLinkedin size={24} /> },
    // { name: 'Instagram', url: 'https://www.instagram.com/aashish__shukla/', icon: <FaInstagram size={24} /> },
    { name: 'GitHub', url: 'https://github.com/azor-ahai1', icon: <FaGithub size={24} /> }
  ];

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <footer className="bg-gradient-primary text-white py-8 border-t border-black">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-4">SwapSpace</h3>
            <p className="text-sm text-gray-300 max-w-xs mx-auto md:mx-0">
              A Platform to Buy and Sell Products for the NIT Raipur Students.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto md:mx-0">
              {quickLinks.map((link) => (
                <Link 
                  key={link.name}
                  to={link.path} 
                  className="text-sm text-gray-300 hover:text-yellow-300 transition-colors duration-200 ease-in-out"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex justify-center md:justify-start space-x-6">
              {socialLinks.map((social) => (
                <a 
                  key={social.name} 
                  href={social.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-yellow-300 transition-colors duration-200 ease-in-out"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} SwapSpace. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

// #6ED6CF
// #F99A32
