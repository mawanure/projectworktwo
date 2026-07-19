/* =====================================================
   STAY HOME — Admin Dashboard JavaScript
   All data fetched from real backend APIs.
   Base URL: http://localhost:8080/api
   ===================================================== */

'use strict';

const ADMIN_API = 'http://localhost:8080/api';

// =====================================================
// AUTH
// =====================================================
const AdminAuth = {
    getToken: () => localStorage.getItem('sh_token'),
    getUser: () => { try { return JSON.parse(localStorage.getItem('sh_user')); } catch { return null; } },
    isAdmin: () => { const u = AdminAuth.getUser(); return u && u.role === 'ADMIN'; },
    clear: () => { localStorage.removeItem('sh_token'); localStorage.removeItem('sh_user'); }
};

// =====================================================
// FETCH WRAPPER
// =====================================================
async function adminFetch(path, options = {}) {
    const token = AdminAuth.getToken();
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(ADMIN_API + path, { ...options, headers });
    if (res.status === 401 || res.status === 403) {
        adminLogout();
        throw new Error('Session expired. Please login again.');
    }
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || err.error || `HTTP ${res.status}`);
    }
    return res.status === 204 ? null : res.json();
}

// =====================================================
// TOAST NOTIFICATIONS
// =====================================================
const AdminToast = {
    show(msg, type = 'default', duration = 3500) {
        const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', warning: 'fa-triangle-exclamation', default: 'fa-info-circle' };
        const c = document.getElementById('admin-toast-container');
        if (!c) return;
        const t = document.createElement('div');
        t.className = `admin-toast ${type}`;
        t.innerHTML = `<i class="fas ${icons[type] || icons.default}"></i><span>${msg}</span>`;
        c.appendChild(t);
        setTimeout(() => { t.classList.add('fadeout'); setTimeout(() => t.remove(), 300); }, duration);
    },
    success: (m) => AdminToast.show(m, 'success'),
    error: (m) => AdminToast.show(m, 'error'),
    warning: (m) => AdminToast.show(m, 'warning'),
    info: (m) => AdminToast.show(m, 'default'),
};

// =====================================================
// UTILITIES
// =====================================================
function debounce(fn, delay) {
    let t;
    return function(...args) {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), delay);
    };
}

