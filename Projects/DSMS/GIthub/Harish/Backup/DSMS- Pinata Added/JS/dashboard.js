/**
 * Frontend dashboard logic
 * Fetches /api/dashboard/summary and populates the DOM.
 */
document.addEventListener('DOMContentLoaded', async () => {
  const endpoint = '/api/dashboard/summary';
  try {
    const res = await fetch(endpoint, { credentials: 'include' });
    if (res.status === 401) {
      // Not authenticated — redirect to auth page
      window.location.href = '/HTML/auth.html';
      return;
    }

    if (!res.ok) {
      console.error('Failed to load dashboard summary', res.status);
      return;
    }

    const data = await res.json();

    // User info
    const userNameEl = document.getElementById('userName');
    const userEmailEl = document.getElementById('userEmail');
    const joinedOnEl = document.getElementById('joinedOn');
    if (userNameEl) userNameEl.textContent = data.user.fullName || '—';
    if (userEmailEl) userEmailEl.textContent = data.user.email || '—';
    if (joinedOnEl) joinedOnEl.textContent = data.user.joinedOn ? new Date(data.user.joinedOn).toLocaleString() : '—';

    // Stats
    const totalDocsEl = document.getElementById('totalDocs');
    const totalSharesEl = document.getElementById('totalShares');
    const storageUsedEl = document.getElementById('storageUsed');
    if (totalDocsEl) totalDocsEl.textContent = data.stats.totalDocs ?? 0;
    if (totalSharesEl) totalSharesEl.textContent = data.stats.totalShares ?? 0;
    if (storageUsedEl) {
      const bytes = data.stats.storageUsed ?? 0;
      const kb = (bytes / 1024).toFixed(2);
      storageUsedEl.textContent = `${kb} KB`;
    }

    // Recent logs table
    const logsTable = document.getElementById('recentLogsTable');
    if (logsTable) {
      // Clear existing rows but keep header if present
      logsTable.innerHTML = '';
      const headerRow = document.createElement('tr');
      headerRow.innerHTML = '<th>File</th><th>Action</th><th>When</th>';
      logsTable.appendChild(headerRow);

      (data.recentLogs || []).forEach(log => {
        const row = document.createElement('tr');
        const fileName = log.fileName || log.name || '—';
        const action = log.action || '—';
        const when = log.timestamp ? new Date(log.timestamp).toLocaleString() : '—';
        row.innerHTML = `<td>${escapeHtml(fileName)}</td><td>${escapeHtml(action)}</td><td>${escapeHtml(when)}</td>`;
        logsTable.appendChild(row);
      });
    }

    // Notifications list
    const notifList = document.getElementById('notificationsList');
    if (notifList) {
      notifList.innerHTML = '';
      (data.notifications || []).forEach(n => {
        const li = document.createElement('li');
        const msg = n.message || n.text || 'Notification';
        const when = n.timestamp ? new Date(n.timestamp).toLocaleString() : '';
        li.innerHTML = `<strong>${escapeHtml(msg)}</strong>${when ? ` — ${escapeHtml(when)}` : ''}`;
        notifList.appendChild(li);
      });
    }

  } catch (err) {
    console.error('Error loading dashboard:', err);
  }

  // Small helper to avoid XSS when inserting strings
  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"]+/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[s] || s));
  }
});
