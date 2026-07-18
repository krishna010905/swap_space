import React from 'react';
import { useForm } from 'react-hook-form';
import axios from '../axios';
import { Link } from 'react-router-dom';
import { 
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaEnvelope,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaCode,
  FaTools,
  FaLaptopCode
} from 'react-icons/fa';

const Contact = () => {
  const { register, handleSubmit, reset } = useForm();
  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      };

      const response = await axios.post('/users/review', payload);
      if (response?.data?.success) {
        reset();
        console.log('Message sent successfully');
      } 
     } catch (error) {
      console.error('Review sending failed:', error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-primary text-white relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-light-blue/10 via-dark-primary/20 to-dark-primary/30 animate-pulse"></div>
      </div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* Back to Home Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-light-blue hover:text-light-blue/80 transition-colors mb-8"
        >
          <FaArrowLeft />
          <span>Back to Home</span>
        </Link>

        {/* Contact Header */}
        <section className="text-center mb-16">
          <div className="inline-block bg-dark-primary/50 rounded-full px-6 py-2 mb-6 text-light-blue">
            Get in Touch
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-light-blue leading-tight">
            Contact Us
          </h1>
          <p className="text-l md:text-2xl max-w-3xl mx-auto text-gray-300 mb-10 leading-relaxed">
            Have questions about SwapSpace? We're here to help!
          </p>
        </section>

        {/* Contact Info & Form Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          {/* Contact Information */}
          <div className="bg-dark-primary rounded-xl p-8 border border-dark-primary/30 h-fit">
            <h2 className="text-3xl font-bold text-light-blue mb-8">Contact Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <FaEnvelope className="text-light-blue text-2xl mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-light-blue">Email</h3>
                  <p className="text-gray-300">swapspace.help@gmail.com</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <FaMapMarkerAlt className="text-light-blue text-2xl mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-light-blue">Location</h3>
                  <p className="text-gray-300">National Institute of Technology, Raipur</p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="mt-12">
              <h3 className="text-xl font-semibold text-light-blue mb-6">Connect With Me</h3>
              <div className="flex gap-6">
                {/* <a 
                  href="https://www.linkedin.com/in/aashish-shukla-240472288/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="
                    flex items-center justify-center 
                    w-14 h-14 rounded-full 
                    bg-dark-primary border border-light-blue 
                    text-light-blue text-2xl
                    hover:bg-light-blue hover:text-dark-primary
                    transition-all duration-300
                  "
                >
                  <FaLinkedin />
                </a> */}
                <a 
                  href="https://github.com/azor-ahai1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="
                    flex items-center justify-center 
                    w-14 h-14 rounded-full 
                    bg-dark-primary border border-light-blue 
                    text-light-blue text-2xl
                    hover:bg-light-blue hover:text-dark-primary
                    transition-all duration-300
                  "
                >
                  <FaGithub />
                </a>
                {/* <a 
                  href="https://instagram.com/aashish__shukla" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="
                    flex items-center justify-center 
                    w-14 h-14 rounded-full 
                    bg-dark-primary border border-light-blue 
                    text-light-blue text-2xl
                    hover:bg-light-blue hover:text-dark-primary
                    transition-all duration-300
                  "
                >
                  <FaInstagram />
                </a> */}
              </div>
            </div>
            {/* Currently Working on */}
            <div className="mt-10">
              <h3 className="text-xl font-semibold text-light-blue mb-6">Currently Working On</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <FaLaptopCode className="text-light-blue text-2xl mt-1" />
                  <div>
                    <h4 className="font-semibold text-light-blue">User Experience</h4>
                    <p className="text-gray-300">Enhancing features for better user experience.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <FaTools className="text-light-blue text-2xl mt-1" />
                  <div>
                    <h4 className="font-semibold text-light-blue">Secure Website</h4>
                    <p className="text-gray-300">Enhancing the privacy and security in the website.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <FaCode className="text-light-blue text-2xl mt-1" />
                  <div>
                    <h4 className="font-semibold text-light-blue">Responsiveness</h4>
                    <p className="text-gray-300">Enhancing the UI/UX for various devices</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-dark-primary rounded-xl p-8 border border-dark-primary/30">
            <h2 className="text-3xl font-bold text-light-blue mb-8">Send a Message</h2>
            
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="name" className="block mb-2 text-light-blue">Name</label>
                <input type="text" id="name" {...register('name')} className="w-full bg-dark-primary border border-dark-primary/50 focus:border-light-blue rounded-xl p-4 text-white focus:outline-none" placeholder="Your name" required/>
              </div>

              <div>
                <label htmlFor="email" className="block mb-2 text-light-blue">Email</label>
                <input type="email" id="email" {...register('email')} className="w-full bg-dark-primary border border-dark-primary/50 focus:border-light-blue rounded-xl p-4 text-white focus:outline-none" placeholder="Your email address" required/>
              </div>

              <div>
                <label htmlFor="subject" className="block mb-2 text-light-blue">Subject</label>
                <input type="text" id="subject" {...register('subject')} className="w-full bg-dark-primary border border-dark-primary/50 focus:border-light-blue rounded-xl p-4 text-white focus:outline-none" placeholder="Subject of your message" required/>
              </div>

              <div>
                <label htmlFor="message" className="block mb-2 text-light-blue">Message</label>
                <textarea id="message" rows="2" {...register('message')} className="w-full bg-dark-primary border border-dark-primary/50 focus:border-light-blue rounded-xl p-4 text-white focus:outline-none resize-none" placeholder="Your message..." required></textarea>
              </div>

              <button type="submit" className="w-full py-4 px-6 bg-light-blue text-dark-primary rounded-xl font-semibold text-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2">Send Message</button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="bg-dark-primary rounded-xl p-8 border border-dark-primary/30 mb-16">
          <h2 className="text-3xl font-bold text-light-blue mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
            //   {
            //     question: "How do I create an account?",
            //     answer: "Click the Sign Up button on our homepage and follow the instructions to create your SwapSpace account."
            //   },
              {
                question: "Is SwapSpace free to use?",
                answer: "Yes, SwapSpace is completely free for students to buy and sell second-hand items."
              },
              {
                question: "How do I list an item?",
                answer: "After logging in, Go to 'Dashboard' and click on 'Browse Products' and then after on 'Add New Product' and then fill the required details about your product."
              },
            //   {
            //     question: "Is my personal information secure?",
            //     answer: "We take privacy seriously. Your personal information is protected and only shared with buyers/sellers when necessary."
            //   }
            ].map((faq, index) => (
              <div key={index} className="border-b border-dark-primary/30 pb-4">
                <h3 className="text-xl font-semibold text-light-blue mb-2">{faq.question}</h3>
                <p className="text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;