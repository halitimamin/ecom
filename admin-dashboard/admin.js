(function () {
  'use strict';

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmtDate = (iso) => {
    const d = new Date(iso);
    return isNaN(d) ? '' : d.toLocaleString();
  };
  const fmtMoney = (n) => {
    const v = Number(n);
    if (!isFinite(v)) return '$0';
    const r = Math.round(v * 100) / 100;
    return '$' + (Number.isInteger(r) ? r.toFixed(0) : r.toFixed(2));
  };
  const toast = (msg) => {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 1800);
  };

  async function fetchOrders() {
    const res = await fetch(SUPABASE_URL + '/rest/v1/orders?select=id,total,status,created_at,confirmed_at,order_items(id,name,price,qty)&order=id.desc', {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json();
  }

  async function confirmOrder(id) {
    const res = await fetch(SUPABASE_URL + '/rest/v1/orders?id=eq.' + encodeURIComponent(String(id)), {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'confirmed', confirmed_at: new Date().toISOString() })
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
  }

  function render(orders) {
    const list = document.getElementById('orders-list');
    document.getElementById('stat-total').textContent = orders.length;
    document.getElementById('stat-pending').textContent = orders.filter((o) => o.status !== 'confirmed').length;
    document.getElementById('stat-confirmed').textContent = orders.filter((o) => o.status === 'confirmed').length;
    if (!orders.length) {
      list.innerHTML = '<p class="empty-note">No orders yet. Customers place orders on the shop — they appear here in real time.</p>';
      return;
    }
    list.innerHTML = orders.map((o) => {
      const items = (o.order_items || []).map((it) => `<span class="order-item">${esc(it.name)} × ${esc(it.qty)}</span>`).join('');
      const isConfirmed = o.status === 'confirmed';
      return `
        <div class="order-card">
          <div class="order-head">
            <h3>Order #${esc(o.id)}</h3>
            <span class="status ${isConfirmed ? 'confirmed' : 'pending'}">${esc(o.status || 'pending')}</span>
          </div>
          <div class="order-meta">${fmtDate(o.created_at)}</div>
          <div class="order-items">${items}</div>
          <div class="order-total">Total: ${fmtMoney(o.total)}</div>
          <button class="order-confirm" data-id="${esc(o.id)}" type="button" ${isConfirmed ? 'disabled' : ''}>
            ${isConfirmed ? 'Confirmed' : 'Confirm'}
          </button>
        </div>`;
    }).join('');

    list.addEventListener('click', async (e) => {
      const btn = e.target.closest('.order-confirm');
      if (!btn || btn.disabled) return;
      const id = btn.dataset.id;
      btn.disabled = true;
      try {
        await confirmOrder(id);
        toast('Order #' + id + ' confirmed');
      } catch (err) {
        toast('Could not confirm: ' + err.message);
        btn.disabled = false;
        return;
      }
      render(await fetchOrders());
    });
  }

  async function refresh() {
    try {
      render(await fetchOrders());
    } catch (e) {
      toast('Could not load orders: ' + e.message);
    }
  }

  document.getElementById('refresh-btn').addEventListener('click', refresh);
  document.addEventListener('DOMContentLoaded', refresh);
})();
