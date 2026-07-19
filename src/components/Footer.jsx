import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import toast from 'react-hot-toast';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
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
          <img className="h-8 md:h-10 w-fit object-contain mb-2" src="/images/logo.png" alt="Stay Home logo" />
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
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-gray-200 hover:bg-primary hover:text-white transition-colors rounded-full text-gray-600">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-gray-200 hover:bg-primary hover:text-white transition-colors rounded-full text-gray-600">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-gray-200 hover:bg-primary hover:text-white transition-colors rounded-full text-gray-600">
                <Youtube className="h-4 w-4" />
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
