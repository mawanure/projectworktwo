import React, { useState } from 'react';
import apiClient from '../api/apiClient';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !emailOrPhone || !message) {
      toast.error('Please fill in all fields.');
      return;
    }
    setSubmitting(true);
    try {
      await apiClient.post('/api/contact', {
        name,
        emailOrPhone,
        message,
      });
      toast.success('Your message has been sent successfully!');
      setName('');
      setEmailOrPhone('');
      setMessage('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Page Header */}
      <section 
        className="relative bg-[url('/images/banner/b1.jpg')] bg-cover bg-center h-[25vh] w-full flex flex-col justify-center items-center text-center px-4 select-none mb-16"
      >
        <h2 className="text-white text-4xl font-extrabold font-spartan tracking-wide">#Let's_Talk</h2>
        <p className="text-gray-200 text-sm mt-1">Leave a message. We love to hear from you!</p>
      </section>

      {/* Details & Info Map */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-start">
        <div className="space-y-6">
          <span className="text-xs text-primary font-bold uppercase tracking-wider block">Get in Touch</span>
          <h2 className="text-3xl font-bold font-spartan text-dark">Visit One of Our Agency Locations</h2>
          <p className="text-sm text-gray-500 font-sans leading-relaxed">
            Have any inquiries, suggestions, or issues? Contact us directly. Our customer support desk is ready to resolve queries immediately.
          </p>

          <div className="space-y-4 pt-4">
            <div className="flex items-start space-x-3.5">
              <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-dark text-sm">Head Office</h4>
                <p className="text-xs text-gray-500 font-sans mt-0.5">Chatogram, Bangladesh</p>
              </div>
            </div>
            <div className="flex items-start space-x-3.5">
              <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-dark text-sm">Contact Support</h4>
                <p className="text-xs text-gray-500 font-sans mt-0.5">+880 1823456789</p>
              </div>
            </div>
            <div className="flex items-start space-x-3.5">
              <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-dark text-sm">Email Channel</h4>
                <p className="text-xs text-gray-500 font-sans mt-0.5">support@stayhome.com</p>
              </div>
            </div>
            <div className="flex items-start space-x-3.5">
              <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-dark text-sm">Working Hours</h4>
                <p className="text-xs text-gray-500 font-sans mt-0.5">10:00 - 18:00, Monday to Saturday</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="h-80 w-full bg-gray-150 border border-gray-200 rounded-2xl overflow-hidden relative shadow-inner">
          <iframe 
            title="Office Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14757.247164998782!2d91.80486803730248!3d22.379612089408428!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30acd897c8d9e797%3A0xcf950346062f8b54!2sChattogram!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd" 
            className="w-full h-full border-none"
            loading="lazy"
          ></iframe>
        </div>
      </section>

      {/* Message Form */}
      <section className="bg-gray-50 py-16 px-6 md:px-12 border-t border-gray-100">
        <div className="max-w-3xl mx-auto bg-white border border-gray-100 p-8 rounded-2xl shadow-sm">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold font-spartan text-dark">Send a Message</h2>
            <p className="text-sm text-gray-500 mt-1">We will respond within 24 business hours.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-450 uppercase tracking-wider mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-sm focus:ring-1 focus:ring-primary focus:border-primary bg-gray-50"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-450 uppercase tracking-wider mb-2">
                Email Address or Phone Number
              </label>
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="john@example.com / 018XXXXXXXX"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-sm focus:ring-1 focus:ring-primary focus:border-primary bg-gray-50"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-450 uppercase tracking-wider mb-2">
                Your Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="Type your message details here..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-sm focus:ring-1 focus:ring-primary focus:border-primary bg-gray-50"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-12 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-lg shadow-primary/10 disabled:bg-gray-200 disabled:cursor-not-allowed"
            >
              <Send className="h-4.5 w-4.5" />
              <span>{submitting ? 'Sending Ticket...' : 'Submit Message'}</span>
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contact;
