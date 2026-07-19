import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import apiClient from '../../api/apiClient';

const Payments = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const queryClient = useQueryClient();

  // Fetch Payments
  const { data: payments, isLoading } = useQuery({
    queryKey: ['admin', 'payments', statusFilter, methodFilter],
    queryFn: async () => {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (methodFilter) params.method = methodFilter;
      const response = await apiClient.get('/api/admin/payments', { params });
      return response.data;
    },
  });

  // Mutation: Update Payment Status
  const updatePaymentStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      return (await apiClient.put(`/api/admin/payments/${id}/status`, { status })).data;
    },
    onSuccess: () => {
      toast.success('Payment status updated');
      queryClient.invalidateQueries({ queryKey: ['admin', 'payments'] });
    },
    onError: () => {
      toast.error('Failed to update payment status');
    },
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID': return 'bg-green-50 text-green-600 border-green-100';
      case 'UNPAID': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      case 'FAILED': return 'bg-red-50 text-red-600 border-red-100';
      case 'REFUNDED': return 'bg-purple-50 text-purple-600 border-purple-100';
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
        <h2 className="text-2xl font-bold font-spartan text-dark">Transaction Registry</h2>
        <p className="text-sm text-neutral-400">View and track customer transactions, gateway outputs, and refunds.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 font-sans">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white w-full sm:w-48"
        >
          <option value="">All Payment Statuses</option>
          <option value="UNPAID">Unpaid</option>
          <option value="PAID">Paid</option>
          <option value="FAILED">Failed</option>
          <option value="REFUNDED">Refunded</option>
        </select>

        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white w-full sm:w-48"
        >
          <option value="">All Payment Methods</option>
          <option value="COD">Cash on Delivery (COD)</option>
          <option value="CREDIT_CARD">Credit Card</option>
          <option value="DEBIT_CARD">Debit Card</option>
          <option value="MOBILE_BANKING">Mobile Banking</option>
          <option value="ONLINE_TRANSFER">Online Transfer</option>
        </select>
      </div>

      {/* Payments Table */}
      <div className="bg-white border border-gray-150 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse font-sans">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold uppercase text-neutral-400 tracking-wider">
              <th className="p-4">Payment ID</th>
              <th className="p-4">Order ID</th>
              <th className="p-4">Transaction ID</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Method</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {payments?.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50/50">
                <td className="p-4 font-bold text-dark">#{payment.id}</td>
                <td className="p-4 font-semibold text-neutral-500">#{payment.orderId}</td>
                <td className="p-4 font-mono text-xs text-neutral-600">{payment.transactionId || 'N/A'}</td>
                <td className="p-4 font-bold text-dark">${parseFloat(payment.amount).toFixed(2)}</td>
                <td className="p-4 font-medium text-neutral-700">{payment.paymentMethod}</td>
                <td className="p-4 text-neutral-400">
                  {payment.paidAt ? new Date(payment.paidAt).toLocaleString() : 'Not Paid'}
                </td>
                <td className="p-4">
                  <select
                    value={payment.paymentStatus}
                    onChange={(e) => updatePaymentStatusMutation.mutate({ id: payment.id, status: e.target.value })}
                    className={`px-2 py-1 text-xs font-bold rounded-lg border focus:outline-none focus:ring-1 focus:ring-primary bg-white cursor-pointer ${getStatusColor(payment.paymentStatus)}`}
                  >
                    <option value="UNPAID">UNPAID</option>
                    <option value="PAID">PAID</option>
                    <option value="FAILED">FAILED</option>
                    <option value="REFUNDED">REFUNDED</option>
                  </select>
                </td>
              </tr>
            ))}
            {payments?.length === 0 && (
              <tr>
                <td colSpan="7" className="p-8 text-center text-neutral-400 font-medium">
                  No payment records matching the selected parameters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;
