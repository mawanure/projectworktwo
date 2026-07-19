import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

const Cart = () => {
  const { cart, loading, updateCartItemQuantity, removeItemFromCart } = useCart();
  const navigate = useNavigate();

  if (loading && cart.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="p-6 bg-gray-50 rounded-full text-gray-400 mb-6 scale-110">
          <ShoppingBag className="h-16 w-16" />
        </div>
        <h2 className="text-2xl font-bold font-spartan text-dark">Your Cart is Empty</h2>
        <p className="text-gray-500 mt-2 max-w-sm">
          Looks like you haven't added anything to your cart yet. Explore our latest fashion collections!
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

  const handleQuantityChange = async (itemId, currentQty, amount, stock) => {
    const nextQty = currentQty + amount;
    if (nextQty < 1) return;
    if (stock && nextQty > stock) {
      toast.error(`Only ${stock} items available in stock.`);
      return;
    }
    await updateCartItemQuantity(itemId, nextQty);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
      <h1 className="text-3xl font-bold font-spartan text-dark mb-10 tracking-wide">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items Table List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
            <span className="col-span-6">Product</span>
            <span className="col-span-2 text-center">Price</span>
            <span className="col-span-2 text-center">Quantity</span>
            <span className="col-span-2 text-right">Subtotal</span>
          </div>

          <div className="divide-y divide-gray-100 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            {cart.items.map((item) => (
              <div 
                key={item.id} 
                className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-6 hover:bg-gray-50/50 transition-colors"
              >
                {/* Product Column */}
                <div className="col-span-6 flex items-center space-x-4">
                  <div className="h-20 w-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
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
                  <div>
                    <h3 className="text-sm font-semibold text-dark line-clamp-1">{item.product?.name}</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase mt-1">Size: {item.size}</p>
                    <button
                      onClick={() => removeItemFromCart(item.id)}
                      className="mt-2 text-xs font-semibold text-red-500 hover:text-red-600 flex items-center space-x-1 border-0 bg-transparent focus:outline-none"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>

                {/* Price Column */}
                <div className="col-span-2 text-left md:text-center">
                  <span className="text-xs text-gray-400 md:hidden font-bold mr-1">Price:</span>
                  <span className="text-sm font-semibold text-dark font-sans">
                    ${parseFloat(item.product?.price || 0).toFixed(2)}
                  </span>
                </div>

                {/* Quantity Selector Column */}
                <div className="col-span-2 flex justify-start md:justify-center">
                  <div className="flex items-center border border-gray-200 rounded-lg bg-white h-9 px-1">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                      className="p-1 hover:text-primary transition-colors focus:outline-none"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-dark">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity, 1, item.product?.stock)}
                      className="p-1 hover:text-primary transition-colors focus:outline-none"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Subtotal Column */}
                <div className="col-span-2 text-left md:text-right">
                  <span className="text-xs text-gray-400 md:hidden font-bold mr-1">Subtotal:</span>
                  <span className="text-sm font-bold text-primary font-spartan">
                    ${parseFloat(item.subTotal || (item.product?.price * item.quantity)).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary Panel */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 self-start shadow-sm">
          <h3 className="text-lg font-bold text-dark font-spartan mb-6 pb-4 border-b border-gray-150">
            Order Summary
          </h3>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span className="font-semibold text-dark">${parseFloat(cart.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Delivery Charge</span>
              <span className="font-semibold text-dark">
                {cart.deliveryCharge === 0 ? 'FREE' : `$${parseFloat(cart.deliveryCharge).toFixed(2)}`}
              </span>
            </div>
            
            <div className="border-t border-gray-150 pt-4 flex justify-between text-base font-bold text-dark font-spartan">
              <span>Total Amount</span>
              <span className="text-primary text-lg">${parseFloat(cart.totalAmount).toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full h-12 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-lg shadow-primary/10"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
