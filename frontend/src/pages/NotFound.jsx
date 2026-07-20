import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <h1 className="text-9xl font-bold font-spartan text-primary/10 select-none">404</h1>
      <h2 className="text-3xl font-bold font-spartan mt-4 text-dark">Page Not Found</h2>
      <p className="text-gray-500 mt-2 max-w-md">
        We're sorry, the page you requested could not be found. It may have been moved or deleted.
      </p>
      <Link
        to="/"
        className="mt-8 bg-primary hover:bg-primary-hover transition-colors text-white font-semibold px-6 py-3 rounded-lg flex items-center space-x-2 shadow-lg shadow-primary/20"
      >
        <ShoppingBag className="h-5 w-5" />
        <span>Back to Shopping</span>
      </Link>
    </div>
  );
};

export default NotFound;
