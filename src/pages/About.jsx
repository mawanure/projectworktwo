import React from 'react';
import { Sparkles, Users, Award, ShieldAlert } from 'lucide-react';

const About = () => {
  return (
    <div className="w-full">
      {/* Page Header */}
      <section 
        className="relative bg-[url('/images/banner/b1.jpg')] bg-cover bg-center h-[25vh] w-full flex flex-col justify-center items-center text-center px-4 select-none mb-16"
      >
        <h2 className="text-white text-4xl font-extrabold font-spartan tracking-wide">#KnowUs</h2>
        <p className="text-gray-200 text-sm mt-1">Discover the story behind Stay Home</p>
      </section>

      {/* Main content grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
        <div className="rounded-2xl overflow-hidden shadow-md">
          <img src="/images/banner/a6.jpg" alt="About Stay Home" className="w-full h-auto object-cover" />
        </div>
        <div className="space-y-6">
          <span className="text-xs text-primary font-bold uppercase tracking-wider block">Who We Are</span>
          <h2 className="text-3xl font-bold font-spartan text-dark">We Are Stay Home Fashion</h2>
          <p className="text-sm text-gray-500 leading-relaxed font-sans">
            Stay Home is a premium fashion brand dedicated to bringing high-quality clothing and accessories to your doorstep. We believe that great style shouldn't require leaving the comfort of your home.
          </p>
          <p className="text-sm text-gray-500 leading-relaxed font-sans">
            Our curated collections blend timeless classics with modern trends, ensuring you always have something perfect to wear for every occasion — from casual weekends to formal events.
          </p>
          
          <div className="border-l-4 border-primary pl-4 py-2 italic text-sm text-gray-600 bg-gray-50 rounded-r-lg">
            "Create stunning fashion experiences with as much style and comfort as you like."
          </div>

          {/* Stats metrics */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-150">
            <div className="text-center">
              <h3 className="text-3xl font-extrabold text-primary font-spartan">5K+</h3>
              <p className="text-xs text-gray-400 font-semibold mt-1 uppercase">Happy Customers</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-extrabold text-primary font-spartan">200+</h3>
              <p className="text-xs text-gray-400 font-semibold mt-1 uppercase">Products</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-extrabold text-primary font-spartan">50+</h3>
              <p className="text-xs text-gray-400 font-semibold mt-1 uppercase">Brands</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Ribbon */}
      <section className="bg-gray-50 py-16 px-6 md:px-12 border-y border-gray-100 mb-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-4">
            <div className="p-4 bg-primary/10 rounded-full text-primary mb-4">
              <Users className="h-6 w-6" />
            </div>
            <h4 className="font-bold text-dark mb-2">Dedicated Community</h4>
            <p className="text-xs text-gray-500 max-w-xs font-sans">We prioritize our community support, ensuring your needs are fully satisfied.</p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="p-4 bg-primary/10 rounded-full text-primary mb-4">
              <Award className="h-6 w-6" />
            </div>
            <h4 className="font-bold text-dark mb-2">Premium Materials</h4>
            <p className="text-xs text-gray-500 max-w-xs font-sans">Every garment is manufactured with 100% premium cotton ensuring durability and comfort.</p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="p-4 bg-primary/10 rounded-full text-primary mb-4">
              <Sparkles className="h-6 w-6" />
            </div>
            <h4 className="font-bold text-dark mb-2">Exclusive Designs</h4>
            <p className="text-xs text-gray-500 max-w-xs font-sans">Our design lab prints exclusive collections that represent personal, trending concepts.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
