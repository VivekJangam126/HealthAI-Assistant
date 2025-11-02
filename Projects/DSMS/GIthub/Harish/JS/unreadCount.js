// Fetch unread notifications count and update sidebar badge
(function () {
  async function fetchUnread() {
    try {
      const res = await fetch('/api/notifications/unreadCount', { credentials: 'include' });
      if (!res.ok) return console.warn('unreadCount fetch failed', res.status);
      const data = await res.json();
      if (!data || typeof data.count !== 'number') return;
      updateBadge(data.count);
    } catch (err) {
      // Don't break the app if notifications endpoint fails
      console.debug('unreadCount error', err);
    }
  }

  function updateBadge(count) {
    // primary id used by templates
    const el = document.getElementById('notification-count') || document.querySelector('.notification-badge');
    if (!el) return;
    const n = Number(count) || 0;
    el.textContent = n > 0 ? String(n) : '';
    el.style.display = n > 0 ? 'inline-block' : 'none';
    // also update notifications center explicit unread count if present
    const center = document.getElementById('unread-count');
    if (center) center.textContent = n;
  }

  // expose for other scripts to call after they mark notifications read
  window.refreshUnreadCount = fetchUnread;

  // initial fetch on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchUnread);
  } else {
    fetchUnread();
  }
})();