function fmtDate(str) {
    if (!str) return '—';
    return new Date(str).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
function fmtDateTime(str) {
    if (!str) return '—';
    return new Date(str).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
function fmtCurrency(n) {
    return `৳${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function badge(label, type) {
    return `<span class="badge badge-${(type || label || '').toLowerCase()}">${label}</span>`;
}
function emptyState(msg = 'No records found', icon = 'fa-inbox') {
    return `<tr><td colspan="99" class="table-empty"><i class="fas ${icon}"></i><p>${msg}</p></td></tr>`;
}

// =====================================================
// NAVIGATION
// =====================================================
const PAGE_LABELS = {
    dashboard: 'Dashboard', orders: 'Orders', products: 'Products',
    categories: 'Categories', users: 'Users', payments: 'Payments',
    contact: 'Messages', newsletter: 'Newsletter', settings: 'Settings'
};

function navigateTo(page, clickedEl) {
    // Hide all pages
    document.querySelectorAll('.admin-page').forEach(p => p.classList.remove('active'));
    // Show target
    const target = document.getElementById(`page-${page}`);
    if (target) target.classList.add('active');
    // Update nav active
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    if (clickedEl) clickedEl.classList.add('active');
    else {
        const navEl = document.querySelector(`.nav-item[data-page="${page}"]`);
        if (navEl) navEl.classList.add('active');
    }
    // Breadcrumb
    const bc = document.getElementById('breadcrumb-page');
    if (bc) bc.textContent = PAGE_LABELS[page] || page;
    // Load data
    const loaders = {
        dashboard: loadDashboard, orders: loadOrders, products: loadProducts,
        categories: loadCategories, users: loadUsers, payments: loadPayments,
        contact: loadContactMessages, newsletter: loadNewsletter, settings: loadSettings
    };
    if (loaders[page]) loaders[page]();
    // Close sidebar on mobile
    if (window.innerWidth <= 900) closeSidebar();
}

// =====================================================
// SIDEBAR TOGGLE
// =====================================================
function toggleSidebar() {
    const sidebar = document.getElementById('admin-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
}
function closeSidebar() {
    document.getElementById('admin-sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').classList.remove('open');
}

// =====================================================
// PROFILE DROPDOWN
// =====================================================
function initProfileDropdown() {
    const btn = document.getElementById('admin-profile-btn');
    const dd = document.getElementById('admin-profile-dropdown');
    if (!btn || !dd) return;
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        dd.classList.toggle('open');
    });
    document.addEventListener('click', () => dd.classList.remove('open'));
}

// =====================================================
// LOGOUT
// =====================================================
function adminLogout() {
    AdminAuth.clear();
    window.location.href = 'login.html';
}

// =====================================================
// GUARD: Only Admins
// =====================================================
function guardAdmin() {
    if (!AdminAuth.getToken()) {
        window.location.href = 'login.html';
        return false;
    }
    if (!AdminAuth.isAdmin()) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// =====================================================
// INIT HEADER INFO
// =====================================================
function initAdminHeader() {
    const user = AdminAuth.getUser();
    if (!user) return;
    const nameEl = document.getElementById('admin-display-name');
    const avatarEl = document.getElementById('admin-avatar-initials');
    const settingsAvatar = document.getElementById('settings-avatar');
    const initials = (user.name || 'A').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    if (nameEl) nameEl.textContent = user.name || 'Admin';
    if (avatarEl) avatarEl.textContent = initials;
    if (settingsAvatar) settingsAvatar.textContent = initials;
}

// =====================================================
// CONFIRM MODAL
// =====================================================
let _confirmCallback = null;
function showConfirm(title, message, onConfirm, dangerText = 'Confirm') {
    document.getElementById('confirm-modal-title').textContent = title;
    document.getElementById('confirm-modal-message').textContent = message;
    const okBtn = document.getElementById('confirm-modal-ok');
    okBtn.textContent = dangerText;
    _confirmCallback = onConfirm;
    openModal('confirm-modal');
}
function closeConfirmModal() { closeModal('confirm-modal'); _confirmCallback = null; }
document.addEventListener('DOMContentLoaded', () => {
    const okBtn = document.getElementById('confirm-modal-ok');
    if (okBtn) okBtn.addEventListener('click', () => {
        if (_confirmCallback) { _confirmCallback(); _confirmCallback = null; }
        closeModal('confirm-modal');
    });
});

// =====================================================
// MODAL HELPERS
// =====================================================
function openModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.add('active');
}
function closeModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.remove('active');
}

// =====================================================
// =====================================================
//  DASHBOARD
// =====================================================
// =====================================================
async function loadDashboard() {
    await Promise.all([loadDashboardStats(), loadRecentOrders(), loadLowStockList()]);
}

async function loadDashboardStats() {
    const grid = document.getElementById('stats-grid');
    if (!grid) return;

    // Skeleton
    grid.innerHTML = Array(8).fill(`<div class="stat-card skeleton-card"></div>`).join('');

    try {
        const stats = await adminFetch('/admin/dashboard/stats');

        const cards = [
            { label: 'Total Users', value: stats.totalUsers, icon: 'fa-users', color: '#3b82f6', bg: '#eff6ff' },
            { label: 'Total Products', value: stats.totalProducts, icon: 'fa-box-open', color: '#8b5cf6', bg: '#f5f3ff' },
            { label: 'Total Orders', value: stats.totalOrders, icon: 'fa-shopping-bag', color: '#f59e0b', bg: '#fffbeb' },
            { label: 'Total Revenue', value: fmtCurrency(stats.totalRevenue), icon: 'fa-bangladeshi-taka-sign', color: '#10b981', bg: '#ecfdf5' },
            { label: 'Pending Orders', value: stats.pendingOrders, icon: 'fa-clock', color: '#f59e0b', bg: '#fffbeb' },
            { label: 'Low Stock', value: stats.lowStockProducts, icon: 'fa-exclamation-triangle', color: '#ef4444', bg: '#fef2f2' },
            { label: 'Out of Stock', value: stats.outOfStockProducts, icon: 'fa-times-circle', color: '#dc2626', bg: '#fee2e2' },
            { label: 'Delivered', value: stats.deliveredOrders, icon: 'fa-check-circle', color: '#10b981', bg: '#ecfdf5' },
        ];

        grid.innerHTML = cards.map(c => `
            <div class="stat-card">
                <div class="stat-icon" style="background:${c.bg};color:${c.color}">
                    <i class="fas ${c.icon}"></i>
                </div>
                <div class="stat-info">
                    <div class="stat-value">${c.value}</div>
                    <div class="stat-label">${c.label}</div>
                </div>
            </div>`).join('');

        // Update pending badge in sidebar
        const badge = document.getElementById('nav-pending-badge');
        if (badge && stats.pendingOrders > 0) {
            badge.textContent = stats.pendingOrders;
            badge.style.display = '';
        }
    } catch (err) {
        grid.innerHTML = `<div style="grid-column:1/-1;padding:20px;color:var(--danger)">${err.message}</div>`;
    }
}

async function loadRecentOrders() {
    const el = document.getElementById('recent-orders-table');
    if (!el) return;
    try {
        const orders = await adminFetch('/admin/orders');
        const recent = (orders || []).slice(0, 6);
        if (recent.length === 0) { el.innerHTML = `<p style="padding:20px;color:var(--admin-text-muted);font-size:13px">No orders yet.</p>`; return; }
        el.innerHTML = `
            <table class="admin-table">
                <thead><tr><th>#</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>${recent.map(o => `
                    <tr>
                        <td><strong>#${o.id}</strong></td>
                        <td>${o.shippingAddress ? o.shippingAddress.split(',')[0] : '—'}</td>
                        <td>${fmtCurrency(o.totalAmount)}</td>
                        <td>${badge(o.status, o.status)}</td>
                        <td>${fmtDate(o.orderDate)}</td>
                    </tr>`).join('')}
                </tbody>
            </table>`;
    } catch (err) { el.innerHTML = `<p style="padding:16px;color:var(--danger);font-size:13px">${err.message}</p>`; }
}

async function loadLowStockList() {
    const el = document.getElementById('low-stock-list');
    if (!el) return;
    try {
        const data = await adminFetch('/products?page=0&size=50');
        const products = (data.content || []).filter(p => p.stock <= 5).slice(0, 8);
        if (products.length === 0) {
            el.innerHTML = `<p style="padding:20px;color:var(--admin-text-muted);font-size:13px">All products are well-stocked. ✓</p>`;
            return;
        }
        el.innerHTML = products.map(p => {
            const qty = p.stock;
            const cls = qty === 0 ? 'danger' : 'warning';
            return `
                <div class="low-stock-item">
                    <img class="low-stock-img" src="${p.primaryImageUrl || 'images/products/f1.jpg'}" onerror="this.src='images/products/f1.jpg'" alt="${p.name}">
                    <div class="low-stock-info">
                        <div class="low-stock-name">${p.name}</div>
                        <div class="low-stock-cat">${p.category?.name || ''}</div>
                    </div>
                    <div class="low-stock-qty ${cls}">${qty === 0 ? 'Out' : qty + ' left'}</div>
                </div>`;
        }).join('');
    } catch (err) { el.innerHTML = `<p style="padding:16px;color:var(--danger);font-size:13px">${err.message}</p>`; }
}

// =====================================================
// ORDERS
// =====================================================
let ordersState = { page: 0, size: 15, total: 0, pages: 1, data: [] };

async function loadOrders() {
    const tbody = document.getElementById('orders-tbody');
    if (!tbody) return;
    const search = document.getElementById('order-search')?.value?.trim() || '';
    const status = document.getElementById('order-status-filter')?.value || '';
    tbody.innerHTML = `<tr><td colspan="8" class="table-loading"><i class="fas fa-spinner fa-spin" style="margin-right:8px"></i>Loading orders...</td></tr>`;
    try {
        let url = '/admin/orders';
        const params = [];
        if (status) params.push(`status=${status}`);
        if (search) params.push(`search=${encodeURIComponent(search)}`);
        if (params.length) url += '?' + params.join('&');
        const orders = await adminFetch(url);
        ordersState.data = orders || [];
        const paginated = ordersState.data.slice(ordersState.page * ordersState.size, (ordersState.page + 1) * ordersState.size);
        ordersState.pages = Math.max(1, Math.ceil(ordersState.data.length / ordersState.size));
        if (paginated.length === 0) { tbody.innerHTML = emptyState('No orders found', 'fa-shopping-bag'); renderPagination('orders', 0, 0); return; }
        tbody.innerHTML = paginated.map(o => `
            <tr>
                <td><strong>#${o.id}</strong></td>
                <td style="max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${o.phone || '—'}</td>
                <td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px">${o.shippingAddress || '—'}</td>
                <td><strong>${fmtCurrency(o.totalAmount)}</strong></td>
                <td>${badge(o.paymentMethod, 'default')}</td>
                <td>${badge(o.status, o.status)}</td>
                <td style="font-size:12px;color:var(--admin-text-muted)">${fmtDate(o.orderDate)}</td>
                <td>
                    <div class="actions-group">
                        <button class="action-btn edit" title="Update Status" onclick="openOrderStatusModal(${o.id}, '${o.status}')">
                            <i class="fas fa-pen"></i>
                        </button>
                    </div>
                </td>
            </tr>`).join('');
        renderPagination('orders', ordersState.page, ordersState.pages);
    } catch (err) { tbody.innerHTML = `<tr><td colspan="8" class="table-empty" style="color:var(--danger)">${err.message}</td></tr>`; }
}

// Order Status Modal
function openOrderStatusModal(id, currentStatus) {
    document.getElementById('update-order-id').value = id;
    document.getElementById('update-order-display-id').textContent = id;
    document.getElementById('update-order-status').value = currentStatus;
    openModal('order-status-modal');
}
function closeOrderStatusModal() { closeModal('order-status-modal'); }

async function submitOrderStatus() {
    const id = document.getElementById('update-order-id').value;
    const status = document.getElementById('update-order-status').value;
    try {
        await adminFetch(`/admin/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
        AdminToast.success(`Order #${id} status updated to ${status}.`);
        closeOrderStatusModal();
        loadOrders();
    } catch (err) { AdminToast.error(err.message); }
}

// =====================================================
// PRODUCTS
// =====================================================
let productsState = { page: 0, size: 12, total: 0, pages: 1, data: [] };

async function loadProducts() {
    const tbody = document.getElementById('products-tbody');
    if (!tbody) return;
    const search = (document.getElementById('product-search')?.value || '').toLowerCase().trim();
    const catFilter = document.getElementById('product-category-filter')?.value || '';
    const stockFilter = document.getElementById('product-stock-filter')?.value || '';
    tbody.innerHTML = `<tr><td colspan="7" class="table-loading"><i class="fas fa-spinner fa-spin" style="margin-right:8px"></i>Loading products...</td></tr>`;
    try {
        let url = `/products?page=0&size=200`;
        if (catFilter) url += `&category=${catFilter}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        const data = await adminFetch(url);
        let products = data.content || [];
        // Client-side stock filter
        if (stockFilter === 'low') products = products.filter(p => p.stock > 0 && p.stock <= 5);
        else if (stockFilter === 'out') products = products.filter(p => p.stock === 0);
        productsState.data = products;
        productsState.pages = Math.max(1, Math.ceil(products.length / productsState.size));
        const paginated = products.slice(productsState.page * productsState.size, (productsState.page + 1) * productsState.size);
        if (paginated.length === 0) { tbody.innerHTML = emptyState('No products found', 'fa-box-open'); renderPagination('products', 0, 0); return; }
        tbody.innerHTML = paginated.map(p => `
            <tr>
                <td><img class="table-img" src="${p.primaryImageUrl || 'images/products/f1.jpg'}" onerror="this.src='images/products/f1.jpg'" alt="${p.name}"></td>
                <td><div style="font-weight:600;font-size:13px">${p.name}</div><div style="font-size:11px;color:var(--admin-text-muted)">${p.sizes || ''}</div></td>
                <td>${p.category?.name || '—'}</td>
                <td><strong>${fmtCurrency(p.price)}</strong></td>
                <td>${stockBadge(p.stock)}</td>
                <td>${p.isActive !== false ? badge('Active', 'active') : badge('Inactive', 'inactive')}</td>
                <td>
                    <div class="actions-group">
                        <button class="action-btn edit" title="Edit" onclick="openProductModal(${p.id})"><i class="fas fa-pen"></i></button>
                        <button class="action-btn warning" title="Update Stock" onclick="openStockModal(${p.id}, '${p.name.replace(/'/g,"\\'")}', ${p.stock})"><i class="fas fa-boxes"></i></button>
                        <button class="action-btn ${p.isActive !== false ? 'warning' : 'success'}" title="${p.isActive !== false ? 'Deactivate' : 'Activate'}" onclick="toggleProduct(${p.id}, ${p.isActive !== false})">
                            <i class="fas fa-${p.isActive !== false ? 'eye-slash' : 'eye'}"></i>
                        </button>
                        <button class="action-btn delete" title="Delete" onclick="confirmDeleteProduct(${p.id}, '${p.name.replace(/'/g,"\\'")}')"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>`).join('');
        renderPagination('products', productsState.page, productsState.pages);
    } catch (err) { tbody.innerHTML = `<tr><td colspan="7" class="table-empty" style="color:var(--danger)">${err.message}</td></tr>`; }
}

