import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';
import { Check, Trash2, Mail, MailOpen } from 'lucide-react';

const Messages = () => {
  const queryClient = useQueryClient();

  // Fetch Contact Messages
  const { data: messages, isLoading } = useQuery({
    queryKey: ['admin', 'messages'],
    queryFn: async () => {
      const response = await apiClient.get('/api/admin/contact-messages');
      return response.data;
    },
  });

  // Mutation: Mark message read
  const readMutation = useMutation({
    mutationFn: async (id) => {
      return (await apiClient.patch(`/api/admin/contact-messages/${id}/read`)).data;
    },
    onSuccess: () => {
      toast.success('Message marked as read');
      queryClient.invalidateQueries({ queryKey: ['admin', 'messages'] });
    },
  });

  // Mutation: Delete message
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/api/admin/contact-messages/${id}`);
    },
    onSuccess: () => {
      toast.success('Message deleted');
      queryClient.invalidateQueries({ queryKey: ['admin', 'messages'] });
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
        <h2 className="text-2xl font-bold font-spartan text-dark">Support Messages</h2>
        <p className="text-sm text-neutral-400">Review tickets and contact forms submitted by customers.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 text-left">
        {messages?.map((msg) => (
          <div 
            key={msg.id} 
            className={`p-6 rounded-2xl border transition shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white ${
              msg.read ? 'border-gray-150 opacity-75' : 'border-primary/20 bg-primary/5'
            }`}
          >
            <div className="space-y-2 flex-grow">
              <div className="flex items-center space-x-2.5">
                <span className="font-bold text-dark text-base">{msg.name}</span>
                <span className="text-xs text-neutral-400 font-semibold">• {msg.emailOrPhone}</span>
                <span className="text-xs text-neutral-400 font-semibold">• {new Date(msg.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-sm text-neutral-700 font-medium whitespace-pre-wrap">{msg.message}</p>
            </div>

            <div className="flex items-center space-x-2 self-end md:self-auto shrink-0">
              {!msg.read && (
                <button
                  onClick={() => readMutation.mutate(msg.id)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/25 text-primary text-xs font-bold rounded-lg transition"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Mark Read</span>
                </button>
              )}
              <button
                onClick={() => { if(confirm('Delete message?')) deleteMutation.mutate(msg.id); }}
                className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                title="Delete Message"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {messages?.length === 0 && (
          <div className="text-center p-12 bg-white rounded-2xl border border-gray-150 text-neutral-400 font-medium">
            No support messages in your inbox.
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
