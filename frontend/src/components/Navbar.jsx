import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Menu, 
  X, 
  LogOut, 
  LayoutDashboard, 
  History 
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const { wishlist } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 glass-nav h-16 sm:h-20 w-full flex items-center justify-between px-4 sm:px-6 md:px-16 transition-all duration-300">
      {/* Logo */}
      <Link to="/" className="flex items-center shrink-0">
        <img src="/images/logo.png" alt="CozyCart logo" className="h-8 sm:h-10 md:h-12 object-contain" />
      </Link>

      {/* Desktop Navigation Links */}
      <nav className="hidden md:flex items-center space-x-8">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `text-[15px] font-semibold tracking-wide transition-colors duration-200 hover:text-primary ${
                isActive ? 'text-primary' : 'text-dark'
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>

      {/* Actions */}
      <div className="flex items-center space-x-1 sm:space-x-3 md:space-x-6">
        {/* Wishlist Link */}
        <Link 
          to="/wishlist" 
          className="relative p-2 text-dark hover:text-primary transition-colors duration-200"
          title="Wishlist"
        >
          <Heart className="h-5 w-5" />
          {wishlist.items?.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
              {wishlist.items.length}
            </span>
          )}
        </Link>

        {/* Cart Link */}
        <Link 
          to="/cart" 
          className="relative p-2 text-dark hover:text-primary transition-colors duration-200"
          title="Cart"
        >
          <ShoppingBag className="h-5 w-5" />
          {getCartCount() > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
              {getCartCount()}
            </span>
          )}
        </Link>

        {/* Profile — only show on desktop */}
        <div className="relative hidden md:block">
          {isAuthenticated ? (
            <div>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-1 p-2 text-dark hover:text-primary transition-colors duration-200 focus:outline-none"
                title="Account"
              >
                <User className="h-5 w-5 md:h-6 md:w-6" />
                <span className="hidden lg:inline text-sm font-medium max-w-[100px] truncate">
                  {user.name.split(' ')[0]}
                </span>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-xl border border-gray-100 bg-white p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-400">Signed in as</p>
                    <p className="text-sm font-semibold truncate text-dark">{user.email}</p>
                    <p className="text-[10px] inline-block px-2 py-0.5 mt-1 rounded bg-primary/10 text-primary font-bold">
                      {user.role}
                    </p>
                  </div>
                  
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center space-x-2 rounded-lg px-4 py-2 text-sm text-dark hover:bg-gray-50 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4 text-primary" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}

                  <Link
                    to="/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center space-x-2 rounded-lg px-4 py-2 text-sm text-dark hover:bg-gray-50 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    to="/orders"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center space-x-2 rounded-lg px-4 py-2 text-sm text-dark hover:bg-gray-50 transition-colors"
                  >
                    <History className="h-4 w-4" />
                    <span>My Orders</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center space-x-2 rounded-lg px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center space-x-1 p-2 text-dark hover:text-primary transition-colors duration-200"
              title="Login / Register"
            >
              <User className="h-5 w-5 md:h-6 md:w-6" />
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-dark hover:text-primary transition-colors duration-200 md:hidden"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer with backdrop */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-16 sm:top-20 bg-black/30 md:hidden z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute top-16 sm:top-20 left-0 w-full bg-white border-b border-gray-100 shadow-xl px-5 py-4 md:hidden flex flex-col animate-in slide-in-from-top duration-200 z-50">
            {/* Nav Links */}
            <div className="flex flex-col">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-base font-semibold transition-colors py-3 border-b border-gray-100 last:border-0 ${
                      isActive ? 'text-primary' : 'text-dark'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
            
            {/* Account section */}
            {isAuthenticated ? (
              <div className="pt-4 mt-2 border-t border-gray-100 flex flex-col space-y-1">
                <p className="text-xs text-gray-400 mb-1">Signed in as <span className="font-semibold text-dark">{user.name}</span></p>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 py-2.5 text-sm font-semibold text-dark hover:text-primary transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>My Profile</span>
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 py-2.5 text-sm font-semibold text-dark hover:text-primary transition-colors"
                >
                  <History className="h-4 w-4" />
                  <span>My Orders</span>
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 py-2.5 text-sm font-semibold text-primary"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="flex items-center space-x-3 py-2.5 text-sm font-semibold text-red-600 text-left mt-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="pt-4 mt-2 border-t border-gray-100">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center bg-primary text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-primary-hover transition-colors"
                >
                  Sign In / Register
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;