function stockBadge(stock) {
    if (stock === 0) return `<span class="badge badge-out">Out of Stock</span>`;
    if (stock <= 5) return `<span class="badge badge-low">Low (${stock})</span>`;
    return `<span style="font-weight:600">${stock}</span>`;
}

// Product Modal
async function openProductModal(id = null) {
    document.getElementById('product-modal-title').textContent = id ? 'Edit Product' : 'Add Product';
    document.getElementById('product-id').value = id || '';
    document.getElementById('product-form').reset();
    // Load categories into the select
    await loadCategoryDropdown('p-category');
    if (id) {
        try {
            const p = await adminFetch(`/products/${id}`);
            document.getElementById('p-name').value = p.name || '';
            document.getElementById('p-category').value = p.category?.id || p.categoryId || '';
            document.getElementById('p-price').value = p.price || '';
            document.getElementById('p-stock').value = p.stock || '';
            document.getElementById('p-sizes').value = p.sizes || '';
            document.getElementById('p-description').value = p.description || '';
            document.getElementById('p-images').value = (p.imageUrls || []).join('\n');
        } catch (err) { AdminToast.error('Could not load product: ' + err.message); }
    }
    openModal('product-modal');
}
function closeProductModal() { closeModal('product-modal'); }

async function saveProduct() {
    const id = document.getElementById('product-id').value;
    const name = document.getElementById('p-name').value.trim();
    const categoryId = parseInt(document.getElementById('p-category').value);
    const price = parseFloat(document.getElementById('p-price').value);
    const stock = parseInt(document.getElementById('p-stock').value);
    const sizes = document.getElementById('p-sizes').value.trim();
    const description = document.getElementById('p-description').value.trim();
    const imageUrls = document.getElementById('p-images').value.split('\n').map(s => s.trim()).filter(Boolean);

    if (!name || !categoryId || isNaN(price) || isNaN(stock)) {
        AdminToast.warning('Fill in all required fields.');
        return;
    }
    const body = { name, categoryId, price, stock, sizes, description, imageUrls };
    try {
        if (id) {
            await adminFetch(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(body) });
            AdminToast.success('Product updated successfully.');
        } else {
            await adminFetch('/admin/products', { method: 'POST', body: JSON.stringify(body) });
            AdminToast.success('Product created successfully.');
        }
        closeProductModal();
        loadProducts();
    } catch (err) { AdminToast.error(err.message); }
}

