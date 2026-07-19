import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import ProductCard from '../components/ProductCard';
import { Star, Heart, ShoppingBag, Plus, Minus, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const { addItemToCart } = useCart();
  const { isProductInWishlist, addToWishlist, removeFromWishlist, wishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');

  // Fetch Product Details
  const { data: product, isLoading: loadingProduct, error: productError } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await apiClient.get(`/api/products/${id}`);
      return response.data;
    },
  });

  // Fetch Related Products
  const { data: relatedProducts, isLoading: loadingRelated } = useQuery({
    queryKey: ['products', 'related', id],
    queryFn: async () => {
      const response = await apiClient.get(`/api/products/${id}/related`);
      return response.data;
    },
    enabled: !!product, // Only query once product details are fetched
  });

  // Initialize selected size and active main image when product loads
  useEffect(() => {
    if (product) {
      if (product.sizes) {
        const sizesArr = product.sizes.split(',');
        setSelectedSize(sizesArr[0]?.trim() || 'M');
      } else {
        setSelectedSize('M');
      }

      if (product.imageUrls && product.imageUrls.length > 0) {
        setActiveImage(product.imageUrls[0]);
      } else {
        setActiveImage('images/products/f1.jpg');
      }
      
      // Reset quantity
      setQuantity(1);
    }
  }, [product]);

  if (loadingProduct) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-dark font-spartan">Product Not Found</h2>
        <p className="text-gray-500 mt-1">The product you are trying to view does not exist or has been removed.</p>
        <Link to="/shop" className="mt-6 bg-primary text-white px-6 py-2.5 rounded-lg font-semibold">
          Back to Shop
        </Link>
      </div>
    );
  }

  const inWishlist = isProductInWishlist(product.id);
  const sizeOptions = product.sizes ? product.sizes.split(',').map(s => s.trim()) : ['M'];
  const gallery = product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : ['images/products/f1.jpg'];

  const handleWishlistToggle = async () => {
    if (inWishlist) {
      const item = wishlist.items.find(w => w.product?.id === product.id);
      if (item) {
        await removeFromWishlist(item.id);
      }
    } else {
      await addToWishlist(product.id);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error('Please select a size first.');
      return;
    }
    const success = await addItemToCart(product.id, selectedSize, quantity);
    if (success) {
      // Notification handled in context
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
      {/* Back link */}
      <Link to="/shop" className="inline-flex items-center space-x-2 text-sm text-gray-500 hover:text-primary mb-8 font-semibold transition-colors">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Shop</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        {/* Left Side: Images */}
        <div className="flex flex-col space-y-4">
          <div className="aspect-square w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 relative">
            <img
              src={`/${activeImage}`}
              alt={product.name}
              className="h-full w-full object-cover object-center transition-all duration-300"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/products/f1.jpg';
              }}
            />
          </div>

          {/* Thumbnails */}
          {gallery.length > 1 && (
            <div className="flex gap-4 overflow-x-auto py-2">
              {gallery.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(img)}
                  className={`aspect-square w-20 rounded-xl overflow-hidden border-2 shrink-0 bg-gray-50 transition-all ${
                    activeImage === img ? 'border-primary' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={`/${img}`}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="h-full w-full object-cover object-center"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/products/f1.jpg';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Details */}
        <div className="flex flex-col">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">
            {product.category?.name || 'Category'}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold font-spartan text-dark tracking-wide mb-3">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center space-x-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating || 5)
                    ? 'fill-accent-yellow text-accent-yellow'
                    : 'text-gray-250'
                }`}
              />
            ))}
            <span className="text-sm font-semibold text-gray-500 ml-2">({product.rating || '5.0'} Rating)</span>
          </div>

          {/* Price */}
          <div className="bg-gray-50 px-6 py-4 rounded-xl mb-6">
            <span className="text-3xl font-bold text-primary font-spartan">
              ${parseFloat(product.price).toFixed(2)}
            </span>
          </div>

          {/* Availability Status */}
          <div className="flex items-center space-x-2 text-sm mb-6">
            {product.stock > 0 ? (
              <span className="flex items-center space-x-1.5 text-green-600 font-semibold">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <span>In Stock ({product.stock} items remaining)</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1.5 text-red-500 font-semibold">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>Out of Stock</span>
              </span>
            )}
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="font-bold text-dark uppercase tracking-wider text-sm mb-2">Description</h3>
            <p className="text-sm text-gray-500 leading-relaxed font-sans">{product.description || 'No product description available.'}</p>
          </div>

          {/* Size Selector */}
          <div className="mb-6">
            <h3 className="font-bold text-dark uppercase tracking-wider text-sm mb-3">Select Size</h3>
            <div className="flex gap-3">
              {sizeOptions.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`h-10 px-4 text-xs font-bold rounded-lg border transition-all ${
                    selectedSize === size
                      ? 'border-primary bg-primary text-white shadow-sm shadow-primary/20'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector & Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <div className="flex items-center border border-gray-200 rounded-xl bg-white h-12 w-fit px-2 shrink-0">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="p-1.5 hover:text-primary transition-colors focus:outline-none"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-bold text-dark text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity(q => Math.min(product.stock || 99, q + 1))}
                className="p-1.5 hover:text-primary transition-colors focus:outline-none"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="flex-grow h-12 bg-primary hover:bg-primary-hover disabled:bg-gray-200 text-white font-semibold rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-lg shadow-primary/10 disabled:cursor-not-allowed"
            >
              <ShoppingBag className="h-5 w-5" />
              <span>{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
            </button>

            <button
              onClick={handleWishlistToggle}
              className={`p-3 border rounded-xl flex items-center justify-center shrink-0 hover:bg-gray-50 focus:outline-none ${
                inWishlist ? 'border-red-200 text-red-500' : 'border-gray-200 text-gray-500'
              }`}
              title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart className={`h-5 w-5 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Related Products Grid */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="border-t border-gray-100 pt-16">
          <div className="mb-10 text-left">
            <h2 className="text-2xl font-bold font-spartan text-dark tracking-wide">Related Products</h2>
            <p className="text-gray-500 text-sm mt-0.5">Explore additional options in the same category</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
