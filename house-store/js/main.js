(function () {
  'use strict';

  const STORE_KEY = 'houseStore.cart';

  // ------------------------------------------------ fake data
  const PRODUCTS = [
    { id: 1, name: 'Mid-century Modern Sofa', category: 'Living Room', price: 899.99, tone: '#b8542e', stock: 12,
      desc: 'A sculptural silhouette with clean lines, a deep cushion and a walnut frame that blends with modern and classic interiors alike.' },
    { id: 2, name: 'Velvet Armchair', category: 'Living Room', price: 249.5, tone: '#2f7d6f', stock: 7,
      desc: 'Plush velvet upholstery, a rolled arm and a supportive frame that hugs the seating you want.' },
    { id: 3, name: 'Minimalist Bookcase', category: 'Living Room', price: 410, tone: '#6a5a8a', stock: 5,
      desc: 'A clean-line unit with three shelves, finished in warm walnut with a subtle grain.' },
    { id: 4, name: 'Cloud Throws & Pillows Set', category: 'Bedroom', price: 89.99, tone: '#7a5c35', stock: 20,
      desc: 'Soft cloud-like pillows and a chunky-knit throw for a layered, cozy look.' },
    { id: 5, name: 'Cotton Bedding Sheet Set', category: 'Bedroom', price: 129, tone: '#3e6b5a', stock: 14,
      desc: 'Crisp 100% cotton sheets: fitted bottom, flat top and classic corner buttons.' },
    { id: 6, name: 'Platform Bed Frame – King', category: 'Bedroom', price: 1199, tone: '#8c3a3a', stock: 3,
      desc: 'Modern platform frame with slatted support. Fits a King mattress.' },
    { id: 7, name: 'Ceramic Coffee Mug Set (Set of 6)', category: 'Kitchen', price: 32, tone: '#9c8a3b', stock: 25,
      desc: 'Matte-finish ceramic mugs in warm tones with ergonomic handles that fit your hand.' },
    { id: 8, name: 'Bamboo Cutting Board Set', category: 'Kitchen', price: 67.5, tone: '#456e8d', stock: 9,
      desc: 'A trio of natural bamboo boards for slicing, dicing and serving.' },
    { id: 9, name: 'Manual Coffee Grinder', category: 'Kitchen', price: 118, tone: '#bd6b7a', stock: 4,
      desc: 'Cast-iron manual grinder with a brushed metal body, giving fresh grinds for pour-over coffee.' },
    { id: 10, name: 'Cast Iron Skillet', category: 'Kitchen', price: 48.99, tone: '#5a6e6f', stock: 16,
      desc: 'A solid cast iron skillet, pre-seasoned for multiple uses — perfect for searing and sautéing.' },
    { id: 11, name: 'Bath Sheet Set (2 pcs)', category: 'Bathroom', price: 55.5, tone: '#b8542e', stock: 8,
      desc: 'Fluffy, absorbent bath sheets in soft teal, sold as a set of two.' },
    { id: 12, name: 'Wall-Mounted Faucet', category: 'Bathroom', price: 189.99, tone: '#2f7d6f', stock: 2,
      desc: 'A modern single-spray wall faucet in polished brass, with a deck-mount spout and hand shower.' },
    { id: 13, name: 'Hammam Soap Dish + Sponge Set', category: 'Bathroom', price: 28, tone: '#6a5a8a', stock: 11,
      desc: 'Hand-glazed ceramic soap dish with a natural sea sponge, for a Spa-like feel.' },
    { id: 14, name: 'Bathtub Caddy', category: 'Bathroom', price: 65, tone: '#7a5c35', stock: 6,
      desc: 'A padded caddy for your bathtub with storage compartments for books, glass and tea.' },
    { id: 15, name: 'Stackable Storage Bins Set', category: 'Storage', price: 74.99, tone: '#9c8a3b', stock: 10,
      desc: 'Three stackable clear bins in a matte finish, great for linen or pantry storage.' },
    { id: 16, name: 'Compact Folding Garden Bench', category: 'Garden', price: 650, tone: '#456e8d', stock: 1,
      desc: 'A space-saving bench with an aluminum frame and padded seat — perfect for a patio or small yard.' },
    { id: 17, name: 'Indoor Planter Box', category: 'Garden', price: 88, tone: '#8c3a3a', stock: 7,
      desc: 'A modern planter box in matte terracotta, with drainage holes for a small succulent.' },
    { id: 18, name: 'Rattan Wall Mirror', category: 'Decor', price: 180, tone: '#bd6b7a', stock: 4,
      desc: 'A hand-woven rattan mirror with a natural fiber edge — great for adding texture to any wall.' },
    { id: 19, name: 'Macramé Plant Hanger', category: 'Decor', price: 22.5, tone: '#5a6e6f', stock: 18,
      desc: 'A hand-knotted macramé plant hanger with a swagger of color — ideal for hanging a trailing plant.' },
  ];

  const CATEGORY_TONE = {
    'Living Room': '#b8542e',
    Bedroom: '#2f7d6f',
    Kitchen: '#3e6b5a',
    Bathroom: '#8c3a3a',
    Garden: '#9c8a3b',
    Decor: '#456e8d',
    Storage: '#bd6b7a',
  };

  // ------------------------------------------------ helpers
  const escMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  function esc(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, (c) => escMap[c]);
  }

  function imgUrl(w, h, tone, label) {
    const text = label
      ? '<text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" ' +
        'font-family="system-ui, sans-serif" font-size="22" font-weight="600" fill="#fff" opacity="0.85">' +
        esc(String(label).slice(0, 30)) + '</text>'
      : '';
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">' +
      '<rect width="' + w + '" height="' + h + '" fill="' + tone + '"/>' +
      '<ellipse cx="' + Math.round(w / 2) + '" cy="' + Math.round(h / 4) + '" rx="' + Math.round(w / 3) + '" ry="' + Math.round(h / 10) + '" fill="#fff" opacity="0.2"/>' +
      text + '</svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  function productImage(p, w, h) {
    if (p && p.image) return p.image;
    return 'images/product-' + (p && p.id) + '.png';
  }

  function formatMoney(n) {
    const v = Math.round(n * 100) / 100;
    return '$' + (Number.isInteger(v) ? v.toFixed(0) : v.toFixed(2));
  }

  function setEl(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  // ------------------------------------------------ cart
  function getCart() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(cart)); } catch (e) { /* ignore */ }
  }

  function cartTotal(cart) {
    return cart.reduce((sum, it) => sum + (it.price || 0) * (it.qty || 1), 0);
  }

  function cartQty(id) {
    const item = getCart().find((i) => i.id === id);
    return item ? item.qty : 0;
  }

  function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (!badge) return;
    const n = getCart().length;
    badge.hidden = n === 0;
    badge.textContent = n;
  }

  function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 1800);
  }

  function addToCart(id, qty) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) return;
    const q = Math.max(1, Math.min(99, parseInt(qty || 1, 10) || 1));
    const cart = getCart();
    const found = cart.find((i) => i.id === p.id);
    if (found) {
      found.qty += q;
    } else {
      cart.push({ id: p.id, name: p.name, price: p.price, category: p.category, tone: p.tone, qty: q });
    }
    saveCart(cart);
    updateCartBadge();
    showToast('Added ' + (q > 1 ? q + 'x ' : '') + p.name + ' to your cart');
  }

  function setQty(id, qty) {
    const cart = getCart();
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    item.qty = Math.max(1, Math.min(99, parseInt(qty, 10) || 1));
    saveCart(cart);
    if (document.getElementById('cart-items')) renderCartPage();
  }

  function removeItem(id) {
    saveCart(getCart().filter((i) => i.id !== id));
    updateCartBadge();
    if (document.getElementById('cart-items')) renderCartPage();
  }

  function clearCart() {
    saveCart([]);
    updateCartBadge();
  }

  // ------------------------------------------------ rendering: shared pieces
  function cardHtml(p) {
    const href = 'product.html?id=' + encodeURIComponent(p.id);
    return `
    <article class="product-card">
      <a class="card-media" href="${href}">
        <img src="${productImage(p, 300, 200)}" alt="${esc(p.name)}" loading="lazy">
      </a>
      <div class="card-info">
        <span class="cat-badge">${esc(p.category)}</span>
        <h3 class="card-name"><a href="${href}">${esc(p.name)}</a></h3>
        <p class="card-desc">${esc(String(p.desc || '').slice(0, 150))}</p>
        <div class="card-row">
          <span class="price">${formatMoney(p.price)}</span>
          <button class="btn btn-sm add-btn" data-id="${esc(p.id)}" type="button">Add to Cart</button>
        </div>
      </div>
    </article>`;
  }

  function renderFilterButtons() {
    const container = document.getElementById('category-filter');
    if (!container) return;
    const cats = ['all', ...Array.from(new Set(PRODUCTS.map((p) => p.category))).sort()];
    container.innerHTML = cats.map((c) =>
      `<button class="filter-btn" data-category="${esc(c)}" type="button">${c === 'all' ? 'All' : esc(c)}</button>`
    ).join('');
  }

  // ------------------------------------------------ home
  function renderHome() {
    const featured = document.getElementById('featured-grid');
    if (featured) featured.innerHTML = PRODUCTS.slice(0, 6).map(cardHtml).join('');

    const cats = Array.from(new Set(PRODUCTS.map((p) => p.category))).sort();
    const grid = document.getElementById('categories');
    if (grid) {
      grid.innerHTML = cats.map((cat) => (
        `<a class="category-card" href="products.html?category=${encodeURIComponent(cat)}">` +
        `<span class="cat-label">${esc(cat)}</span>` +
        `<span class="cat-count">${PRODUCTS.filter((p) => p.category === cat).length} products</span>` +
        `</a>`
      )).join('');
    }
  }

  // ------------------------------------------------ products page
  const state = { category: 'all', search: '' };

  function filteredProducts() {
    const cat = state.category;
    const search = state.search.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      const catMatch = !cat || cat === 'all' || p.category === cat;
      const searchMatch = !search || [p.name, p.category, p.desc].some((f) => f.toLowerCase().includes(search));
      return catMatch && searchMatch;
    });
  }

  function renderProductsPage() {
    const grid = document.getElementById('products-grid');
    const status = document.getElementById('grid-status');
    if (!grid) return;
    const result = filteredProducts();
    grid.innerHTML = result.map(cardHtml).join('');
    if (status) {
      status.textContent = result.length === 0
        ? 'No products match this search — try a different term or clear the filter.'
        : result.length + ' product' + (result.length === 1 ? '' : 's');
    }
  }

  function syncFilterUI() {
    const active = state.category || 'all';
    document.querySelectorAll('#category-filter .filter-btn').forEach((b) => {
      b.classList.toggle('is-active', b.dataset.category === active);
    });
  }

  function buildQuery() {
    const params = new URLSearchParams();
    if (state.category && state.category !== 'all') params.set('category', state.category);
    if (state.search) params.set('q', state.search);
    const qs = params.toString();
    return qs ? '?' + qs : '';
  }

  function updateURL() {
    history.replaceState(null, '', location.pathname + buildQuery());
  }

  function readState() {
    const params = new URLSearchParams(location.search);
    state.category = params.get('category') || 'all';
    state.search = params.get('q') || '';
    syncFilterUI();
    const input = document.getElementById('search-input');
    if (input && state.search) input.value = state.search;
    renderProductsPage();
  }

  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      state.search = searchInput.value.trim();
      updateURL();
      renderProductsPage();
    });
  }
  const searchForm = document.getElementById('search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      state.search = searchInput ? searchInput.value.trim() : state.search;
      updateURL();
      renderProductsPage();
    });
  }

  // ------------------------------------------------ product page
  function renderProductPage() {
    const params = new URLSearchParams(location.search);
    const id = parseInt(params.get('id') || '', 10);
    const p = PRODUCTS.find((x) => x.id === id);
    const main = document.querySelector('main');
    if (!p) {
      if (main) main.innerHTML = '<p>Product not found. <a href="products.html">Back to the shop</a>.</p>';
      return;
    }
    document.title = p.name + ' — House & Co.';
    const imgEl = document.getElementById('product-image');
    if (imgEl) {
      imgEl.src = productImage(p, 800, 500);
      imgEl.alt = p.name;
    }
    setEl('product-name', p.name);
    setEl('product-category', p.category);
    setEl('product-price', formatMoney(p.price));
    setEl('product-desc', p.desc);
    const stockEl = document.getElementById('product-stock');
    if (stockEl) {
      stockEl.textContent = p.stock > 0 ? 'In stock' : 'Out of stock';
      stockEl.className = p.stock > 0 ? 'stock in-stock' : 'stock out';
    }
    const addBtn = document.getElementById('add-to-cart');
    if (addBtn) addBtn.dataset.id = String(p.id);
    const related = document.getElementById('related-grid');
    if (related) {
      related.innerHTML = PRODUCTS.filter((x) => x.id !== p.id && x.category === p.category)
        .slice(0, 6).map(cardHtml).join('');
    }
  }

  function qtyFromProductPage() {
    const input = document.getElementById('qty');
    const n = parseInt(input ? input.value : '1', 10);
    return Number.isFinite(n) && n >= 1 ? n : 1;
  }

  function updateQtyButtons(n) {
    const input = document.getElementById('qty');
    if (input) input.value = Math.max(1, Math.min(99, n));
  }

  // ------------------------------------------------ cart page
  function summaryRow(label, value) {
    return '<div class="summary-row"><span>' + esc(label) + '</span><strong>' + formatMoney(value) + '</strong></div>';
  }

  function updateSummary(cart) {
    const subtotal = cartTotal(cart);
    const tax = Math.round(subtotal * 0.1);
    const shipping = subtotal >= 100 ? 0 : 5;
    const total = subtotal + tax + shipping;
    const lines = document.getElementById('summary-lines');
    if (lines) {
      lines.innerHTML = summaryRow('Subtotal', subtotal) +
        summaryRow('Tax (10%)', tax) +
        summaryRow('Shipping', shipping);
    }
    const totalEl = document.getElementById('cart-total');
    if (totalEl) totalEl.textContent = formatMoney(total);
    const btn = document.getElementById('checkout-btn');
    if (btn) btn.disabled = cart.length === 0;
  }

  function renderCartItem(item) {
    return `
    <div class="cart-item">
      <a href="product.html?id=${encodeURIComponent(item.id)}"><img src="${productImage(item, 64, 64)}" alt="${esc(item.name)}" loading="lazy"></a>
      <div class="cart-item-info">
        <h4><a href="product.html?id=${encodeURIComponent(item.id)}">${esc(item.name)}</a></h4>
        <span class="cart-item-cat">${esc(item.category)}</span>
      </div>
      <div class="qty-group">
        <button class="qty-btn qty-minus" data-id="${esc(item.id)}" type="button">&minus;</button>
        <input class="qty-input" data-id="${esc(item.id)}" type="number" min="1" max="99" value="${item.qty}">
        <button class="qty-btn qty-plus" data-id="${esc(item.id)}" type="button">&plus;</button>
      </div>
      <div class="cart-item-price">${formatMoney(item.price * item.qty)}</div>
      <button class="remove-btn" data-id="${esc(item.id)}" type="button" aria-label="Remove item">&times;</button>
    </div>`;
  }

  function renderCartPage() {
    const items = document.getElementById('cart-items');
    if (!items) return;
    const cart = getCart();
    if (cart.length === 0) {
      items.innerHTML = '<p class="empty-note">Your cart is empty. <a href="products.html">Browse the collection</a>.</p>';
    } else {
      items.innerHTML = cart.map(renderCartItem).join('');
    }
    updateSummary(cart);
  }

  // ------------------------------------------------ event delegation
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-id]');
    if (btn) {
      const id = parseInt(btn.dataset.id, 10);
      if (Number.isFinite(id) && id > 0) {
        if (btn.classList.contains('qty-minus')) {
          if (document.getElementById('product-name')) updateQtyButtons(qtyFromProductPage() - 1);
          else setQty(id, Math.max(1, cartQty(id) - 1));
        } else if (btn.classList.contains('qty-plus')) {
          if (document.getElementById('product-name')) updateQtyButtons(qtyFromProductPage() + 1);
          else setQty(id, Math.min(99, cartQty(id) + 1));
        } else if (btn.classList.contains('remove-btn')) {
          removeItem(id);
        } else {
          addToCart(id, qtyFromProductPage());
        }
      }
      return;
    }
    if (e.target.closest('#nav-toggle')) {
      const header = document.querySelector('.site-header');
      if (header) header.classList.toggle('open');
      return;
    }
    if (e.target.closest('#checkout-btn')) {
      clearCart();
      renderCartPage();
      showToast('Order received — thanks for the demo purchase!');
    }
    const filterBtn = e.target.closest('#category-filter button');
    if (filterBtn) {
      state.category = filterBtn.dataset.category || 'all';
      updateURL();
      syncFilterUI();
      renderProductsPage();
    }
  });

  // ------------------------------------------------ init per page
  function init() {
    updateCartBadge();
    renderFilterButtons();
    const page = document.body ? document.body.dataset.page : '';
    if (page === 'home') {
      renderHome();
    } else if (page === 'products') {
      readState();
    } else if (page === 'product') {
      renderProductPage();
    } else if (page === 'cart') {
      renderCartPage();
    }
  }

  init();
})();
