import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import ProductCard from '../components/ProductCard';
import { Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

const Shop = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState('default'); // client-side sorting helpers: 'default', 'price-low-high', 'price-high-low'

  const pageSize = 8;

  // Fetch Categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await apiClient.get('/api/categories');
      return response.data;
    },
  });

  // Fetch Products with pagination, search, category filters
  const { data: productPage, isLoading: loadingProducts } = useQuery({
    queryKey: ['products', page, selectedCategory, search],
    queryFn: async () => {
      const params = {
        page,
        size: pageSize,
      };
      if (selectedCategory) {
        params.categoryId = selectedCategory;
      }
      if (search) {
        params.search = search;
      }
      const response = await apiClient.get('/api/products', { params });
      return response.data;
    },
  });

  // Client-side sorting logic since backend does not expose sorting
  const getSortedProducts = (products) => {
    if (!products) return [];
    const items = [...products];
    if (sortBy === 'price-low-high') {
      return items.sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-high-low') {
      return items.sort((a, b) => b.price - a.price);
    }
    return items;
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setPage(0); // reset to page 0
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
  };

  const sortedProducts = getSortedProducts(productPage?.content);
  const totalPages = productPage?.totalPages || 0;

  return (
    <div className="section-p1 max-w-7xl mx-auto px-6 md:px-12 py-12">
      {/* Page Title & Banner */}
      <div 
        className="w-full bg-[url('/images/banner/b1.jpg')] bg-cover bg-center h-[20vh] rounded-2xl flex flex-col justify-center items-center text-center px-4 select-none mb-12"
      >
        <h2 className="text-white text-3xl font-extrabold font-spartan tracking-wide">#stayhome</h2>
        <p className="text-gray-200 text-sm mt-1">Save more with coupons & up to 70% off!</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 shrink-0 bg-white border border-gray-100 rounded-2xl p-6 self-start">
          <div className="flex items-center space-x-2 pb-4 border-b border-gray-100 mb-6">
            <Filter className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-dark font-spartan">Categories</h3>
          </div>

          <ul className="space-y-2">
            <li>
              <button
                onClick={() => handleCategorySelect(null)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  selectedCategory === null
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                All Products
              </button>
            </li>
            {categories?.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Catalog Main Panel */}
        <div className="flex-grow flex flex-col">
          {/* Header Controls: Search & Sort */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8 bg-white p-4 border border-gray-100 rounded-2xl">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-xs flex items-center">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-gray-50"
              />
              <Search className="absolute left-3 h-4 w-4 text-gray-400" />
            </form>

            {/* Sorting Dropdown */}
            <div className="flex items-center space-x-2 w-full sm:w-auto shrink-0 justify-end">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none bg-white font-semibold text-gray-600 focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="default">Newest</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {loadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 flex-grow">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white border border-gray-100 rounded-2xl p-4 h-[350px]"></div>
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-16 bg-white border border-gray-100 rounded-2xl min-h-[300px]">
              <span className="text-4xl">🔎</span>
              <h3 className="text-lg font-bold text-dark mt-4 font-spartan">No Products Found</h3>
              <p className="text-sm text-gray-400 mt-1 max-w-sm">
                We couldn't find any products matching your selection. Try clearing filters or altering search keywords.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-12 bg-white px-4 py-3 border border-gray-100 rounded-2xl w-fit mx-auto select-none">
              <button
                onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                disabled={page === 0}
                className="p-2 border border-gray-150 rounded-xl hover:bg-gray-50 text-gray-500 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`h-9 w-9 text-sm font-semibold rounded-xl transition-all ${
                    page === i
                      ? 'bg-primary text-white shadow-sm'
                      : 'border border-gray-150 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setPage((prev) => Math.min(totalPages - 1, prev + 1))}
                disabled={page === totalPages - 1}
                className="p-2 border border-gray-150 rounded-xl hover:bg-gray-50 text-gray-500 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
