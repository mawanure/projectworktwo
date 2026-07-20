import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import ProductCard from '../components/ProductCard';
import { ArrowRight, ShoppingBag, Truck, BadgePercent, Sparkles, Smile, ShieldCheck, HeartHandshake } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  // Fetch Featured Products
  const { data: featuredProducts, isLoading: loadingFeatured } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const response = await apiClient.get('/api/products/featured');
      return response.data;
    },
  });

  // Fetch New Arrivals
  const { data: newArrivals, isLoading: loadingNew } = useQuery({
    queryKey: ['products', 'new-arrivals'],
    queryFn: async () => {
      const response = await apiClient.get('/api/products/new-arrivals');
      return response.data;
    },
  });

  const features = [
    { name: 'Free Shipping', icon: Truck, bg: 'bg-blue-50 text-blue-600' },
    { name: 'Online Order', icon: ShoppingBag, bg: 'bg-green-50 text-green-600' },
    { name: 'Save Money', icon: BadgePercent, bg: 'bg-yellow-50 text-yellow-600' },
    { name: 'Promotions', icon: Sparkles, bg: 'bg-purple-50 text-purple-600' },
    { name: 'Happy Sell', icon: Smile, bg: 'bg-pink-50 text-pink-600' },
    { name: '24/7 Support', icon: ShieldCheck, bg: 'bg-teal-50 text-teal-600' },
  ];

  return (
    <div className="w-full">
      {/* Hero Banner Section */}
      <section 
        className="relative bg-[url('/images/hero4.png')] bg-cover bg-center min-h-[75vh] md:h-[80vh] w-full flex flex-col justify-center px-5 sm:px-8 md:px-20 select-none animate-in fade-in duration-500 overflow-hidden"
      >
        <div className="max-w-xl flex flex-col items-start space-y-3 sm:space-y-4">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>New Season 2026</span>
          </div>
          <h4 className="text-base sm:text-xl md:text-2xl font-bold text-dark font-spartan">Trade-in-offer</h4>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-dark tracking-tight leading-tight font-spartan">
            Super Value Deals
          </h2>
          <h1 className="text-primary text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-tight font-spartan">
            On All Products
          </h1>
          <p className="text-gray-600 text-sm md:text-base max-w-sm font-sans leading-relaxed">
            Save more with coupons &amp; up to 70% off on all clothing items!
          </p>
          <div className="flex flex-row flex-wrap gap-3 pt-2">
            <button
              onClick={() => navigate('/shop')}
              className="bg-primary hover:bg-primary-hover transition-colors text-white font-semibold px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl flex items-center space-x-2 shadow-lg shadow-primary/25 cursor-pointer text-sm sm:text-base"
            >
              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Shop Now</span>
            </button>
            <button
              onClick={() => navigate('/about')}
              className="bg-white hover:bg-gray-50 border border-gray-200 transition-colors text-dark font-semibold px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl flex items-center space-x-2 cursor-pointer text-sm sm:text-base"
            >
              <span>Learn More</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Ribbon */}
      <section className="section-p1 bg-white grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 justify-center">
        {features.map((fe, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-4 sm:p-6 border border-gray-100 rounded-2xl hover:shadow-md transition-shadow duration-200"
          >
            <div className={`p-3 sm:p-4 rounded-full ${fe.bg} mb-3 sm:mb-4`}>
              <fe.icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h6 className="text-xs sm:text-sm font-semibold text-dark tracking-wide text-center">{fe.name}</h6>
          </div>
        ))}
      </section>

      {/* Featured Products Catalog */}
      <section className="section-p1 bg-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-spartan text-dark tracking-wide">Featured Products</h2>
          <p className="text-gray-500 text-sm mt-1">Handpicked summer collection with modern designs</p>
          <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
        </div>

        {loadingFeatured ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white border border-gray-100 rounded-2xl p-4 h-[350px]"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Dynamic Mid Banner */}
      <section 
        className="bg-[url('/images/banner/b2.jpg')] bg-cover bg-center h-[28vh] sm:h-[35vh] md:h-[40vh] w-full flex flex-col justify-center items-center text-center px-5 select-none my-8 md:my-12"
      >
        <h4 className="text-white text-xs sm:text-sm font-bold tracking-widest uppercase">Repair Services</h4>
        <h2 className="text-white text-xl sm:text-2xl md:text-4xl font-extrabold font-spartan tracking-wide mt-2 max-w-xs sm:max-w-none">
          Up to <span className="text-accent-red">70% Off</span> - All T-Shirts &amp; Accessories
        </h2>
        <button
          onClick={() => navigate('/shop')}
          className="mt-4 sm:mt-6 bg-white hover:bg-gray-100 text-dark font-bold px-5 py-2.5 rounded-lg transition-colors cursor-pointer text-sm"
        >
          Explore More
        </button>
      </section>

      {/* New Arrivals Section */}
      <section className="section-p1 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-spartan text-dark tracking-wide">New Arrivals</h2>
          <p className="text-gray-500 text-sm mt-1">Freshly designed apparel just released this week</p>
          <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
        </div>

        {loadingNew ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white border border-gray-100 rounded-2xl p-4 h-[350px]"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newArrivals?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Promotion Split Banners */}
      <section className="section-p1 grid grid-cols-1 md:grid-cols-2 gap-6 my-12 px-6 md:px-16">
        <div 
          className="bg-[url('/images/banner/b17.jpg')] bg-cover bg-center h-[300px] rounded-2xl p-8 flex flex-col justify-center items-start text-left select-none text-white hover:shadow-lg transition-shadow duration-300"
        >
          <h4 className="text-sm font-bold tracking-widest uppercase text-gray-300">Crazy Deals</h4>
          <h2 className="text-2xl md:text-3xl font-extrabold font-spartan mt-1">Buy 1 Get 1 Free</h2>
          <p className="text-sm text-gray-200 mt-2 max-w-xs">
            The best classic dress is on sale at CozyCart.
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="mt-4 bg-transparent hover:bg-white text-white hover:text-dark border border-white font-bold px-4 py-2 rounded transition-colors cursor-pointer text-xs"
          >
            Learn More
          </button>
        </div>
        <div 
          className="bg-[url('/images/banner/b10.jpg')] bg-cover bg-center h-[300px] rounded-2xl p-8 flex flex-col justify-center items-start text-left select-none text-white hover:shadow-lg transition-shadow duration-300"
        >
          <h4 className="text-sm font-bold tracking-widest uppercase text-gray-300">Spring/Summer</h4>
          <h2 className="text-2xl md:text-3xl font-extrabold font-spartan mt-1">Upcoming Season</h2>
          <p className="text-sm text-gray-200 mt-2 max-w-xs">
            Check out our new arrivals for upcoming summer holidays.
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="mt-4 bg-transparent hover:bg-white text-white hover:text-dark border border-white font-bold px-4 py-2 rounded transition-colors cursor-pointer text-xs"
          >
            Collection
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
