import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, ShoppingBag, Eye } from 'lucide-react';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || '';

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50/50 px-6 py-12">
      <div className="w-full max-w-md bg-white border border-gray-100 p-8 rounded-2xl shadow-xl shadow-gray-100/50 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600 mb-6 scale-110">
          <CheckCircle className="h-10 w-10 animate-bounce" />
        </div>

        <h1 className="text-3xl font-extrabold font-spartan text-dark tracking-wide">
          Order Placed!
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Thank you for shopping with CozyCart. Your order has been successfully placed.
        </p>

        {orderId && (
          <div className="my-6 bg-gray-50 rounded-xl py-3 px-4 inline-block border border-gray-100">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Order Reference</span>
            <span className="text-base font-bold text-dark font-mono">#SH-{orderId}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link
            to={orderId ? `/orders/${orderId}` : '/orders'}
            className="flex-grow h-12 bg-white hover:bg-gray-50 border border-gray-200 text-dark font-semibold rounded-xl flex items-center justify-center space-x-2 transition-colors"
          >
            <Eye className="h-4.5 w-4.5" />
            <span>View Order</span>
          </Link>
          <Link
            to="/shop"
            className="flex-grow h-12 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl flex items-center justify-center space-x-2 transition-colors shadow-lg shadow-primary/10"
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
