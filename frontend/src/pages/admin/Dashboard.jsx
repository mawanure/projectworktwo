import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/apiClient';
import { 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  RefreshCw 
} from 'lucide-react';

const Dashboard = () => {
  const { data: stats, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const response = await apiClient.get('/api/admin/dashboard/stats');
      return response.data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-xl border border-red-200">
        <h3 className="font-bold text-lg">Error loading statistics</h3>
        <p className="text-sm mt-1">{error.message || 'Please check your connection and try again.'}</p>
        <button 
          onClick={() => refetch()} 
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition"
        >
          Retry
        </button>
      </div>
    );
  }

  const formatRevenue = (value) => {
    if (!value) return '$0.00';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatRevenue(stats.totalRevenue),
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      subtitle: `${stats.todayOrders} orders today`,
      icon: ShoppingBag,
      color: 'from-blue-500 to-indigo-600',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Customers',
      value: stats.totalCustomers,
      subtitle: `${stats.totalAdmins} admin accounts`,
      icon: Users,
      color: 'from-violet-500 to-purple-600',
      textColor: 'text-violet-600',
      bgColor: 'bg-violet-50',
    },
    {
      title: 'Low Stock Products',
      value: stats.lowStockProducts,
      subtitle: `${stats.outOfStockProducts} out of stock`,
      icon: AlertTriangle,
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
  ];

  return (
    <div className="space-y-8 select-none">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold font-spartan text-dark">Dashboard Overview</h2>
          <p className="text-sm text-neutral-400">Real-time store metrics, inventory warnings, and order status summaries.</p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-neutral-700 text-sm font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          <span>{isFetching ? 'Refreshing...' : 'Refresh Stats'}</span>
        </button>
      </div>

      {/* Primary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm hover:shadow-md transition duration-250 flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">{card.title}</span>
              <h3 className="text-3xl font-bold text-dark font-spartan">{card.value}</h3>
              {card.subtitle && <p className="text-xs text-neutral-400 font-medium">{card.subtitle}</p>}
            </div>
            <div className={`p-4 rounded-xl ${card.bgColor} ${card.textColor}`}>
              <card.icon className="h-6 w-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Status Summary */}
        <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm lg:col-span-2 space-y-6">
          <div>
            <h3 className="text-lg font-bold font-spartan text-dark">Order Status Summary</h3>
            <p className="text-xs text-neutral-400">Status division for all order checkouts.</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-yellow-50/50 border border-yellow-100 rounded-xl flex flex-col items-center justify-center text-center">
              <Clock className="h-6 w-6 text-yellow-600 mb-2" />
              <span className="text-xl font-bold font-spartan text-yellow-700">{stats.pendingOrders}</span>
              <span className="text-xs font-semibold text-yellow-600 mt-1 uppercase tracking-wider">Pending</span>
            </div>
            
            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl flex flex-col items-center justify-center text-center">
              <RefreshCw className="h-6 w-6 text-blue-600 mb-2" />
              <span className="text-xl font-bold font-spartan text-blue-700">{stats.processingOrders}</span>
              <span className="text-xs font-semibold text-blue-600 mt-1 uppercase tracking-wider">Processing</span>
            </div>

            <div className="p-4 bg-green-50/50 border border-green-100 rounded-xl flex flex-col items-center justify-center text-center">
              <CheckCircle className="h-6 w-6 text-green-600 mb-2" />
              <span className="text-xl font-bold font-spartan text-green-700">{stats.deliveredOrders}</span>
              <span className="text-xs font-semibold text-green-600 mt-1 uppercase tracking-wider">Delivered</span>
            </div>

            <div className="p-4 bg-red-50/50 border border-red-100 rounded-xl flex flex-col items-center justify-center text-center">
              <XCircle className="h-6 w-6 text-red-600 mb-2" />
              <span className="text-xl font-bold font-spartan text-red-700">{stats.cancelledOrders}</span>
              <span className="text-xs font-semibold text-red-600 mt-1 uppercase tracking-wider">Cancelled</span>
            </div>
          </div>
        </div>

        {/* Inventory Warning Card */}
        <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold font-spartan text-dark">Stock Warnings</h3>
              <p className="text-xs text-neutral-400">Products requiring attention due to low inventory levels.</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-red-50/60 rounded-xl border border-red-100">
                <div className="flex items-center space-x-3">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span className="text-sm font-semibold text-red-700">Out of Stock</span>
                </div>
                <span className="text-sm font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-md font-spartan">
                  {stats.outOfStockProducts} items
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-amber-50/60 rounded-xl border border-amber-100">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <span className="text-sm font-semibold text-amber-700">Low Stock Limit</span>
                </div>
                <span className="text-sm font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md font-spartan">
                  {stats.lowStockProducts} items
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 mt-6 flex justify-between items-center text-xs text-neutral-400">
            <span>Total Catalog Products:</span>
            <span className="font-bold text-dark text-sm font-spartan">{stats.totalProducts}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
