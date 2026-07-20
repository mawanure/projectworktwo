import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

const Newsletter = () => {
  const queryClient = useQueryClient();

  // Fetch Newsletter Subscribers
  const { data: subscribers, isLoading } = useQuery({
    queryKey: ['admin', 'subscribers'],
    queryFn: async () => {
      const response = await apiClient.get('/api/admin/newsletter-subscribers');
      return response.data;
    },
  });

  // Mutation: Delete subscriber
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/api/admin/newsletter-subscribers/${id}`);
    },
    onSuccess: () => {
      toast.success('Subscriber deleted');
      queryClient.invalidateQueries({ queryKey: ['admin', 'subscribers'] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h2 className="text-2xl font-bold font-spartan text-dark">Newsletter Subscriptions</h2>
        <p className="text-sm text-neutral-400">View and manage email addresses registered for product release alerts and promotions.</p>
      </div>

      <div className="bg-white border border-gray-150 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold uppercase text-neutral-400 tracking-wider">
              <th className="p-4">ID</th>
              <th className="p-4">Subscriber Email</th>
              <th className="p-4">Subscribed At</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {subscribers?.map((sub) => (
              <tr key={sub.id} className="hover:bg-gray-50/50">
                <td className="p-4 font-bold text-neutral-500">#{sub.id}</td>
                <td className="p-4 font-semibold text-dark">{sub.email}</td>
                <td className="p-4 text-neutral-400">{new Date(sub.subscribedAt).toLocaleString()}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => { if(confirm('Remove this email from subscriptions?')) deleteMutation.mutate(sub.id); }}
                    className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                    title="Remove Subscriber"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {subscribers?.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-neutral-400 font-medium">
                  No subscribers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Newsletter;
