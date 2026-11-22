(function () {
  'use strict';

  const KEY = 'userOrders';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function loadOrders() {
    try {
      const raw = localStorage.getItem(KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveOrders(orders) {
    try { localStorage.setItem(KEY, JSON.stringify(orders)); } catch (e) { /* ignore */ }
  }

  function fmtDate(iso) {
    const d = new Date(iso);
    return isNaN(d) ? '—' : d.toLocaleString();
  }

  function toast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 1800);
  }

  function renderStats(orders) {
    document.getElementById('stat-total').textContent = orders.length;
    document.getElementById('stat-pending').textContent = orders.filter((o) => o.status !== 'confirmed').length;
    document.getElementById('stat-confirmed').textContent = orders.filter((o) => o.status === 'confirmed').length;
  }

  function renderOrder(order) {
    const items = (order.items || []).map((i) => `<span class="order-item">${esc(i.name)} × ${esc(i.qty)}</span>`).join('');
    const statusClass = order.status === 'confirmed' ? 'confirmed' : 'pending';
    return `
      <div class="order-card">
        <div class="order-head">
          <h3>${esc(order.id)}</h3>
          <span class="status ${statusClass}">${esc(order.status)}</span>
        </div>
        <p class="order-meta">${fmtDate(order.date)}</p>
        <div class="order-items">${items}</div>
        <div class="order-total">Total: ${esc(order.total || '0.00')}</div>
        <button class="order-confirm" data-id="${esc(order.id)}" type="button">
          ${order.status === 'confirmed' ? 'Confirmed ✓' : 'Confirm command'}
        </button>
      </div>`;
  }

  function render() {
    const orders = loadOrders();
    renderStats(orders);
    const list = document.getElementById('orders-list');
    const emptyNote = document.getElementById('empty-note');
    if (!orders.length) {
      list.innerHTML = '';
      emptyNote.style.display = 'block';
      return;
    }
    emptyNote.style.display = 'none';
    list.innerHTML = orders.map(renderOrder).join('');
    list.addEventListener('click', (e) => {
      const btn = e.target.closest('.order-confirm');
      if (!btn) return;
      const id = btn.dataset.id;
      const current = loadOrders();
      const order = current.find((o) => o.id === id);
      if (order) {
        order.status = 'confirmed';
        order.confirmedAt = new Date().toISOString();
        saveOrders(current);
        toast('Order ' + id + ' confirmed');
      }
      render();
    });
  }

  document.getElementById('refresh-btn').addEventListener('click', render);
  document.addEventListener('DOMContentLoaded', render);
})();