function confirmDeleteProduct(id, name) {
    showConfirm('Delete Product', `Are you sure you want to delete "${name}"? This cannot be undone.`, async () => {
        try {
            await adminFetch(`/admin/products/${id}`, { method: 'DELETE' });
            AdminToast.success('Product deleted.');
            loadProducts();
        } catch (err) { AdminToast.error(err.message); }
    }, 'Delete');
}

async function toggleProduct(id, isCurrentlyActive) {
    const endpoint = isCurrentlyActive ? 'deactivate' : 'activate';
    const label = isCurrentlyActive ? 'deactivated' : 'activated';
    try {
        await adminFetch(`/admin/products/${id}/${endpoint}`, { method: 'PATCH' });
        AdminToast.success(`Product ${label}.`);
        loadProducts();
    } catch (err) { AdminToast.error(err.message); }
}

// Stock Modal
function openStockModal(id, name, currentStock) {
    document.getElementById('stock-product-id').value = id;
    document.getElementById('stock-product-name').textContent = name;
    document.getElementById('stock-value').value = currentStock;
    openModal('stock-modal');
}
function closeStockModal() { closeModal('stock-modal'); }

async function submitStock() {
    const id = document.getElementById('stock-product-id').value;
    const stock = parseInt(document.getElementById('stock-value').value);
    if (isNaN(stock) || stock < 0) { AdminToast.warning('Enter a valid stock value (≥ 0).'); return; }
    try {
        await adminFetch(`/admin/products/${id}/stock`, { method: 'PATCH', body: JSON.stringify({ stock }) });
        AdminToast.success('Stock updated.');
        closeStockModal();
        loadProducts();
    } catch (err) { AdminToast.error(err.message); }
}

