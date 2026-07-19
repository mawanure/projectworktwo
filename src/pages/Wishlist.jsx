import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { Heart, Trash2, ShoppingCart, ArrowRight, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const { wishlist, loading, removeFromWishlist, clearWishlist } = useWishlist();
  const { addItemToCart } = useCart();

  if (loading && wishlist.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!wishlist.items || wishlist.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="p-6 bg-gray-50 rounded-full text-gray-400 mb-6 scale-110">
          <Heart className="h-16 w-16" />
        </div>
        <h2 className="text-2xl font-bold font-spartan text-dark">Your Wishlist is Empty</h2>
        <p className="text-gray-500 mt-2 max-w-sm">
          Keep track of items you love by adding them to your wishlist. Save them for later purchases!
        </p>
        <Link
          to="/shop"
          className="mt-8 bg-primary hover:bg-primary-hover transition-colors text-white font-semibold px-6 py-3 rounded-lg flex items-center space-x-2"
        >
          <span>Explore Shop</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const handleAddToCart = async (product) => {
    // Default size to "M" or first available option
    const sizeOptions = product.sizes ? product.sizes.split(',') : ['M'];
    const defaultSize = sizeOptions[0].trim();
    
    const success = await addItemToCart(product.id, defaultSize, 1);
    if (success) {
      toast.success(`${product.name} added to cart!`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-bold font-spartan text-dark tracking-wide">My Wishlist</h1>
          <p className="text-sm text-gray-400 mt-1">You have {wishlist.items.length} items saved</p>
        </div>
        <button
          onClick={clearWishlist}
          className="px-4 py-2 border border-red-200 text-red-500 hover:bg-red-50 text-sm font-semibold rounded-xl transition-all focus:outline-none cursor-pointer"
        >
          Clear All Items
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.items.map((item) => {
          const product = item.product;
          if (!product) return null;
          
          return (
            <div
              key={item.id}
              className="group flex flex-col bg-white border border-gray-100 rounded-2xl p-4 hover-lift relative"
            >
              {/* Product Image */}
              <div className="aspect-square w-full rounded-xl overflow-hidden bg-gray-50 relative mb-4">
                <Link to={`/products/${product.id}`}>
                  <img
                    src={`/${product.primaryImageUrl || 'images/products/f1.jpg'}`}
                    alt={product.name}
                    className="h-full w-full object-cover object-center group-hover:scale-103 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/products/f1.jpg';
                    }}
                  />
                </Link>
                {/* Delete Button */}
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-gray-500 hover:text-red-500 rounded-full shadow-sm hover:scale-110 transition-all focus:outline-none"
                  title="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Product Info */}
              <div className="flex-grow flex flex-col">
                <h3 className="text-sm font-semibold text-dark line-clamp-2 min-h-[40px] mb-2 hover:text-primary transition-colors">
                  <Link to={`/products/${product.id}`}>{product.name}</Link>
                </h3>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className="text-base font-bold text-primary font-spartan">
                    ${parseFloat(product.price).toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex items-center space-x-1.5 px-3 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
