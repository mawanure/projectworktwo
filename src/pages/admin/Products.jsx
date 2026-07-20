import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Eye, EyeOff, Upload, X, ImageIcon } from 'lucide-react';
import { formatPrice } from '../../utils/imageUtils';

const Products = () => {
  const queryClient = useQueryClient();
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStockValues, setNewStockValues] = useState({});
  const [uploadedImages, setUploadedImages] = useState([]); // [{url, preview}]
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    sizes: 'S,M,L,XL,XXL',
    categoryId: '',
    isFeatured: false,
    isNewArrival: false,
    isActive: true,
  });

  // Fetch Categories for dropdown
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await apiClient.get('/api/categories');
      return response.data;
    },
  });

  // Fetch Products (Admin gets all products)
  const { data: products, isLoading } = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: async () => {
      const response = await apiClient.get('/api/admin/products?size=100'); // Load bulk for admin CRUD
      return response.data.content;
    },
  });

  // Mutation: Create Product
  const createProductMutation = useMutation({
    mutationFn: async (data) => {
      return (await apiClient.post('/api/admin/products', data)).data;
    },
    onSuccess: () => {
      toast.success('Product created successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create product');
    },
  });

  // Mutation: Update Product
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      return (await apiClient.put(`/api/admin/products/${id}`, data)).data;
    },
    onSuccess: () => {
      toast.success('Product updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      setIsModalOpen(false);
      setEditingProduct(null);
      resetForm();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update product');
    },
  });

  // Mutation: Delete Product
  const deleteProductMutation = useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/api/admin/products/${id}`);
    },
    onSuccess: () => {
      toast.success('Product deleted');
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
    onError: (err) => {
      toast.error('Failed to delete product');
    },
  });

  // Mutation: Update Stock Only
  const updateStockMutation = useMutation({
    mutationFn: async ({ id, stock }) => {
      return (await apiClient.patch(`/api/admin/products/${id}/stock`, { stock })).data;
    },
    onSuccess: () => {
      toast.success('Stock updated');
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });

  // Mutation: Upload Image
  const uploadImageMutation = useMutation({
    mutationFn: async (file) => {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      const response = await apiClient.post('/api/admin/upload/image', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.url;
    },
  });

  // Mutation: Toggle Active State
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, active }) => {
      const endpoint = active ? 'activate' : 'deactivate';
      return (await apiClient.patch(`/api/admin/products/${id}/${endpoint}`)).data;
    },
    onSuccess: () => {
      toast.success('Visibility toggled');
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      sizes: 'S,M,L,XL,XXL',
      categoryId: '',
      isFeatured: false,
      isNewArrival: false,
      isActive: true,
    });
    setUploadedImages([]);
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      sizes: product.sizes || '',
      categoryId: product.category?.id || '',
      isFeatured: product.isFeatured || false,
      isNewArrival: product.isNewArrival || false,
      isActive: product.isActive ?? true,
    });
    // Pre-load existing images
    const existingImages = product.images?.map(img => ({
      url: img.imageUrl,
      preview: img.imageUrl.startsWith('http') ? img.imageUrl : `${import.meta.env.VITE_API_BASE_URL}${img.imageUrl}`,
      isExisting: true,
    })) || [];
    setUploadedImages(existingImages);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.categoryId) {
      toast.error('Please select a category');
      return;
    }

    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      sizes: formData.sizes,
      categoryId: parseInt(formData.categoryId),
      isFeatured: formData.isFeatured,
      isNewArrival: formData.isNewArrival,
      isActive: formData.isActive,
      imageUrls: uploadedImages.map(img => img.url),
    };

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data: payload });
    } else {
      createProductMutation.mutate(payload);
    }
  };

  // Handle file selection (from input or drop)
  const handleFilesSelected = async (files) => {
    const fileArray = Array.from(files);
    for (const file of fileArray) {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} exceeds the 10MB limit`);
        continue;
      }
      // Local preview immediately
      const previewUrl = URL.createObjectURL(file);
      const tempId = Date.now() + Math.random();
      setUploadedImages(prev => [...prev, { url: null, preview: previewUrl, tempId, uploading: true }]);

      try {
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);
        const response = await apiClient.post('/api/admin/upload/image', formDataUpload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const serverUrl = response.data.url;
        setUploadedImages(prev =>
          prev.map(img => img.tempId === tempId ? { url: serverUrl, preview: previewUrl, uploading: false } : img)
        );
        toast.success('Image uploaded!');
      } catch (err) {
        setUploadedImages(prev => prev.filter(img => img.tempId !== tempId));
        toast.error('Image upload failed: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFilesSelected(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
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
          <h2 className="text-2xl font-bold font-spartan text-dark">Products Directory</h2>
          <p className="text-sm text-neutral-400">Add, edit, delete, adjust stock levels, or toggle product visibility.</p>
        </div>
        <button
          onClick={() => { resetForm(); setEditingProduct(null); setIsModalOpen(true); }}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-primary-dark transition"
        >
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Product List Table */}
      <div className="bg-white border border-gray-150 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold uppercase text-neutral-400 tracking-wider">
              <th className="p-4">Info</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {products?.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50/50">
                <td className="p-4 flex items-center space-x-3">
                  <img 
                    src={product.images?.[0]?.imageUrl || 'https://placehold.co/100'} 
                    alt={product.name} 
                    className="h-10 w-10 rounded-lg object-cover border border-gray-100"
                  />
                  <div>
                    <span className="font-semibold text-dark block">{product.name}</span>
                    <span className="text-xs text-neutral-400">ID: {product.id} • Sizes: {product.sizes || 'None'}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="px-2.5 py-1 bg-gray-100 text-neutral-700 text-xs font-semibold rounded-full">
                    {product.category?.name || 'Uncategorized'}
                  </span>
                </td>
                <td className="p-4 font-semibold text-dark">{formatPrice(product.price)}</td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="number"
                      value={newStockValues[product.id] ?? product.stock}
                      onChange={(e) => setNewStockValues({ ...newStockValues, [product.id]: parseInt(e.target.value) || 0 })}
                      className="w-16 px-2 py-1 border border-gray-200 rounded text-center text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                    />
                    <button
                      onClick={() => updateStockMutation.mutate({ id: product.id, stock: newStockValues[product.id] ?? product.stock })}
                      className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-neutral-600 rounded text-xs font-semibold transition"
                    >
                      Save
                    </button>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    {product.isActive ? (
                      <span className="inline-flex items-center text-xs bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded">Active</span>
                    ) : (
                      <span className="inline-flex items-center text-xs bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded">Hidden</span>
                    )}
                    {product.isFeatured && (
                      <span className="text-xs bg-purple-50 text-purple-600 font-bold px-2 py-0.5 rounded">Featured</span>
                    )}
                  </div>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => toggleActiveMutation.mutate({ id: product.id, active: !product.isActive })}
                    className="p-1.5 bg-gray-100 hover:bg-gray-200 text-neutral-600 rounded-lg transition"
                    title={product.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {product.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => handleEditClick(product)}
                    className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => { if(confirm('Delete product?')) deleteProductMutation.mutate(product.id); }}
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

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-100 max-h-[85vh] overflow-y-auto">
            <h3 className="text-lg font-bold font-spartan text-dark mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1 uppercase tracking-wider">Product Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
                  placeholder="e.g. Cartoon Astronaut T-Shirt"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1 uppercase tracking-wider">Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
                    placeholder="29.99"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1 uppercase tracking-wider">Stock Qty</label>
                  <input 
                    type="number" 
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
                    placeholder="100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1 uppercase tracking-wider">Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
                  >
                    <option value="">Select Category</option>
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1 uppercase tracking-wider">Sizes (comma-separated)</label>
                  <input 
                    type="text" 
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
                    placeholder="S,M,L,XL"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1 uppercase tracking-wider">Product Images</label>

                {/* Upload Drop Zone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${
                    isDragging ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFilesSelected(e.target.files)}
                  />
                  <Upload className="h-6 w-6 text-neutral-400 mx-auto mb-1" />
                  <p className="text-xs text-neutral-500">Click or drag & drop images here</p>
                  <p className="text-xs text-neutral-400">JPEG, PNG, WebP, GIF &bull; max 10MB each</p>
                </div>

                {/* Image Previews */}
                {uploadedImages.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {uploadedImages.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img.preview}
                          alt={`Product image ${index + 1}`}
                          className={`h-16 w-16 object-cover rounded-lg border-2 ${
                            index === 0 ? 'border-primary' : 'border-gray-200'
                          } ${img.uploading ? 'opacity-50' : ''}`}
                        />
                        {img.uploading && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                        {!img.uploading && (
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                        {index === 0 && (
                          <span className="absolute bottom-0 left-0 right-0 text-center text-[9px] bg-primary/80 text-white rounded-b-lg py-0.5">Primary</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1 uppercase tracking-wider">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary focus:outline-none h-20"
                  placeholder="Product design and specifications..."
                />
              </div>

              <div className="flex space-x-6 py-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-dark cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <span>Featured</span>
                </label>
                <label className="flex items-center space-x-2 text-sm font-semibold text-dark cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={formData.isNewArrival}
                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <span>New Arrival</span>
                </label>
                <label className="flex items-center space-x-2 text-sm font-semibold text-dark cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <span>Active / Visible</span>
                </label>
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
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
