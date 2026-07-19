import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';
import { Eye, Edit } from 'lucide-react';

const Orders = () => {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch Orders
  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin', 'orders', statusFilter, searchQuery],
    queryFn: async () => {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (searchQuery) params.search = searchQuery;
      const response = await apiClient.get('/api/admin/orders', { params });
      return response.data;
    },
  });

  // Mutation: Update Order Status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, paymentStatus }) => {
      return (await apiClient.put(`/api/admin/orders/${id}/status`, { status, paymentStatus })).data;
    },
    onSuccess: (data) => {
      toast.success('Order status updated');
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      // Update selected order detail view if open
      if (selectedOrder && selectedOrder.id === data.id) {
        setSelectedOrder(data);
      }
    },
    onError: (err) => {
      toast.error('Failed to update status');
    },
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      case 'CONFIRMED': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'PROCESSING': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'SHIPPED': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'DELIVERED': return 'bg-green-50 text-green-600 border-green-100';
      case 'CANCELLED': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-spartan text-dark">Order Bookings</h2>
        <p className="text-sm text-neutral-400">Manage orders, update fulfilment states, and review delivery routes.</p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between font-sans">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Search by customer name, order ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary w-full sm:max-w-xs"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gray-150 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse font-sans">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold uppercase text-neutral-400 tracking-wider">
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Date</th>
              <th className="p-4">Total Amount</th>
              <th className="p-4">Payment Method</th>
              <th className="p-4">Fulfillment Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {orders?.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/50">
                <td className="p-4 font-bold text-dark">#{order.id}</td>
                <td className="p-4">
                  <div>
                    <span className="font-semibold text-dark block">{order.user?.name}</span>
                    <span className="text-xs text-neutral-400">{order.phone}</span>
                  </div>
                </td>
                <td className="p-4 text-neutral-500">{new Date(order.orderDate).toLocaleDateString()}</td>
                <td className="p-4 font-bold text-dark">${parseFloat(order.totalAmount).toFixed(2)}</td>
                <td className="p-4 font-medium text-neutral-600">{order.paymentMethod}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => { setSelectedOrder(order); setIsDetailModalOpen(true); }}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-neutral-700 text-xs font-semibold rounded-lg transition"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View / Manage</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details and Status Management Modal */}
      {isDetailModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-gray-100 max-h-[90vh] overflow-y-auto font-sans">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-6">
              <h3 className="text-lg font-bold font-spartan text-dark">
                Order details: #{selectedOrder.id}
              </h3>
              <button 
                onClick={() => setIsDetailModalOpen(false)}
                className="text-neutral-400 hover:text-dark text-xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-6">
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-dark uppercase tracking-wider">Customer Details</h4>
                <p className="text-sm"><span className="font-semibold text-neutral-500">Name:</span> {selectedOrder.user?.name}</p>
                <p className="text-sm"><span className="font-semibold text-neutral-500">Email:</span> {selectedOrder.user?.email}</p>
                <p className="text-sm"><span className="font-semibold text-neutral-500">Phone:</span> {selectedOrder.phone}</p>
                <p className="text-sm"><span className="font-semibold text-neutral-500">Shipping Address:</span> {selectedOrder.shippingAddress}</p>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-sm text-dark uppercase tracking-wider">Status Management</h4>
                
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">Fulfillment Status</label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => updateStatusMutation.mutate({ 
                      id: selectedOrder.id, 
                      status: e.target.value, 
                      paymentStatus: selectedOrder.paymentStatus 
                    })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">Payment Status</label>
                  <select
                    value={selectedOrder.paymentStatus}
                    onChange={(e) => updateStatusMutation.mutate({ 
                      id: selectedOrder.id, 
                      status: selectedOrder.status, 
                      paymentStatus: e.target.value 
                    })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                  >
                    <option value="UNPAID">Unpaid</option>
                    <option value="PAID">Paid</option>
                    <option value="FAILED">Failed</option>
                    <option value="REFUNDED">Refunded</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-4 text-left">
              <h4 className="font-bold text-sm text-dark uppercase tracking-wider">Ordered Items</h4>
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs text-neutral-400 font-semibold uppercase">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3">Size</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Price</th>
                      <th className="p-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedOrder.orderItems?.map((item) => (
                      <tr key={item.id}>
                        <td className="p-3 font-semibold text-dark">{item.product?.name || 'Deleted Product'}</td>
                        <td className="p-3 text-center font-medium text-neutral-500">{item.size}</td>
                        <td className="p-3 text-center">{item.quantity}</td>
                        <td className="p-3 text-right">${parseFloat(item.price).toFixed(2)}</td>
                        <td className="p-3 text-right font-semibold">${(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Order Calculation */}
              <div className="flex justify-end pt-4 border-t border-gray-100 mt-4">
                <div className="w-64 space-y-2 text-sm text-right">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Subtotal:</span>
                    <span className="font-semibold text-dark">${parseFloat(selectedOrder.subtotal).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Delivery Charge:</span>
                    <span className="font-semibold text-dark">${parseFloat(selectedOrder.deliveryCharge).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-bold text-dark font-spartan">
                    <span>Total Amount:</span>
                    <span>${parseFloat(selectedOrder.totalAmount).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-100 mt-6">
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-neutral-700 text-sm font-semibold rounded-lg transition"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