// =====================================================
// CATEGORIES
// =====================================================
async function loadCategories() {
    const tbody = document.getElementById('categories-tbody');
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="4" class="table-loading">Loading categories...</td></tr>`;
    try {
        const cats = await adminFetch('/categories');
        if (!cats || cats.length === 0) { tbody.innerHTML = emptyState('No categories yet', 'fa-tags'); return; }
        tbody.innerHTML = cats.map(c => `
            <tr>
                <td><strong>#${c.id}</strong></td>
                <td><strong>${c.name}</strong></td>
                <td style="color:var(--admin-text-muted);font-size:13px">${c.description || '—'}</td>
                <td>
                    <div class="actions-group">
                        <button class="action-btn edit" title="Edit" onclick="openCategoryModal(${c.id}, '${c.name.replace(/'/g,"\\'")}', '${(c.description || '').replace(/'/g,"\\'")}')"><i class="fas fa-pen"></i></button>
                        <button class="action-btn delete" title="Delete" onclick="confirmDeleteCategory(${c.id}, '${c.name.replace(/'/g,"\\'")}')"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>`).join('');
    } catch (err) { tbody.innerHTML = `<tr><td colspan="4" class="table-empty" style="color:var(--danger)">${err.message}</td></tr>`; }
}

function openCategoryModal(id = null, name = '', description = '') {
    document.getElementById('category-modal-title').textContent = id ? 'Edit Category' : 'Add Category';
    document.getElementById('category-id').value = id || '';
    document.getElementById('c-name').value = name;
    document.getElementById('c-description').value = description;
    openModal('category-modal');
}
function closeCategoryModal() { closeModal('category-modal'); }

