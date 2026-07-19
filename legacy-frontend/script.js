/* =====================================================
   STAY HOME E-Commerce — Main JavaScript
   Phase 10: Full API Integration
   Base URL: http://localhost:8080
   ===================================================== */

const API = 'http://localhost:8080/api';

// =====================================================
// AUTH HELPERS
// =====================================================
const Auth = {
  getToken: () => localStorage.getItem('sh_token'),
  getUser: () => { try { return JSON.parse(localStorage.getItem('sh_user')); } catch { return null; } },
  isLoggedIn: () => !!localStorage.getItem('sh_token'),
  isAdmin: () => { const u = Auth.getUser(); return u && u.role === 'ADMIN'; },
  isCustomer: () => { const u = Auth.getUser(); return u && u.role === 'CUSTOMER'; },
  save: (token, user) => {
    localStorage.setItem('sh_token', token);
    localStorage.setItem('sh_user', JSON.stringify(user));
  },
  clear: () => {
    localStorage.removeItem('sh_token');
    localStorage.removeItem('sh_user');
  }
};

// =====================================================
// FETCH WRAPPER
// =====================================================
async function apiFetch(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = Auth.getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(API + path, { ...options, headers });
  if (res.status === 401 || res.status === 403) {
    Auth.clear();
    updateHeaderAuth();
    if (path.startsWith('/cart') || path.startsWith('/wishlist') || path.startsWith('/orders')) {
      Toast.error('Please login to continue.');
      openLoginModal();
      throw new Error('Unauthorized');
    }
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
const Toast = {
  _container: null,
  _getContainer() {
    if (!this._container) {
      this._container = document.createElement('div');
      this._container.className = 'toast-container';
      document.body.appendChild(this._container);
    }
    return this._container;
  },
  show(msg, type = 'default', duration = 3000) {
    const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', warning: 'fa-triangle-exclamation', default: 'fa-info-circle' };
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<i class="fas ${icons[type] || icons.default}"></i><span>${msg}</span>`;
    const c = this._getContainer();
    c.appendChild(t);
    setTimeout(() => { t.classList.add('toast-fadeout'); setTimeout(() => t.remove(), 300); }, duration);
  },
  success: (m) => Toast.show(m, 'success'),
  error: (m) => Toast.show(m, 'error'),
  warning: (m) => Toast.show(m, 'warning'),
  info: (m) => Toast.show(m, 'default'),
};

// =====================================================
// LOADING
// =====================================================
const Loader = {
  show() {
    let el = document.getElementById('global-loader');
    if (!el) {
      el = document.createElement('div');
      el.id = 'global-loader';
      el.className = 'loader-overlay';
      el.innerHTML = '<div class="loader-spinner"></div>';
      document.body.appendChild(el);
    }
    el.style.display = 'flex';
  },
  hide() {
    const el = document.getElementById('global-loader');
    if (el) el.style.display = 'none';
  }
};

// =====================================================
// STARS RENDERER
// =====================================================
function renderStars(rating) {
  const r = parseFloat(rating) || 0;
  let s = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(r)) s += '<i class="fas fa-star"></i>';
    else if (i - 0.5 <= r) s += '<i class="fas fa-star-half-alt"></i>';
    else s += '<i class="far fa-star"></i>';
  }
  return s;
}

// =====================================================
// PRODUCT CARD RENDERER
// =====================================================
function renderProductCard(p, wishlistIds = []) {
  const img = p.primaryImageUrl ? `${p.primaryImageUrl}` : 'images/products/f1.jpg';
  const inWL = wishlistIds.includes(p.id);
  return `
    <div class="pro" data-id="${p.id}" onclick="goToProduct(${p.id}, event)">
      <div class="pro-img-wrap">
        <img src="${img}" alt="${p.name}" loading="lazy" onerror="this.src='images/products/f1.jpg'">
        <div class="pro-actions">
          <button class="pro-action-btn wishlist-toggle-btn ${inWL ? 'active' : ''}" data-product-id="${p.id}" title="Wishlist" onclick="event.stopPropagation(); toggleWishlist(${p.id}, this)">
            <i class="fa${inWL ? 's' : 'r'} fa-heart"></i>
          </button>
        </div>
      </div>
      <div class="des">
        <span>${p.category ? p.category.name || p.categoryName || '' : ''}</span>
        <h5>${p.name}</h5>
        <div class="star">${renderStars(p.rating || 5)}</div>
        <h4>৳${Number(p.price).toFixed(2)}</h4>
      </div>
      <button class="pro-add-btn" onclick="event.stopPropagation(); quickAddToCart(${p.id})">
        <i class="fas fa-cart-plus"></i> Add to Cart
      </button>
    </div>`;
}

function goToProduct(id, e) {
  if (e && e.target.closest('.pro-add-btn, .pro-action-btn')) return;
  window.location.href = `sproduct.html?id=${id}`;
}

// =====================================================
// CART BADGE
// =====================================================
async function updateCartBadge() {
  if (!Auth.isLoggedIn()) { setCartBadge(0); return; }
  try {
    const data = await apiFetch('/cart');
    const count = data.items ? data.items.length : 0;
    setCartBadge(count);
  } catch { setCartBadge(0); }
}

function setCartBadge(n) {
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = n;
    el.style.display = n > 0 ? 'flex' : 'none';
  });
}

// =====================================================
// HEADER AUTH STATE
// =====================================================
function updateHeaderAuth() {
  const navbarEl = document.getElementById('navbar');
  if (!navbarEl) return;
  // Remove any existing auth li items
  navbarEl.querySelectorAll('.auth-nav-item').forEach(el => el.remove());
  const headerActions = document.getElementById('header-actions');
  if (headerActions) headerActions.innerHTML = buildHeaderActions();
}

function buildHeaderActions() {
  const user = Auth.getUser();
  const isLoggedIn = Auth.isLoggedIn();
  let html = `
    <a href="cart.html" class="header-icon-btn header-cart-btn" title="Cart">
      <i class="fa-solid fa-bag-shopping"></i>
      <span class="cart-badge" style="display:none">0</span>
    </a>`;
  if (isLoggedIn) {
    html += `
    <div class="user-menu-wrapper">
      <button class="header-icon-btn" title="Account">
        <i class="fas fa-user-circle"></i>
      </button>
      <div class="user-dropdown">
        <div class="user-dropdown-header">
          <div class="user-dropdown-name">${user?.name || 'User'}</div>
          <div class="user-dropdown-role">${user?.role || ''}</div>
        </div>
        <a href="orders.html" class="user-dropdown-item"><i class="fas fa-box"></i> My Orders</a>
        <a href="wishlist.html" class="user-dropdown-item"><i class="fas fa-heart"></i> Wishlist</a>
        <div class="user-dropdown-divider"></div>
        ${Auth.isAdmin() ? '<a href="admin.html" class="user-dropdown-item"><i class="fas fa-shield-alt"></i> Admin Panel</a><div class="user-dropdown-divider"></div>' : ''}
        <button class="user-dropdown-item" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Logout</button>
      </div>
    </div>`;
  } else {
    html += `<button class="header-icon-btn" onclick="openLoginModal()" title="Login"><i class="fas fa-user"></i></button>`;
  }
  return html;
}

// =====================================================
// LOGIN MODAL
// =====================================================
function openLoginModal() {
  let modal = document.getElementById('login-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'login-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-box">
        <div class="modal-header">
          <div class="modal-title">Sign In</div>
          <button class="modal-close" onclick="closeLoginModal()"><i class="fas fa-times"></i></button>
        </div>
        <form id="modal-login-form">
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="modal-email" placeholder="your@email.com" required>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" id="modal-password" placeholder="••••••••" required>
          </div>
          <button type="submit" class="auth-btn" style="margin-top:8px">Sign In</button>
          <p style="text-align:center;margin-top:16px;font-size:14px;color:var(--text-muted)">
            No account? <a href="register.html" style="color:var(--primary);font-weight:600">Register here</a>
          </p>
        </form>
      </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) closeLoginModal(); });
    document.getElementById('modal-login-form').addEventListener('submit', async e => {
      e.preventDefault();
      const email = document.getElementById('modal-email').value;
      const pass = document.getElementById('modal-password').value;
      try {
        const data = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password: pass }) });
        Auth.save(data.token, data.user);
        closeLoginModal();
        Toast.success(`Welcome back, ${data.user.name}!`);
        updateHeaderAuth();
        updateCartBadge();
        // Reload current page logic if needed
        if (typeof onLoginSuccess === 'function') onLoginSuccess();
      } catch (err) { Toast.error(err.message || 'Login failed. Check credentials.'); }
    });
  }
  setTimeout(() => modal.classList.add('active'), 10);
}

function closeLoginModal() {
  const modal = document.getElementById('login-modal');
  if (modal) { modal.classList.remove('active'); setTimeout(() => modal.remove(), 300); }
}

function logout() {
  Auth.clear();
  updateHeaderAuth();
  Toast.info('You have been logged out.');
  if (window.location.pathname.includes('orders') || window.location.pathname.includes('wishlist') || window.location.pathname.includes('checkout')) {
    window.location.href = 'index.html';
  }
}

// =====================================================
// QUICK ADD TO CART
// =====================================================
async function quickAddToCart(productId) {
  if (!Auth.isLoggedIn()) { openLoginModal(); return; }
  try {
    await apiFetch('/cart', { method: 'POST', body: JSON.stringify({ productId, quantity: 1 }) });
    Toast.success('Added to cart!');
    updateCartBadge();
  } catch (err) {
    Toast.error(err.message || 'Could not add to cart.');
  }
}

// =====================================================
// WISHLIST TOGGLE
// =====================================================
let _wishlistCache = null;

async function getWishlist() {
  if (!Auth.isLoggedIn()) return { items: [] };
  if (_wishlistCache) return _wishlistCache;
  const data = await apiFetch('/wishlist');
  _wishlistCache = data;
  return data;
}

async function toggleWishlist(productId, btn) {
  if (!Auth.isLoggedIn()) { openLoginModal(); return; }
  const wl = await getWishlist().catch(() => ({ items: [] }));
  const existing = wl.items.find(i => i.product && i.product.id === productId);
  try {
    if (existing) {
      await apiFetch(`/wishlist/${existing.id}`, { method: 'DELETE' });
      _wishlistCache = null;
      Toast.info('Removed from wishlist');
      if (btn) { btn.classList.remove('active'); btn.innerHTML = '<i class="far fa-heart"></i>'; }
    } else {
      const res = await apiFetch('/wishlist', { method: 'POST', body: JSON.stringify({ productId }) });
      _wishlistCache = res;
      Toast.success('Added to wishlist!');
      if (btn) { btn.classList.add('active'); btn.innerHTML = '<i class="fas fa-heart"></i>'; }
    }
  } catch (err) { Toast.error(err.message || 'Wishlist error.'); }
}

// =====================================================
// NEWSLETTER SUBSCRIPTION
// =====================================================
async function subscribeNewsletter(email) {
  if (!email || !email.includes('@')) { Toast.warning('Enter a valid email.'); return; }
  try {
    await apiFetch('/newsletter/subscribe', { method: 'POST', body: JSON.stringify({ email }) });
    Toast.success('Subscribed successfully! 🎉');
    return true;
  } catch (err) {
    Toast.error(err.message || 'Subscription failed.');
    return false;
  }
}

// =====================================================
// NAVBAR MOBILE TOGGLE
// =====================================================
function initMobileNav() {
  const bar = document.getElementById('bar');
  const navbar = document.getElementById('navbar');
  if (!bar || !navbar) return;
  bar.addEventListener('click', () => {
    navbar.classList.toggle('open');
    bar.className = navbar.classList.contains('open') ? 'fas fa-times' : 'fas fa-bars';
  });
  // Close on outside click
  document.addEventListener('click', e => {
    if (!e.target.closest('#navbar') && !e.target.closest('#mobile')) {
      navbar.classList.remove('open');
      bar.className = 'fas fa-bars';
    }
  });
}

// =====================================================
// SCROLL HEADER EFFECT
// =====================================================
function initScrollHeader() {
  const header = document.getElementById('header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
  });
}

// =====================================================
// INIT HEADER
// =====================================================
function initHeader() {
  // Build header actions
  const actionsDiv = document.getElementById('header-actions');
  if (actionsDiv) actionsDiv.innerHTML = buildHeaderActions();
  initScrollHeader();
  initMobileNav();
  updateCartBadge();
  // Newsletter wiring
  document.querySelectorAll('#newsletter button, .newsletter-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const inp = btn.closest('#newsletter, .newsletter-form')?.querySelector('input[type="text"], input[type="email"]');
      if (inp) await subscribeNewsletter(inp.value.trim());
    });
  });
}

// =====================================================
// HOME PAGE
// =====================================================
async function initHomePage() {
  initHeader();
  const [wl] = await Promise.all([
    Auth.isLoggedIn() ? getWishlist().catch(() => ({ items: [] })) : Promise.resolve({ items: [] })
  ]);
  const wishlistIds = wl.items ? wl.items.map(i => i.product?.id) : [];

  // Featured products
  const featuredContainer = document.getElementById('featured-products-container');
  if (featuredContainer) {
    try {
      const products = await apiFetch('/products/featured');
      if (products && products.length > 0) {
        featuredContainer.innerHTML = products.slice(0, 8).map(p => renderProductCard(p, wishlistIds)).join('');
      } else {
        featuredContainer.innerHTML = '<p style="color:var(--text-muted);padding:20px">No featured products yet.</p>';
      }
    } catch { featuredContainer.innerHTML = '<p style="color:var(--text-muted);padding:20px">Could not load products.</p>'; }
  }

  // New arrivals
  const newContainer = document.getElementById('new-arrivals-container');
  if (newContainer) {
    try {
      const products = await apiFetch('/products/new-arrivals');
      if (products && products.length > 0) {
        newContainer.innerHTML = products.slice(0, 8).map(p => renderProductCard(p, wishlistIds)).join('');
      } else {
        newContainer.innerHTML = '<p style="color:var(--text-muted);padding:20px">No new arrivals yet.</p>';
      }
    } catch { newContainer.innerHTML = '<p style="color:var(--text-muted);padding:20px">Could not load products.</p>'; }
  }

  // Hero Shop Now button
  const heroBtn = document.querySelector('#hero button');
  if (heroBtn) heroBtn.onclick = () => window.location.href = 'shop.html';
}

// =====================================================
// SHOP PAGE
// =====================================================
let shopState = { page: 0, size: 12, category: null, search: '', sort: 'default', totalPages: 1 };

async function initShopPage() {
  initHeader();
  const wl = Auth.isLoggedIn() ? await getWishlist().catch(() => ({ items: [] })) : { items: [] };
  const wishlistIds = wl.items ? wl.items.map(i => i.product?.id) : [];

  // Load categories into sidebar
  await loadCategoryFilters();
  // Load products
  await loadShopProducts(wishlistIds);

  // Search
  const searchInput = document.getElementById('shop-search-input');
  if (searchInput) {
    let timer;
    searchInput.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        shopState.search = searchInput.value.trim();
        shopState.page = 0;
        loadShopProducts(wishlistIds);
      }, 400);
    });
  }

  // Sort
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      shopState.sort = sortSelect.value;
      shopState.page = 0;
      loadShopProducts(wishlistIds);
    });
  }
}

async function loadCategoryFilters() {
  const container = document.getElementById('category-filter-list');
  if (!container) return;
  try {
    const cats = await apiFetch('/categories');
    container.innerHTML = `<button class="category-filter-item active" data-id="" onclick="filterByCategory('', this)">
      <i class="fas fa-th-large" style="color:var(--primary);font-size:13px"></i> All Categories
    </button>` + cats.map(c => `
      <button class="category-filter-item" data-id="${c.id}" onclick="filterByCategory(${c.id}, this)">
        <i class="fas fa-tag" style="color:var(--text-muted);font-size:12px"></i> ${c.name}
      </button>`).join('');
  } catch { container.innerHTML = '<p style="font-size:13px;color:var(--text-muted)">Categories unavailable</p>'; }
}

function filterByCategory(id, btn) {
  shopState.category = id || null;
  shopState.page = 0;
  document.querySelectorAll('.category-filter-item').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  loadShopProducts();
}

async function loadShopProducts(wishlistIds = []) {
  const container = document.getElementById('shop-products-container');
  const countEl = document.getElementById('products-count');
  if (!container) return;

  container.innerHTML = Array(6).fill(`<div class="pro skeleton" style="height:280px"></div>`).join('');

  let url = `/products?page=${shopState.page}&size=${shopState.size}`;
  if (shopState.category) url += `&category=${shopState.category}`;
  if (shopState.search) url += `&search=${encodeURIComponent(shopState.search)}`;

  try {
    const data = await apiFetch(url);
    const products = data.content || [];
    shopState.totalPages = data.totalPages || 1;
    const total = data.totalElements || products.length;
    if (countEl) countEl.textContent = `${total} product${total !== 1 ? 's' : ''} found`;
    if (products.length === 0) {
      container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px 20px">
        <i class="fas fa-search" style="font-size:48px;color:var(--border);margin-bottom:16px;display:block"></i>
        <h3 style="color:var(--text-muted)">No products found</h3>
        <p>Try a different search or category</p>
      </div>`;
    } else {
      container.innerHTML = products.map(p => renderProductCard(p, wishlistIds)).join('');
    }
    renderPagination();
  } catch { container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px"><p>Could not load products. Is the server running?</p></div>`; }
}

function renderPagination() {
  const el = document.getElementById('shop-pagination');
  if (!el) return;
  let html = '';
  if (shopState.page > 0) html += `<button onclick="changePage(${shopState.page - 1})"><i class="fas fa-chevron-left"></i></button>`;
  for (let i = 0; i < shopState.totalPages; i++) {
    html += `<button class="${i === shopState.page ? 'active' : ''}" onclick="changePage(${i})">${i + 1}</button>`;
  }
  if (shopState.page < shopState.totalPages - 1) html += `<button onclick="changePage(${shopState.page + 1})"><i class="fas fa-chevron-right"></i></button>`;
  el.innerHTML = html;
}

function changePage(page) {
  shopState.page = page;
  loadShopProducts();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =====================================================
// PRODUCT DETAIL PAGE
// =====================================================
async function initProductPage() {
  initHeader();
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  if (!productId) { Toast.error('No product ID found.'); return; }

  try {
    const product = await apiFetch(`/products/${productId}`);
    renderProductDetails(product);

    // Check wishlist state
    if (Auth.isLoggedIn()) {
      try {
        const wlCheck = await apiFetch(`/wishlist/check/${productId}`);
        const wishBtn = document.getElementById('product-wishlist-btn');
        if (wishBtn && wlCheck.inWishlist) {
          wishBtn.classList.add('active');
          wishBtn.innerHTML = '<i class="fas fa-heart"></i>';
        }
      } catch {}
    }

    // Load related products
    const relatedContainer = document.getElementById('related-products-container');
    if (relatedContainer) {
      try {
        const related = await apiFetch(`/products/${productId}/related`);
        if (related.length > 0) {
          relatedContainer.innerHTML = related.map(p => renderProductCard(p)).join('');
        } else {
          relatedContainer.closest('section')?.remove();
        }
      } catch {}
    }
  } catch (err) {
    Toast.error('Product not found.');
    const detailsEl = document.getElementById('prodetails');
    if (detailsEl) detailsEl.innerHTML = '<p style="padding:40px;color:var(--text-muted)">Product not available.</p>';
  }
}

function renderProductDetails(p) {
  const imgs = p.imageUrls || [];
  const mainImgSrc = imgs[0] || 'images/products/f1.jpg';

  // Main image
  const mainImg = document.getElementById('mainimg');
  if (mainImg) mainImg.src = mainImgSrc;

  // Small images
  const smallGroup = document.querySelector('.small-img-group');
  if (smallGroup) {
    if (imgs.length > 1) {
      smallGroup.innerHTML = imgs.slice(0, 4).map((url, i) =>
        `<div class="small-img-col ${i === 0 ? 'active' : ''}">
          <img src="${url}" width="100%" class="small-img" alt="img ${i+1}" onerror="this.src='images/products/f1.jpg'">
        </div>`).join('');
      document.querySelectorAll('.small-img').forEach((img, i) => {
        img.addEventListener('click', () => {
          const main = document.getElementById('mainimg');
          if (main) main.src = img.src;
          document.querySelectorAll('.small-img-col').forEach(c => c.classList.remove('active'));
          img.closest('.small-img-col')?.classList.add('active');
        });
      });
    } else {
      smallGroup.innerHTML = '';
    }
  }

  // Category tag
  const catTag = document.getElementById('product-category-tag');
  if (catTag) catTag.textContent = p.category?.name || '';

  // Title
  const title = document.getElementById('product-title');
  if (title) title.textContent = p.name;

  // Price
  const priceEl = document.getElementById('product-price');
  if (priceEl) priceEl.textContent = `৳${Number(p.price).toFixed(2)}`;

  // Rating
  const ratingEl = document.getElementById('product-stars');
  const ratingScore = document.getElementById('product-rating-score');
  if (ratingEl) ratingEl.innerHTML = renderStars(p.rating || 5);
  if (ratingScore) ratingScore.textContent = (p.rating || 5).toFixed(1);

  // Availability
  const availEl = document.getElementById('product-availability');
  if (availEl) {
    if (p.stock > 0) {
      availEl.className = 'product-availability in-stock';
      availEl.innerHTML = `<i class="fas fa-circle-check"></i> In Stock (${p.stock} left)`;
    } else {
      availEl.className = 'product-availability out-of-stock';
      availEl.innerHTML = `<i class="fas fa-circle-xmark"></i> Out of Stock`;
    }
  }

  // Sizes
  const sizesEl = document.getElementById('size-options');
  if (sizesEl && p.sizes) {
    const sizes = p.sizes.split(',').map(s => s.trim()).filter(Boolean);
    if (sizes.length > 0) {
      sizesEl.innerHTML = sizes.map(s =>
        `<button class="size-btn" onclick="selectSize('${s}', this)">${s}</button>`
      ).join('');
    } else {
      sizesEl.closest('.size-selector-wrap')?.remove();
    }
  }

  // Description
  const descEl = document.getElementById('product-description');
  if (descEl) descEl.textContent = p.description || 'No description available.';

  // Meta
  const stockMeta = document.getElementById('meta-stock');
  const catMeta = document.getElementById('meta-category');
  if (stockMeta) stockMeta.textContent = p.stock > 0 ? 'In Stock' : 'Out of Stock';
  if (catMeta && p.category) catMeta.textContent = p.category.name;

  // Add to cart button
  const addBtn = document.getElementById('add-to-cart-btn');
  if (addBtn) {
    addBtn.onclick = () => addToCartFromDetail(p.id, p.name, p.stock);
  }

  // Wishlist button
  const wishBtn = document.getElementById('product-wishlist-btn');
  if (wishBtn) {
    wishBtn.onclick = () => toggleWishlist(p.id, wishBtn);
  }
}

function selectSize(size, btn) {
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  btn.dataset.selected = true;
}

async function addToCartFromDetail(productId, name, stock) {
  if (!Auth.isLoggedIn()) { openLoginModal(); return; }
  if (stock <= 0) { Toast.warning('This product is out of stock.'); return; }
  const qtyInput = document.getElementById('qty-input');
  const qty = parseInt(qtyInput?.value || '1');
  const selectedSize = document.querySelector('.size-btn.active')?.textContent?.trim() || null;
  try {
    const body = { productId, quantity: qty };
    if (selectedSize) body.size = selectedSize;
    await apiFetch('/cart', { method: 'POST', body: JSON.stringify(body) });
    Toast.success(`${name} added to cart!`);
    updateCartBadge();
  } catch (err) { Toast.error(err.message || 'Could not add to cart.'); }
}

// Qty controls
function initQtyControls() {
  const qtyInput = document.getElementById('qty-input');
  const decBtn = document.getElementById('qty-dec');
  const incBtn = document.getElementById('qty-inc');
  if (!qtyInput) return;
  if (decBtn) decBtn.onclick = () => { const v = parseInt(qtyInput.value); if (v > 1) qtyInput.value = v - 1; };
  if (incBtn) incBtn.onclick = () => { qtyInput.value = parseInt(qtyInput.value) + 1; };
}

// =====================================================
// CART PAGE
// =====================================================
async function initCartPage() {
  initHeader();
  if (!Auth.isLoggedIn()) {
    renderCartEmpty('Please login to view your cart.', true);
    return;
  }
  await loadCart();
}

async function loadCart() {
  const tbody = document.getElementById('cart-tbody');
  const subtotalEl = document.getElementById('cart-subtotal');
  const deliveryEl = document.getElementById('cart-delivery');
  const totalEl = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');

  if (!tbody) return;

  try {
    const data = await apiFetch('/cart');
    const items = data.items || [];

    if (items.length === 0) {
      renderCartEmpty();
      if (checkoutBtn) checkoutBtn.disabled = true;
      return;
    }

    tbody.innerHTML = items.map(item => `
      <tr data-item-id="${item.id}">
        <td><button class="remove-btn" onclick="removeCartItem(${item.id})"><i class="fas fa-times"></i></button></td>
        <td><img src="${item.product?.primaryImageUrl || 'images/products/f1.jpg'}" alt="${item.product?.name}" onerror="this.src='images/products/f1.jpg'"></td>
        <td style="text-align:left">
          <strong>${item.product?.name || 'Product'}</strong>
          ${item.size ? `<div class="cart-item-size">Size: ${item.size}</div>` : ''}
        </td>
        <td>৳${Number(item.product?.price || 0).toFixed(2)}</td>
        <td><input type="number" value="${item.quantity}" min="1" onchange="updateCartQty(${item.id}, this.value)"></td>
        <td><strong>৳${(Number(item.product?.price || 0) * item.quantity).toFixed(2)}</strong></td>
      </tr>`).join('');

    const subtotal = items.reduce((sum, i) => sum + (Number(i.product?.price || 0) * i.quantity), 0);
    const delivery = subtotal >= 1000 ? 0 : 60;
    const total = subtotal + delivery;

    if (subtotalEl) subtotalEl.textContent = `৳${subtotal.toFixed(2)}`;
    if (deliveryEl) deliveryEl.textContent = delivery === 0 ? 'Free' : `৳${delivery.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `৳${total.toFixed(2)}`;
    if (checkoutBtn) checkoutBtn.disabled = false;
    updateCartBadge();
  } catch (err) {
    Toast.error(err.message || 'Could not load cart.');
  }
}

function renderCartEmpty(msg = 'Your cart is empty.', showLogin = false) {
  const section = document.getElementById('cart');
  if (!section) return;
  section.innerHTML = `
    <div class="cart-empty section-p1">
      <i class="fas fa-shopping-basket"></i>
      <h3>${msg}</h3>
      <p>${showLogin ? '' : 'Add some products and come back!'}</p>
      ${showLogin ? `<button class="btn-primary" onclick="openLoginModal()"><i class="fas fa-sign-in-alt"></i> Login</button>` : ''}
      <a href="shop.html" class="btn-outline" style="margin-top:12px;display:inline-flex"><i class="fas fa-store"></i> Browse Shop</a>
    </div>`;
  const addSection = document.getElementById('cart-add');
  if (addSection) addSection.style.display = 'none';
}

async function removeCartItem(id) {
  try {
    await apiFetch(`/cart/${id}`, { method: 'DELETE' });
    Toast.info('Item removed.');
    await loadCart();
  } catch (err) { Toast.error(err.message || 'Could not remove item.'); }
}

async function updateCartQty(id, qty) {
  qty = parseInt(qty);
  if (qty < 1) qty = 1;
  try {
    await apiFetch(`/cart/${id}`, { method: 'PUT', body: JSON.stringify({ quantity: qty }) });
    await loadCart();
  } catch (err) { Toast.error(err.message || 'Could not update quantity.'); }
}

// =====================================================
// CHECKOUT PAGE
// =====================================================
async function initCheckoutPage() {
  initHeader();
  if (!Auth.isLoggedIn()) { window.location.href = 'index.html'; return; }
  await loadCheckoutPreview();
  const form = document.getElementById('checkout-form');
  if (form) form.addEventListener('submit', handlePlaceOrder);
}

async function loadCheckoutPreview() {
  const container = document.getElementById('order-preview-items');
  const subtotalEl = document.getElementById('preview-subtotal');
  const deliveryEl = document.getElementById('preview-delivery');
  const totalEl = document.getElementById('preview-total');
  if (!container) return;
  try {
    const preview = await apiFetch('/orders/checkout-preview');
    const items = preview.items || [];
    container.innerHTML = items.map(item => `
      <div class="order-summary-item">
        <img class="summary-item-img" src="images/products/f1.jpg" alt="${item.productName}" onerror="this.src='images/products/f1.jpg'">
        <div class="summary-item-info">
          <div class="summary-item-name">${item.productName}</div>
          <div class="summary-item-meta">Qty: ${item.quantity} ${item.size ? `| Size: ${item.size}` : ''}</div>
        </div>
        <div class="summary-item-price">৳${Number(item.subTotal).toFixed(2)}</div>
      </div>`).join('');
    if (subtotalEl) subtotalEl.textContent = `৳${Number(preview.subtotal).toFixed(2)}`;
    if (deliveryEl) deliveryEl.textContent = Number(preview.deliveryCharge) === 0 ? 'Free' : `৳${Number(preview.deliveryCharge).toFixed(2)}`;
    if (totalEl) totalEl.textContent = `৳${Number(preview.totalAmount).toFixed(2)}`;
  } catch (err) {
    Toast.error(err.message || 'Cart is empty. Add products first.');
    window.location.href = 'cart.html';
  }
}

async function handlePlaceOrder(e) {
  e.preventDefault();
  const address = document.getElementById('shipping-address')?.value?.trim();
  const phone = document.getElementById('shipping-phone')?.value?.trim();
  const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || 'COD';
  if (!address || !phone) { Toast.warning('Fill in all shipping details.'); return; }
  try {
    const order = await apiFetch('/orders', { method: 'POST', body: JSON.stringify({ shippingAddress: address, phone, paymentMethod }) });
    Toast.success('Order placed successfully! 🎉');
    setTimeout(() => window.location.href = 'orders.html', 1500);
  } catch (err) { Toast.error(err.message || 'Could not place order.'); }
}

// =====================================================
// ORDERS PAGE
// =====================================================
async function initOrdersPage() {
  initHeader();
  if (!Auth.isLoggedIn()) { window.location.href = 'index.html'; return; }
  await loadOrders();
}

async function loadOrders() {
  const container = document.getElementById('orders-container');
  if (!container) return;
  container.innerHTML = `<div style="text-align:center;padding:60px"><div class="loader-spinner" style="margin:0 auto"></div></div>`;
  try {
    const orders = await apiFetch('/orders/my-orders');
    if (!orders || orders.length === 0) {
      container.innerHTML = `
        <div class="cart-empty">
          <i class="fas fa-box-open"></i>
          <h3>No orders yet</h3>
          <p>Your order history will appear here after your first purchase.</p>
          <a href="shop.html" class="btn-primary" style="margin-top:16px;display:inline-flex;text-decoration:none"><i class="fas fa-store"></i> Start Shopping</a>
        </div>`;
      return;
    }
    container.innerHTML = orders.map(order => renderOrderCard(order)).join('');
  } catch (err) { container.innerHTML = `<p style="text-align:center;padding:40px;color:var(--text-muted)">Could not load orders. ${err.message}</p>`; }
}

function renderOrderCard(order) {
  const items = order.items || [];
  const canCancel = order.status === 'PENDING';
  return `
    <div class="order-card">
      <div class="order-card-header">
        <div>
          <div class="order-id">Order <span>#${order.id}</span></div>
          <div class="order-date">${new Date(order.orderDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
        </div>
        <div>
          <span class="order-status-badge status-${order.status}">${order.status}</span>
          <span class="order-status-badge" style="background:#f0f0f0;color:#666;margin-left:6px">${order.paymentMethod}</span>
        </div>
      </div>
      <div class="order-card-body">
        <div class="order-items-list">
          ${items.slice(0, 3).map(item => `
            <div class="order-item-row">
              <img class="order-item-img" src="${item.product?.primaryImageUrl || 'images/products/f1.jpg'}" alt="${item.product?.name}" onerror="this.src='images/products/f1.jpg'">
              <div class="order-item-info">
                <div class="order-item-name">${item.product?.name || 'Product'}</div>
                <div class="order-item-meta">Qty: ${item.quantity}${item.size ? ' | Size: ' + item.size : ''}</div>
              </div>
              <div class="order-item-price">৳${Number(item.subTotal || 0).toFixed(2)}</div>
            </div>`).join('')}
          ${items.length > 3 ? `<p style="font-size:13px;color:var(--text-muted);margin:4px 0 0">+${items.length - 3} more item(s)</p>` : ''}
        </div>
      </div>
      <div class="order-card-footer">
        <div class="order-total-display">Total: <span class="amount">৳${Number(order.totalAmount).toFixed(2)}</span></div>
        <div class="order-actions">
          ${canCancel ? `<button class="btn-cancel" onclick="cancelOrder(${order.id}, this)"><i class="fas fa-times"></i> Cancel</button>` : ''}
        </div>
      </div>
    </div>`;
}

async function cancelOrder(id, btn) {
  if (!confirm('Are you sure you want to cancel this order?')) return;
  try {
    await apiFetch(`/orders/${id}/cancel`, { method: 'PATCH' });
    Toast.success('Order cancelled. Stock restored.');
    await loadOrders();
  } catch (err) { Toast.error(err.message || 'Could not cancel order.'); }
}

// =====================================================
// WISHLIST PAGE
// =====================================================
async function initWishlistPage() {
  initHeader();
  if (!Auth.isLoggedIn()) { window.location.href = 'index.html'; return; }
  await loadWishlistPage();
}

async function loadWishlistPage() {
  const container = document.getElementById('wishlist-container');
  const countEl = document.getElementById('wishlist-count');
  if (!container) return;
  try {
    const wl = await apiFetch('/wishlist');
    _wishlistCache = wl;
    const items = wl.items || [];
    if (countEl) countEl.textContent = `${items.length} item${items.length !== 1 ? 's' : ''}`;
    if (items.length === 0) {
      container.innerHTML = `
        <div class="cart-empty">
          <i class="fas fa-heart-crack"></i>
          <h3>Your wishlist is empty</h3>
          <p>Save products you love and buy them later.</p>
          <a href="shop.html" class="btn-primary" style="margin-top:16px;display:inline-flex;text-decoration:none"><i class="fas fa-store"></i> Browse Shop</a>
        </div>`;
      return;
    }
    container.className = 'wishlist-grid';
    container.innerHTML = items.map(item => {
      const p = item.product || {};
      return `
        <div class="wishlist-card" id="wl-item-${item.id}">
          <div class="wishlist-card-img" onclick="window.location.href='sproduct.html?id=${p.id}'" style="cursor:pointer">
            <img src="${p.primaryImageUrl || 'images/products/f1.jpg'}" alt="${p.name}" onerror="this.src='images/products/f1.jpg'">
          </div>
          <div class="wishlist-card-body">
            <div class="wishlist-card-name">${p.name}</div>
            <div class="wishlist-card-price">৳${Number(p.price || 0).toFixed(2)}</div>
            <div class="wishlist-card-actions">
              <button class="btn-primary wishlist-add-cart" onclick="quickAddToCart(${p.id})">
                <i class="fas fa-cart-plus"></i> Add to Cart
              </button>
              <button class="wishlist-remove" onclick="removeWishlistItem(${item.id})" title="Remove">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        </div>`;
    }).join('');
  } catch (err) { container.innerHTML = `<p style="padding:40px;color:var(--text-muted)">Could not load wishlist. ${err.message}</p>`; }
}

async function removeWishlistItem(id) {
  try {
    await apiFetch(`/wishlist/${id}`, { method: 'DELETE' });
    _wishlistCache = null;
    Toast.info('Removed from wishlist.');
    const el = document.getElementById(`wl-item-${id}`);
    if (el) { el.style.opacity = '0'; el.style.transform = 'scale(0.9)'; el.style.transition = '0.3s'; setTimeout(() => { el.remove(); loadWishlistPage(); }, 300); }
  } catch (err) { Toast.error(err.message || 'Could not remove item.'); }
}

// =====================================================
// CONTACT PAGE
// =====================================================
function initContactPage() {
  initHeader();
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const name = document.getElementById('contact-name')?.value?.trim();
      const emailOrPhone = document.getElementById('contact-email')?.value?.trim();
      const message = document.getElementById('contact-message')?.value?.trim();
      if (!name || !emailOrPhone || !message) { Toast.warning('Please fill in all fields.'); return; }
      try {
        await apiFetch('/contact', { method: 'POST', body: JSON.stringify({ name, emailOrPhone, message }) });
        Toast.success('Message sent! We\'ll get back to you soon. 📩');
        form.reset();
      } catch (err) { Toast.error(err.message || 'Could not send message. Try again.'); }
    });
  }
}

// =====================================================
// BLOG PAGE
// =====================================================
async function initBlogPage() {
  initHeader();
  // Kept static for now since /api/blogs is a nice-to-have
}

// =====================================================
// ABOUT PAGE
// =====================================================
function initAboutPage() {
  initHeader();
}

// =====================================================
// AUTH PAGES
// =====================================================
async function initLoginPage() {
  if (Auth.isLoggedIn()) { window.location.href = 'index.html'; return; }
  const form = document.getElementById('login-form');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const email = document.getElementById('login-email')?.value;
      const pass = document.getElementById('login-password')?.value;
      const btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Signing in...'; }
      try {
        const data = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password: pass }) });
        Auth.save(data.token, data.user);
        Toast.success(`Welcome back, ${data.user.name}!`);
        setTimeout(() => window.location.href = 'index.html', 800);
      } catch (err) {
        Toast.error(err.message || 'Invalid credentials.');
        if (btn) { btn.disabled = false; btn.textContent = 'Sign In'; }
      }
    });
  }
}

async function initRegisterPage() {
  if (Auth.isLoggedIn()) { window.location.href = 'index.html'; return; }
  const form = document.getElementById('register-form');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const name = document.getElementById('reg-name')?.value;
      const email = document.getElementById('reg-email')?.value;
      const phone = document.getElementById('reg-phone')?.value;
      const password = document.getElementById('reg-password')?.value;
      const btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Creating account...'; }
      try {
        await apiFetch('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, phone, password }) });
        Toast.success('Account created! Please sign in.');
        setTimeout(() => window.location.href = 'login.html', 1000);
      } catch (err) {
        Toast.error(err.message || 'Registration failed.');
        if (btn) { btn.disabled = false; btn.textContent = 'Create Account'; }
      }
    });
  }
}

// =====================================================
// PAGE DETECTOR — Auto-initialize
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';

  if (page === 'index.html' || page === '' || page === '/') {
    initHomePage();
  } else if (page === 'shop.html') {
    initShopPage();
  } else if (page === 'sproduct.html') {
    initProductPage();
    initQtyControls();
  } else if (page === 'cart.html') {
    initCartPage();
  } else if (page === 'checkout.html') {
    initCheckoutPage();
  } else if (page === 'orders.html') {
    initOrdersPage();
  } else if (page === 'wishlist.html') {
    initWishlistPage();
  } else if (page === 'contact.html') {
    initContactPage();
  } else if (page === 'blog.html') {
    initBlogPage();
  } else if (page === 'about.html') {
    initAboutPage();
  } else if (page === 'login.html') {
    initLoginPage();
  } else if (page === 'register.html') {
    initRegisterPage();
  } else {
    // Fallback: always init header
    initHeader();
  }
});
