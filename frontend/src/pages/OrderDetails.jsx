import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import { formatPrice } from '../utils/imageUtils';
import { ArrowLeft, Clock, MapPin, Phone, CreditCard, ChevronRight, FileText, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const OrderDetails = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  // Fetch Order details
  const { data: order, isLoading: loadingOrder, error } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const response = await apiClient.get(`/api/orders/${id}`);
      return response.data;
    },
  });

  // Fetch Payment Details
  const { data: payment } = useQuery({
    queryKey: ['order-payment', id],
    queryFn: async () => {
      const response = await apiClient.get(`/api/orders/${id}/payment`);
      return response.data;
    },
    enabled: !!order,
  });

  // Cancel Order mutation
  const cancelOrderMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.patch(`/api/orders/${id}/cancel`);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Order cancelled successfully!');
      queryClient.invalidateQueries(['order', id]);
      queryClient.invalidateQueries(['my-orders']);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to cancel order.');
    },
  });

  const getStatusStep = (status) => {
    const steps = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
    return steps.indexOf(status);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED':
        return 'text-green-600 font-bold';
      case 'CANCELLED':
        return 'text-red-500 font-bold';
      case 'PENDING':
        return 'text-yellow-600 font-bold';
      default:
        return 'text-primary font-bold';
    }
  };

  if (loadingOrder) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <XCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-dark font-spartan">Order Not Found</h2>
        <p className="text-gray-500 mt-1">The order reference does not exist or you do not have permission to view it.</p>
        <Link to="/orders" className="mt-6 bg-primary text-white px-6 py-2.5 rounded-lg font-semibold">
          Back to History
        </Link>
      </div>
    );
  }

  const currentStep = getStatusStep(order.status);
  const isCancelled = order.status === 'CANCELLED';

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs font-semibold text-gray-400 mb-8 select-none">
        <Link to="/orders" className="hover:text-primary transition-colors">Order History</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-dark">Order details</span>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-spartan text-dark tracking-wide flex items-center space-x-2">
            <span>Order Reference</span>
            <span className="text-primary font-mono ml-2">#SH-{order.id}</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Placed on {new Date(order.orderDate).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>

        {order.status === 'PENDING' && (
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to cancel this order?')) {
                cancelOrderMutation.mutate();
              }
            }}
            disabled={cancelOrderMutation.isPending}
            className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold border border-red-200 rounded-xl transition-all disabled:opacity-50 text-sm focus:outline-none cursor-pointer"
          >
            {cancelOrderMutation.isPending ? 'Cancelling...' : 'Cancel Order'}
          </button>
        )}
      </div>

      {/* Progress Tracker (Not shown if cancelled) */}
      {!isCancelled ? (
        <div className="bg-white border border-gray-100 p-6 md:p-8 rounded-2xl shadow-sm mb-10">
          <h3 className="text-sm font-bold text-dark uppercase tracking-wider mb-6">Delivery Tracking</h3>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-4 relative">
            {['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'].map((step, index) => {
              const isActive = index <= currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div key={step} className="flex md:flex-col items-center gap-4 md:gap-2 flex-grow last:flex-grow-0 relative z-10 w-full md:w-auto">
                  <div 
                    className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${
                      isActive 
                        ? 'border-primary bg-primary text-white shadow-sm shadow-primary/20' 
                        : 'border-gray-200 bg-white text-gray-400'
                    }`}
                  >
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  <span className={`text-sm font-semibold tracking-wide capitalize ${isActive ? 'text-dark font-bold' : 'text-gray-400'}`}>
                    {step}
                  </span>
                </div>
              );
            })}
            
            {/* Desktop progress bar connector line */}
            <div className="hidden md:block absolute left-4 right-4 top-4 h-0.5 bg-gray-100 -z-10">
              <div 
                className="h-full bg-primary transition-all duration-500" 
                style={{ width: `${(Math.max(0, currentStep) / 4) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex items-center space-x-3 mb-10">
          <XCircle className="h-6 w-6 text-red-500 shrink-0" />
          <div>
            <h3 className="font-bold text-red-800 text-sm">Order Cancelled</h3>
            <p className="text-xs text-red-600 mt-0.5">This order has been cancelled, and items stock has been restored.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Ordered Items list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-dark font-spartan">Order Items</h3>
            </div>
            
            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center p-6 space-x-4">
                  <div className="h-16 w-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                    <img
                      src={`/${item.product?.primaryImageUrl || 'images/products/f1.jpg'}`}
                      alt={item.product?.name}
                      className="h-full w-full object-cover object-center"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/products/f1.jpg';
                      }}
                    />
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-sm font-semibold text-dark line-clamp-1">{item.product?.name}</h4>
                    <p className="text-xs text-gray-400 font-bold uppercase mt-1">Size: {item.size} | Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-bold text-dark font-spartan">{formatPrice(item.subTotal)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shipping & Payment summary */}
        <div className="space-y-6">
          {/* Summary Panel */}
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-base font-bold text-dark font-spartan border-b border-gray-100 pb-3">Summary</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold text-dark">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery Charge</span>
                <span className="font-semibold text-dark">
                  {order.deliveryCharge === 0 ? 'FREE' : formatPrice(order.deliveryCharge)}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-3 font-bold text-dark">
                <span>Total</span>
                <span className="text-primary text-base font-spartan">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Payment details */}
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-base font-bold text-dark font-spartan border-b border-gray-100 pb-3">Delivery & Payment</h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex items-start space-x-2.5">
                <MapPin className="h-4.5 w-4.5 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-0.5">Shipping Address</h5>
                  <p className="text-gray-600 leading-relaxed font-sans">{order.shippingAddress}</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <Phone className="h-4.5 w-4.5 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-0.5">Phone Number</h5>
                  <p className="text-gray-600 font-sans">{order.phone}</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <CreditCard className="h-4.5 w-4.5 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-0.5">Payment Record</h5>
                  <p className="text-gray-600 font-sans">
                    Method: <span className="font-semibold">{order.paymentMethod}</span>
                  </p>
                  <p className="text-gray-600 font-sans text-xs mt-0.5">
                    Status: <span className={`font-semibold ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {order.paymentStatus}
                    </span>
                  </p>
                  {payment?.transactionId && (
                    <p className="text-xs text-gray-450 mt-1 font-mono">TXID: {payment.transactionId}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
