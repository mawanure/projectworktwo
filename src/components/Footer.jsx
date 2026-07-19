import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import toast from 'react-hot-toast';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Send 
} from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setSubmitting(true);
    try {
      await apiClient.post('/api/newsletter/subscribe', { email });
      toast.success('Thank you for subscribing to our newsletter!');
      setEmail('');
    } catch (error) {
      const msg = error.response?.data?.message || 'Subscription failed. You may already be subscribed.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-auto">
      {/* Newsletter Section */}
      <section className="bg-dark text-white py-12 px-6 md:px-16 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="text-xl md:text-2xl font-bold font-spartan">Sign Up For Newsletters</h4>
          <p className="text-sm text-gray-400 mt-1">
            Get e-mail updates about our latest shop and <span className="text-accent-yellow font-medium">special offers</span>
          </p>
        </div>
        <form onSubmit={handleSubscribe} className="flex w-full lg:w-auto max-w-md items-center">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-grow px-4 py-3 text-sm text-dark bg-white rounded-l-lg outline-none focus:ring-1 focus:ring-primary w-full md:w-80"
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-primary hover:bg-primary-hover transition-colors text-white text-sm font-semibold px-6 py-3 rounded-r-lg flex items-center space-x-2"
          >
            {submitting ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
      </section>

      {/* Main Footer Links */}
      <div className="section-p1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 py-16 px-6 md:px-16">
        {/* Contact Column */}
        <div className="flex flex-col space-y-4">
          <img className="h-10 md:h-12 w-fit object-contain mb-2" src="/images/logo.png" alt="CozyCart logo" />
          <h4 className="text-base font-bold text-dark uppercase tracking-wider">Contact Us</h4>
          <div className="space-y-2 text-sm text-gray-500">
            <p className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              <span>Chatogram, Bangladesh</span>
            </p>
            <p className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-primary shrink-0" />
              <span>+880 1823456789</span>
            </p>
            <p className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-primary shrink-0" />
              <span>10:00 - 18:00, Mon–Sat</span>
            </p>
          </div>
          
          {/* Social Icons */}
          <div className="pt-2">
            <h4 className="text-sm font-bold text-dark uppercase tracking-wider mb-3">Follow Us</h4>
            <div className="flex space-x-3">
              <a href="#" className="p-2 bg-gray-200 hover:bg-primary hover:text-white transition-colors rounded-full text-gray-600">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="p-2 bg-gray-200 hover:bg-primary hover:text-white transition-colors rounded-full text-gray-600">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" className="p-2 bg-gray-200 hover:bg-primary hover:text-white transition-colors rounded-full text-gray-600">
                <svg className="h-4 w-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="p-2 bg-gray-200 hover:bg-primary hover:text-white transition-colors rounded-full text-gray-600">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* About Column */}
        <div className="flex flex-col space-y-3">
          <h4 className="text-base font-bold text-dark uppercase tracking-wider mb-1">About Info</h4>
          <Link to="/about" className="text-sm text-gray-500 hover:text-primary transition-colors">About Us</Link>
          <a href="#" className="text-sm text-gray-500 hover:text-primary transition-colors">Delivery Information</a>
          <a href="#" className="text-sm text-gray-500 hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="text-sm text-gray-500 hover:text-primary transition-colors">Terms & Conditions</a>
          <Link to="/contact" className="text-sm text-gray-500 hover:text-primary transition-colors">Contact Us</Link>
        </div>

        {/* My Account Column */}
        <div className="flex flex-col space-y-3">
          <h4 className="text-base font-bold text-dark uppercase tracking-wider mb-1">My Account</h4>
          <Link to="/login" className="text-sm text-gray-500 hover:text-primary transition-colors">Sign In</Link>
          <Link to="/cart" className="text-sm text-gray-500 hover:text-primary transition-colors">View Cart</Link>
          <Link to="/wishlist" className="text-sm text-gray-500 hover:text-primary transition-colors">My Wishlist</Link>
          <Link to="/orders" className="text-sm text-gray-500 hover:text-primary transition-colors">Track My Order</Link>
          <Link to="/contact" className="text-sm text-gray-500 hover:text-primary transition-colors">Help & Support</Link>
        </div>

        {/* App Install Column */}
        <div className="flex flex-col space-y-4">
          <h4 className="text-base font-bold text-dark uppercase tracking-wider">Install App</h4>
          <p className="text-sm text-gray-500">From App Store or Google Play</p>
          <div className="flex space-x-2">
            <img src="/images/pay/app.jpg" alt="App Store" className="h-10 border border-gray-200 rounded object-contain" />
            <img src="/images/pay/play.jpg" alt="Google Play" className="h-10 border border-gray-200 rounded object-contain" />
          </div>
          <p className="text-sm text-gray-500 pt-2">Secured Payment Gateways</p>
          <img src="/images/pay/pay.png" alt="Payment methods" className="h-7 w-fit object-contain" />
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-200 py-6 text-center text-xs text-gray-400">
        <p>&copy; {new Date().getFullYear()} Stay Home. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
