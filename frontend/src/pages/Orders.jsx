import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import { formatPrice } from '../utils/imageUtils';
import { FileText, Calendar, DollarSign, ArrowRight, Eye } from 'lucide-react';

const Orders = () => {
  const navigate = useNavigate();

  // Fetch Order History
  const { data: orders, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const response = await apiClient.get('/api/orders/my-orders');
      return response.data;
    },
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'PENDING':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'CONFIRMED':
      case 'PROCESSING':
      case 'SHIPPED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'CANCELLED':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'PAID':
        return 'text-green-600 font-semibold';
      case 'UNPAID':
        return 'text-yellow-600 font-semibold';
      case 'FAILED':
      case 'REFUNDED':
        return 'text-red-500 font-semibold';
      default:
        return 'text-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="p-6 bg-gray-50 rounded-full text-gray-400 mb-6 scale-110">
          <FileText className="h-16 w-16" />
        </div>
        <h2 className="text-2xl font-bold font-spartan text-dark">No Orders Found</h2>
        <p className="text-gray-500 mt-2 max-w-sm">
          You haven't placed any orders yet. Start shopping and explore our collections!
        </p>
        <Link
          to="/shop"
          className="mt-8 bg-primary hover:bg-primary-hover transition-colors text-white font-semibold px-6 py-3 rounded-lg flex items-center space-x-2"
        >
          <span>Shop Collections</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
      <h1 className="text-3xl font-bold font-spartan text-dark mb-10 tracking-wide">Order History</h1>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        {/* Desktop Table Headers */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
          <span className="col-span-2">Order Reference</span>
          <span className="col-span-3">Order Date</span>
          <span className="col-span-2">Total Amount</span>
          <span className="col-span-2 text-center">Payment Status</span>
          <span className="col-span-2 text-center">Order Status</span>
          <span className="col-span-1 text-right">Actions</span>
        </div>

        <div className="divide-y divide-gray-100">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-6 hover:bg-gray-50/50 transition-colors"
            >
              {/* Reference */}
              <div className="col-span-2">
                <span className="text-xs text-gray-400 md:hidden font-bold block mb-1">Reference:</span>
                <span className="font-bold text-dark font-mono">#SH-{order.id}</span>
              </div>

              {/* Date */}
              <div className="col-span-3">
                <span className="text-xs text-gray-400 md:hidden font-bold block mb-1">Date:</span>
                <span className="text-sm text-gray-500 font-sans">
                  {new Date(order.orderDate).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              {/* Total */}
              <div className="col-span-2">
                <span className="text-xs text-gray-400 md:hidden font-bold block mb-1">Total:</span>
                <span className="text-sm font-bold text-primary font-spartan">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>

              {/* Payment status */}
              <div className="col-span-2 md:text-center text-sm font-sans">
                <span className="text-xs text-gray-400 md:hidden font-bold block mb-1">Payment:</span>
                <span className={getPaymentStatusColor(order.paymentStatus)}>
                  {order.paymentStatus}
                </span>
                <span className="text-xs text-gray-400 block font-normal mt-0.5">({order.paymentMethod})</span>
              </div>

              {/* Order status badge */}
              <div className="col-span-2 md:text-center">
                <span className="text-xs text-gray-400 md:hidden font-bold block mb-1">Status:</span>
                <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              {/* Action details */}
              <div className="col-span-1 text-left md:text-right">
                <button
                  onClick={() => navigate(`/orders/${order.id}`)}
                  className="p-2 border border-gray-250 rounded-xl hover:bg-primary hover:text-white hover:border-primary transition-all focus:outline-none"
                  title="View Details"
                >
                  <Eye className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
