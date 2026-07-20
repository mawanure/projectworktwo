import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';
import { resolveImageUrl, formatPrice } from '../utils/imageUtils';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { isProductInWishlist, addToWishlist, wishlist, removeFromWishlist } = useWishlist();
  const { addItemToCart } = useCart();

  const inWishlist = isProductInWishlist(product.id);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      // Find item ID in wishlist to delete it
      const wishlistItem = wishlist.items.find(item => item.product?.id === product.id);
      if (wishlistItem) {
        await removeFromWishlist(wishlistItem.id);
      }
    } else {
      await addToWishlist(product.id);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Default size to "M" or first available size option if listed
    const sizeOptions = product.sizes ? product.sizes.split(',') : ['M'];
    const defaultSize = sizeOptions[0].trim();
    
    const success = await addItemToCart(product.id, defaultSize, 1);
    if (success) {
      toast.success(`${product.name} added to cart!`);
    }
  };

  // Safe image URL lookup
  const primaryImageUrl = resolveImageUrl(product.primaryImageUrl);

  return (
    <div 
      onClick={() => navigate(`/products/${product.id}`)}
      className="group relative flex flex-col bg-white border border-gray-100 rounded-2xl p-4 hover-lift cursor-pointer select-none"
    >
      {/* Product Image */}
      <div className="aspect-square w-full rounded-xl overflow-hidden bg-gray-50 relative mb-4">
        <img
          src={primaryImageUrl}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/products/f1.jpg';
          }}
        />
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-gray-600 hover:text-red-500 rounded-full shadow-sm hover:scale-110 transition-all focus:outline-none"
        >
          <Heart 
            className={`h-4 w-4 transition-colors ${
              inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-500'
            }`} 
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="flex-grow flex flex-col">
        <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-1">
          {product.category?.name || 'Fashion'}
        </span>
        <h3 className="text-sm font-semibold text-dark line-clamp-2 min-h-[40px] mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${
                i < Math.floor(product.rating || 5)
                  ? 'fill-accent-yellow text-accent-yellow'
                  : 'text-gray-250'
              }`}
            />
          ))}
          <span className="text-xs text-gray-400 ml-1 font-medium">({product.rating || '5.0'})</span>
        </div>

        {/* Price & Add to Cart */}
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-50">
          <div>
            <span className="text-base font-bold text-primary font-spartan">
              {formatPrice(product.price)}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            className="p-2.5 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-full transition-colors duration-250 focus:outline-none"
            title="Add to Cart"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
