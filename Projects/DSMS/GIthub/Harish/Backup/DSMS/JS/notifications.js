/* notifications.js - frontend for notifications.html
   Fetches /api/notifications, renders cards, handles mark-as-read and mark-all.
*/
document.addEventListener('DOMContentLoaded', async () => {
  const listEl = document.getElementById('notification-list');
  const unreadCountEl = document.getElementById('unread-count');
  const sidebarBadge = document.getElementById('notification-count');
  const markAllBtn = document.getElementById('mark-all-read');

  async function loadNotifications() {
    try {
      const res = await fetch('/api/notifications', { credentials: 'include' });
      if (res.status === 401) { window.location.href = '/HTML/auth.html'; return; }
      const data = await res.json();
      if (!data.success) return console.error('Failed to load notifications', data);
      renderNotifications(data.notifications || []);
    } catch (err) { console.error('Load notifications failed', err); }
  }

  function timeAgo(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    const diff = Date.now() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  }

  function createCard(n) {
    const card = document.createElement('div');
    card.className = `notification-card ${n.isRead ? 'read' : 'unread'}`;

    const dot = document.createElement('div');
    dot.className = `notification-status-dot ${n.isRead ? 'dot-read' : 'dot-unread'}`;

    const wrapper = document.createElement('div');
    wrapper.className = 'notification-content-wrapper';
    const p = document.createElement('p');
    p.className = 'notification-message';
    p.innerHTML = escapeHtml(n.message || '');
    const ts = document.createElement('span'); ts.className = `notification-timestamp ${n.isRead ? 'read-timestamp' : ''}`; ts.textContent = timeAgo(n.timestamp);
    wrapper.appendChild(p); wrapper.appendChild(ts);

    const control = document.createElement('div');
    if (!n.isRead) {
      const btn = document.createElement('button'); btn.className = 'mark-read-btn btn-text-accent'; btn.textContent = 'Mark as Read';
      btn.addEventListener('click', async () => { await markAsRead(n.id); });
      control.appendChild(btn);
    } else {
      const span = document.createElement('span'); span.className = 'notification-status-text'; span.textContent = 'Read'; control.appendChild(span);
    }

    card.appendChild(dot); card.appendChild(wrapper); card.appendChild(control);
    return card;
  }

  function escapeHtml(s) { if (!s) return ''; return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

  function renderNotifications(arr) {
    listEl.innerHTML = '';
    const unread = arr.filter(n => !n.isRead);
    unreadCountEl.textContent = unread.length || 0;
    if (sidebarBadge) sidebarBadge.style.display = unread.length ? 'inline-block' : 'none';
    if (!arr.length) {
      listEl.innerHTML = '<div class="content-card"><p style="color:var(--color-text-muted);padding:12px">No notifications</p></div>';
      return;
    }

    arr.forEach(n => listEl.appendChild(createCard(n)));
  }

  async function markAsRead(id) {
    try {
      const res = await fetch(`/api/notifications/${encodeURIComponent(id)}/read`, { method: 'PATCH', credentials: 'include' });
      const data = await res.json().catch(()=>({}));
      if (res.ok && data.success) { await loadNotifications(); }
      else alert('Failed to mark read');
    } catch (err) { console.error('markAsRead failed', err); }
  }

  async function markAllRead() {
    try {
      const res = await fetch('/api/notifications/markAllRead', { method: 'POST', credentials: 'include' });
      const data = await res.json().catch(()=>({}));
      if (res.ok && data.success) { await loadNotifications(); }
      else alert('Failed to mark all read');
    } catch (err) { console.error('markAllRead failed', err); }
  }

  markAllBtn?.addEventListener('click', async () => { if (!confirm('Mark all notifications as read?')) return; await markAllRead(); });

  await loadNotifications();
});
