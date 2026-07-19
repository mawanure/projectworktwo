import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';
import { UserCheck, ShieldAlert, UserPlus, Search } from 'lucide-react';

const Users = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Fetch Users
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin', 'users', searchQuery, roleFilter],
    queryFn: async () => {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (roleFilter) params.role = roleFilter;
      const response = await apiClient.get('/api/admin/users', { params });
      return response.data;
    },
  });

  // Mutation: Block User
  const blockMutation = useMutation({
    mutationFn: async (id) => {
      return (await apiClient.patch(`/api/admin/users/${id}/block`)).data;
    },
    onSuccess: () => {
      toast.success('User blocked successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: () => toast.error('Failed to block user'),
  });

  // Mutation: Unblock User
  const unblockMutation = useMutation({
    mutationFn: async (id) => {
      return (await apiClient.patch(`/api/admin/users/${id}/unblock`)).data;
    },
    onSuccess: () => {
      toast.success('User unblocked successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: () => toast.error('Failed to unblock user'),
  });

  // Mutation: Change User Role
  const changeRoleMutation = useMutation({
    mutationFn: async ({ id, role }) => {
      return (await apiClient.put(`/api/admin/users/${id}/role`, { role })).data;
    },
    onSuccess: (data) => {
      toast.success(`Role updated to ${data.role}`);
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: () => toast.error('Failed to update role'),
  });

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
        <h2 className="text-2xl font-bold font-spartan text-dark">User Management</h2>
        <p className="text-sm text-neutral-400 font-sans">Manage customer credentials, check system logins, block accounts, or allocate administrator roles.</p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between font-sans">
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white w-full sm:w-48"
        >
          <option value="">All Roles</option>
          <option value="CUSTOMER">Customer</option>
          <option value="ADMIN">Admin</option>
        </select>

        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search users by name, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary w-full"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-gray-150 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse font-sans">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold uppercase text-neutral-400 tracking-wider">
              <th className="p-4">ID</th>
              <th className="p-4">User</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Joined Date</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {users?.map((usr) => (
              <tr key={usr.id} className="hover:bg-gray-50/50">
                <td className="p-4 font-bold text-neutral-500">#{usr.id}</td>
                <td className="p-4">
                  <div>
                    <span className="font-semibold text-dark block">{usr.name}</span>
                    <span className="text-xs text-neutral-400">{usr.email}</span>
                  </div>
                </td>
                <td className="p-4 text-neutral-600">{usr.phone || 'N/A'}</td>
                <td className="p-4 text-neutral-400">{new Date(usr.createdAt).toLocaleDateString()}</td>
                <td className="p-4">
                  <select
                    value={usr.role}
                    onChange={(e) => changeRoleMutation.mutate({ id: usr.id, role: e.target.value })}
                    className="px-2.5 py-1 border border-gray-200 rounded text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary bg-white text-neutral-700"
                  >
                    <option value="CUSTOMER">CUSTOMER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td className="p-4">
                  {usr.blocked ? (
                    <span className="inline-flex items-center text-xs bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded">Blocked</span>
                  ) : (
                    <span className="inline-flex items-center text-xs bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded">Active</span>
                  )}
                </td>
                <td className="p-4 text-right">
                  {usr.blocked ? (
                    <button
                      onClick={() => unblockMutation.mutate(usr.id)}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs font-semibold rounded-lg transition"
                    >
                      <UserCheck className="h-3.5 w-3.5" />
                      <span>Unblock</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => { if(confirm('Block this user?')) blockMutation.mutate(usr.id); }}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg transition"
                    >
                      <ShieldAlert className="h-3.5 w-3.5" />
                      <span>Block User</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
