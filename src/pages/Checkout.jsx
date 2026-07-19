import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import apiClient from '../api/apiClient';
import { useCart } from '../contexts/CartContext';
import { ShoppingBag, Truck, CreditCard, ChevronRight, MapPin, Phone, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const checkoutSchema = z.object({
  shippingAddress: z.string().min(10, 'Please enter a complete delivery address (min 10 characters)'),
  phone: z.string().min(8, 'Please enter a valid phone number'),
  paymentMethod: z.enum(['COD', 'CREDIT_CARD', 'MOBILE_BANKING'], {
    errorMap: () => ({ message: 'Please select a payment method' }),
  }),
});

const Checkout = () => {
  const navigate = useNavigate();
  const { fetchCart } = useCart();
  const [serverError, setServerError] = useState('');

  // Fetch Checkout Preview details
  const { data: preview, isLoading: loadingPreview } = useQuery({
    queryKey: ['checkout-preview'],
    queryFn: async () => {
      const response = await apiClient.get('/api/orders/checkout-preview');
      return response.data;
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'COD',
    },
  });

  const selectedPaymentMethod = watch('paymentMethod');

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const response = await apiClient.post('/api/orders', {
        shippingAddress: data.shippingAddress,
        phone: data.phone,
        paymentMethod: data.paymentMethod,
      });
      toast.success('Order placed successfully!');
      
      // Refresh the cart context state (which is now cleared on the backend)
      await fetchCart();

      // Redirect to Order Success Page
      navigate(`/order-success?orderId=${response.data.id}`);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to place order. Please try again.');
    }
  };

  if (loadingPreview) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!preview || !preview.items || preview.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <h2 className="text-2xl font-bold font-spartan text-dark">No Items to Checkout</h2>
        <p className="text-gray-500 mt-2">Add some products to your cart before proceeding to checkout.</p>
        <Link to="/shop" className="mt-6 bg-primary text-white px-6 py-2.5 rounded-lg font-semibold">
          Explore Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs font-semibold text-gray-400 mb-10 select-none">
        <Link to="/cart" className="hover:text-primary transition-colors">Cart</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-dark">Checkout</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Shipping Form Panel */}
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-100 p-6 md:p-8 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold font-spartan text-dark mb-6 flex items-center space-x-2">
              <Truck className="h-5 w-5 text-primary" />
              <span>Shipping Details</span>
            </h2>

            {serverError && (
              <div className="flex items-center space-x-2 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm mb-6">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span className="font-medium">{serverError}</span>
              </div>
            )}

            <div className="space-y-5">
              {/* Shipping Address */}
              <div>
                <label className="block text-xs font-bold text-gray-450 uppercase tracking-wider mb-2">
                  Delivery Address
                </label>
                <div className="relative">
                  <textarea
                    {...register('shippingAddress')}
                    rows={3}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none text-sm transition-all focus:ring-1 focus:ring-primary ${
                      errors.shippingAddress ? 'border-red-300 bg-red-50/20' : 'border-gray-200 focus:border-primary bg-gray-50'
                    }`}
                    placeholder="Enter house no, road no, city, country..."
                  />
                  <MapPin className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-400" />
                </div>
                {errors.shippingAddress && (
                  <p className="text-xs text-red-500 font-semibold mt-1">{errors.shippingAddress.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-gray-450 uppercase tracking-wider mb-2">
                  Contact Phone Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    {...register('phone')}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none text-sm transition-all focus:ring-1 focus:ring-primary ${
                      errors.phone ? 'border-red-300 bg-red-50/20' : 'border-gray-200 focus:border-primary bg-gray-50'
                    }`}
                    placeholder="01712345678"
                  />
                  <Phone className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-400" />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-500 font-semibold mt-1">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Payment selector */}
          <div className="bg-white border border-gray-100 p-6 md:p-8 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold font-spartan text-dark mb-6 flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <span>Payment Option</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label 
                className={`border rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  selectedPaymentMethod === 'COD' 
                    ? 'border-primary bg-primary/5 text-primary font-bold' 
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                }`}
              >
                <input 
                  type="radio" 
                  value="COD" 
                  {...register('paymentMethod')} 
                  className="sr-only" 
                />
                <span className="text-sm font-semibold">Cash On Delivery</span>
                <span className="text-[10px] text-gray-400 mt-1 font-normal">Pay cash at your doorstep</span>
              </label>

              <label 
                className={`border rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  selectedPaymentMethod === 'CREDIT_CARD' 
                    ? 'border-primary bg-primary/5 text-primary font-bold' 
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                }`}
              >
                <input 
                  type="radio" 
                  value="CREDIT_CARD" 
                  {...register('paymentMethod')} 
                  className="sr-only" 
                />
                <span className="text-sm font-semibold">Credit/Debit Card</span>
                <span className="text-[10px] text-gray-400 mt-1 font-normal">Secure payment gateway</span>
              </label>

              <label 
                className={`border rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  selectedPaymentMethod === 'MOBILE_BANKING' 
                    ? 'border-primary bg-primary/5 text-primary font-bold' 
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                }`}
              >
                <input 
                  type="radio" 
                  value="MOBILE_BANKING" 
                  {...register('paymentMethod')} 
                  className="sr-only" 
                />
                <span className="text-sm font-semibold">Mobile Banking</span>
                <span className="text-[10px] text-gray-400 mt-1 font-normal">bkash, Rocket, Nagad</span>
              </label>
            </div>
            {errors.paymentMethod && (
              <p className="text-xs text-red-500 font-semibold mt-3">{errors.paymentMethod.message}</p>
            )}
          </div>
        </form>

        {/* Checkout Preview Details Summary Panel */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 self-start shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-dark font-spartan mb-6 pb-4 border-b border-gray-150">
            Checkout Summary
          </h3>

          <div className="max-h-52 overflow-y-auto divide-y divide-gray-100 pr-2 mb-6">
            {preview.items.map((item, index) => (
              <div key={index} className="flex py-3 space-x-3 text-sm">
                <div className="flex-grow">
                  <h4 className="font-semibold text-dark line-clamp-1">{item.productName}</h4>
                  <p className="text-xs text-gray-400 font-medium">Qty: {item.quantity} | Size: {item.size}</p>
                </div>
                <span className="font-bold text-dark shrink-0">${parseFloat(item.subTotal).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-150 mb-6">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span className="font-semibold text-dark">${parseFloat(preview.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Delivery Charge</span>
              <span className="font-semibold text-dark">
                {preview.deliveryCharge === 0 ? 'FREE' : `$${parseFloat(preview.deliveryCharge).toFixed(2)}`}
              </span>
            </div>
            
            <div className="border-t border-gray-150 pt-4 flex justify-between text-base font-bold text-dark font-spartan">
              <span>Total Amount</span>
              <span className="text-primary text-lg">${parseFloat(preview.totalAmount).toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="w-full h-12 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-lg shadow-primary/10 disabled:bg-gray-200 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="h-5 w-5" />
            <span>{isSubmitting ? 'Placing Order...' : 'Place Order'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
