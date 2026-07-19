import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const Categories = () => {
  const queryClient = useQueryClient();
  const [editingCategory, setEditingCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  // Fetch Categories
  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: async () => {
      const response = await apiClient.get('/api/categories');
      return response.data;
    },
  });

  // Mutation: Create Category
  const createMutation = useMutation({
    mutationFn: async (data) => {
      return (await apiClient.post('/api/admin/categories', data)).data;
    },
    onSuccess: () => {
      toast.success('Category created successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create category');
    },
  });

  // Mutation: Update Category
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      return (await apiClient.put(`/api/admin/categories/${id}`, data)).data;
    },
    onSuccess: () => {
      toast.success('Category updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      setIsModalOpen(false);
      setEditingCategory(null);
      resetForm();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update category');
    },
  });

  // Mutation: Delete Category
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/api/admin/categories/${id}`);
    },
    onSuccess: () => {
      toast.success('Category deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
    },
    onError: (err) => {
      toast.error('Failed to delete category (it may be linked to active products)');
    },
  });

  const resetForm = () => {
    setFormData({ name: '', description: '' });
  };

  const handleEditClick = (cat) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, description: cat.description || '' });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data: formData });
    } else {
      createMutation.mutate(formData);
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-spartan text-dark">Category Directory</h2>
          <p className="text-sm text-neutral-400 font-sans">Manage store catalog groups and filter parameters.</p>
        </div>
        <button
          onClick={() => { resetForm(); setEditingCategory(null); setIsModalOpen(true); }}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-primary-dark transition"
        >
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="bg-white border border-gray-150 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse font-sans">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold uppercase text-neutral-400 tracking-wider">
              <th className="p-4">ID</th>
              <th className="p-4">Category Name</th>
              <th className="p-4">Description</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {categories?.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50/50">
                <td className="p-4 font-semibold text-neutral-500">{cat.id}</td>
                <td className="p-4 font-bold text-dark">{cat.name}</td>
                <td className="p-4 text-neutral-400 max-w-xs truncate">{cat.description || 'No description provided'}</td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => handleEditClick(cat)}
                    className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => { if (confirm('Are you sure you want to delete this category?')) deleteMutation.mutate(cat.id); }}
                    className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100">
            <h3 className="text-lg font-bold font-spartan text-dark mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 text-left font-sans">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1 uppercase tracking-wider">Category Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
                  placeholder="e.g. T-Shirts"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1 uppercase tracking-wider">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary focus:outline-none h-24"
                  placeholder="Describe category and catalog groups..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-neutral-700 text-sm font-semibold rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-primary-dark transition"
                >
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