async function saveCategory() {
    const id = document.getElementById('category-id').value;
    const name = document.getElementById('c-name').value.trim();
    const description = document.getElementById('c-description').value.trim();
    if (!name) { AdminToast.warning('Category name is required.'); return; }
    try {
        if (id) {
            await adminFetch(`/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify({ name, description }) });
            AdminToast.success('Category updated.');
        } else {
            await adminFetch('/admin/categories', { method: 'POST', body: JSON.stringify({ name, description }) });
            AdminToast.success('Category created.');
        }
        closeCategoryModal();
        loadCategories();
    } catch (err) { AdminToast.error(err.message); }
}

function confirmDeleteCategory(id, name) {
    showConfirm('Delete Category', `Delete category "${name}"? All products in this category may be affected.`, async () => {
        try {
            await adminFetch(`/admin/categories/${id}`, { method: 'DELETE' });
            AdminToast.success('Category deleted.');
            loadCategories();
        } catch (err) { AdminToast.error(err.message); }
    }, 'Delete');
}

async function loadCategoryDropdown(selectId) {
    const sel = document.getElementById(selectId);
    if (!sel) return;
    try {
        const cats = await adminFetch('/categories');
        sel.innerHTML = '<option value="">Select Category</option>' + cats.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    } catch {}
}

async function loadProductCategoryFilter() {
    const sel = document.getElementById('product-category-filter');
    if (!sel || sel.options.length > 1) return;
    try {
        const cats = await adminFetch('/categories');
        cats.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id; opt.textContent = c.name;
            sel.appendChild(opt);
        });
    } catch {}
}

// =====================================================
// USERS
// =====================================================
let usersState = { page: 0, size: 15, data: [] };

async function loadUsers() {
    const tbody = document.getElementById('users-tbody');
    if (!tbody) return;
    const search = document.getElementById('user-search')?.value?.trim() || '';
    const role = document.getElementById('user-role-filter')?.value || '';
    tbody.innerHTML = `<tr><td colspan="7" class="table-loading"><i class="fas fa-spinner fa-spin" style="margin-right:8px"></i>Loading users...</td></tr>`;
    try {
        let url = '/admin/users';
        const params = [];
        if (search) params.push(`search=${encodeURIComponent(search)}`);
        if (params.length) url += '?' + params.join('&');
        let users = await adminFetch(url);
        if (role) users = users.filter(u => u.role === role);
        usersState.data = users || [];
        const pages = Math.max(1, Math.ceil(users.length / usersState.size));
        const paginated = users.slice(usersState.page * usersState.size, (usersState.page + 1) * usersState.size);
        if (paginated.length === 0) { tbody.innerHTML = emptyState('No users found', 'fa-users'); renderPagination('users', 0, 0); return; }
        tbody.innerHTML = paginated.map(u => `
            <tr>
                <td><strong>#${u.id}</strong></td>
                <td>
                    <div style="display:flex;align-items:center;gap:10px">
                        <div style="width:32px;height:32px;border-radius:50%;background:var(--primary-light);color:var(--primary);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0">
                            ${(u.name || 'U')[0].toUpperCase()}
                        </div>
                        <span style="font-weight:600">${u.name}</span>
                    </div>
                </td>
                <td style="font-size:13px">${u.email}</td>
                <td style="font-size:13px">${u.phone || '—'}</td>
                <td>${badge(u.role, u.role)}</td>
                <td style="font-size:12px;color:var(--admin-text-muted)">${fmtDate(u.createdAt)}</td>
                <td>
                    <div class="actions-group">
                        ${u.enabled !== false
                            ? `<button class="action-btn warning" title="Block User" onclick="blockUser(${u.id}, '${u.name.replace(/'/g,"\\'")}')"><i class="fas fa-ban"></i></button>`
                            : `<button class="action-btn success" title="Unblock User" onclick="unblockUser(${u.id}, '${u.name.replace(/'/g,"\\'")}')"><i class="fas fa-check-circle"></i></button>`
                        }
                    </div>
                </td>
            </tr>`).join('');
        renderPagination('users', usersState.page, pages);
    } catch (err) { tbody.innerHTML = `<tr><td colspan="7" class="table-empty" style="color:var(--danger)">${err.message}</td></tr>`; }
}

async function blockUser(id, name) {
    showConfirm('Block User', `Block user "${name}"? They will not be able to login.`, async () => {
        try {
            await adminFetch(`/admin/users/${id}/block`, { method: 'PATCH' });
            AdminToast.success(`User "${name}" blocked.`);
            loadUsers();
        } catch (err) { AdminToast.error(err.message); }
    }, 'Block User');
}

async function unblockUser(id, name) {
    try {
        await adminFetch(`/admin/users/${id}/unblock`, { method: 'PATCH' });
        AdminToast.success(`User "${name}" unblocked.`);
        loadUsers();
    } catch (err) { AdminToast.error(err.message); }
}

// =====================================================
// PAYMENTS
// =====================================================
async function loadPayments() {
    const tbody = document.getElementById('payments-tbody');
    if (!tbody) return;
    const status = document.getElementById('payment-status-filter')?.value || '';
    const method = document.getElementById('payment-method-filter')?.value || '';
    tbody.innerHTML = `<tr><td colspan="7" class="table-loading">Loading payments...</td></tr>`;
    try {
        let url = '/admin/payments';
        const params = [];
        if (status) params.push(`status=${status}`);
        if (method) params.push(`method=${method}`);
        if (params.length) url += '?' + params.join('&');
        const payments = await adminFetch(url);
        if (!payments || payments.length === 0) { tbody.innerHTML = emptyState('No payments found', 'fa-credit-card'); return; }
        tbody.innerHTML = payments.map(p => `
            <tr>
                <td><strong>#${p.id}</strong></td>
                <td><a href="#" onclick="navigateTo('orders', null)" style="color:var(--primary);font-weight:600">#${p.orderId}</a></td>
                <td><strong>${fmtCurrency(p.amount)}</strong></td>
                <td>${badge(p.paymentMethod, 'default')}</td>
                <td>${badge(p.paymentStatus, p.paymentStatus)}</td>
                <td style="font-size:12px;color:var(--admin-text-muted)">${p.paidAt ? fmtDateTime(p.paidAt) : '—'}</td>
                <td style="font-size:12px;color:var(--admin-text-muted)">${fmtDate(p.createdAt)}</td>
            </tr>`).join('');
    } catch (err) { tbody.innerHTML = `<tr><td colspan="7" class="table-empty" style="color:var(--danger)">${err.message}</td></tr>`; }
}

// =====================================================
// CONTACT MESSAGES
// =====================================================
async function loadContactMessages() {
    const tbody = document.getElementById('contact-tbody');
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="5" class="table-loading">Loading messages...</td></tr>`;
    try {
        const messages = await adminFetch('/admin/contact-messages');
        if (!messages || messages.length === 0) { tbody.innerHTML = emptyState('No messages found', 'fa-envelope-open'); return; }
        tbody.innerHTML = messages.map(m => `
            <tr>
                <td><strong>#${m.id}</strong></td>
                <td><strong>${m.name}</strong></td>
                <td style="font-size:13px">${m.emailOrPhone}</td>
                <td style="max-width:300px;font-size:13px">${m.message}</td>
                <td style="font-size:12px;color:var(--admin-text-muted)">${fmtDateTime(m.createdAt)}</td>
            </tr>`).join('');
    } catch (err) { tbody.innerHTML = `<tr><td colspan="5" class="table-empty" style="color:var(--danger)">${err.message}</td></tr>`; }
}

// =====================================================
// NEWSLETTER
// =====================================================
let _newsletterData = [];

async function loadNewsletter() {
    const tbody = document.getElementById('newsletter-tbody');
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="3" class="table-loading">Loading subscribers...</td></tr>`;
    try {
        const subs = await adminFetch('/admin/newsletter-subscribers');
        _newsletterData = subs || [];
        if (_newsletterData.length === 0) { tbody.innerHTML = emptyState('No subscribers yet', 'fa-newspaper'); return; }
        tbody.innerHTML = _newsletterData.map(s => `
            <tr>
                <td><strong>#${s.id}</strong></td>
                <td>${s.email}</td>
                <td style="font-size:12px;color:var(--admin-text-muted)">${fmtDateTime(s.subscribedAt)}</td>
            </tr>`).join('');
    } catch (err) { tbody.innerHTML = `<tr><td colspan="3" class="table-empty" style="color:var(--danger)">${err.message}</td></tr>`; }
}

function exportNewsletterCSV() {
    if (!_newsletterData.length) { AdminToast.warning('No subscriber data to export.'); return; }
    const rows = [['ID', 'Email', 'Subscribed At'], ..._newsletterData.map(s => [s.id, s.email, fmtDateTime(s.subscribedAt)])];
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'newsletter-subscribers.csv';
    a.click(); URL.revokeObjectURL(url);
    AdminToast.success('CSV exported successfully.');
}

// =====================================================
// SETTINGS
// =====================================================
function loadSettings() {
    const user = AdminAuth.getUser();
    if (!user) return;
    const block = document.getElementById('settings-profile-info');
    if (block) {
        block.innerHTML = `
            <div class="profile-info-row"><div class="profile-info-label">Name</div><div class="profile-info-value">${user.name}</div></div>
            <div class="profile-info-row"><div class="profile-info-label">Email</div><div class="profile-info-value">${user.email}</div></div>
            <div class="profile-info-row"><div class="profile-info-label">Phone</div><div class="profile-info-value">${user.phone || '—'}</div></div>
            <div class="profile-info-row"><div class="profile-info-label">Role</div><div class="profile-info-value">${badge(user.role, user.role)}</div></div>`;
    }
}

// =====================================================
// PAGINATION HELPER
// =====================================================
function renderPagination(section, currentPage, totalPages) {
    const el = document.getElementById(`${section}-pagination`);
    if (!el) return;
    if (totalPages <= 1) { el.innerHTML = ''; return; }
    const stateMap = { orders: ordersState, products: productsState, users: usersState };
    const state = stateMap[section];
    let html = '';
    if (currentPage > 0) html += `<button class="page-btn" onclick="${section}GoPage(${currentPage - 1})"><i class="fas fa-chevron-left"></i></button>`;
    for (let i = 0; i < totalPages; i++) {
        if (totalPages > 7 && Math.abs(i - currentPage) > 2 && i !== 0 && i !== totalPages - 1) {
            if (i === 1 || i === totalPages - 2) html += `<span style="padding:0 4px;color:var(--admin-text-muted)">…</span>`;
            continue;
        }
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="${section}GoPage(${i})">${i + 1}</button>`;
    }
    if (currentPage < totalPages - 1) html += `<button class="page-btn" onclick="${section}GoPage(${currentPage + 1})"><i class="fas fa-chevron-right"></i></button>`;
    el.innerHTML = html;
}

function ordersGoPage(p) { ordersState.page = p; loadOrders(); }
function productsGoPage(p) { productsState.page = p; loadProducts(); }
function usersGoPage(p) { usersState.page = p; loadUsers(); }

// =====================================================
// INIT
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    // Auth guard
    if (!guardAdmin()) return;

    // Init UI
    initAdminHeader();
    initProfileDropdown();

    // Load product category filter options
    loadProductCategoryFilter();

    // Load initial page (dashboard)
    loadDashboard();

    // Close modals on overlay click
    document.querySelectorAll('.modal-overlay').forEach(m => {
        m.addEventListener('click', (e) => {
            if (e.target === m) m.classList.remove('active');
        });
    });
});
