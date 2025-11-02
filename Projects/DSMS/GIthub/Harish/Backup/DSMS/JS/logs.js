/* logs.js - frontend for logs.html
   Fetches /api/logs/my and /api/logs/related and provides client-side filtering and tabs.
*/
document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const fileParam = params.get('file');
  const searchInput = document.getElementById('searchInput');
  const actionFilter = document.getElementById('actionFilter');
  const dateFilter = document.getElementById('dateFilter');
  const scopeSelect = document.getElementById('scopeSelect');
  const tableBody = document.getElementById('logsTableBody');
  const exportBtn = document.getElementById('exportCSV');

  let myLogs = [];
  let relatedLogs = [];
  let activeLogs = [];

  async function fetchLogs() {
    try {
      const [r1, r2] = await Promise.all([
        fetch('/api/logs/my', { credentials: 'include' }),
        fetch('/api/logs/related', { credentials: 'include' })
      ]);
      if (r1.status === 401 || r2.status === 401) { window.location.href = '/HTML/auth.html'; return; }
      myLogs = await r1.json().catch(()=>[]);
      relatedLogs = await r2.json().catch(()=>[]);
      activeLogs = scopeSelect && scopeSelect.value === 'related' ? relatedLogs : myLogs;
    } catch (err) {
      console.error('Failed to fetch logs', err);
    }
  }

  function formatTimestamp(ts) {
    if (!ts) return '-';
    try { return new Date(ts).toLocaleString(); } catch (e) { return ts; }
  }

  function renderLogs() {
    const q = (searchInput.value || '').toLowerCase().trim();
    const action = (actionFilter.value || '').toLowerCase();
    const dateFrom = dateFilter.value ? new Date(dateFilter.value) : null;

    const filtered = activeLogs
      .filter(l => {
        if (action && action !== '' && l.action !== action) return false;
        if (dateFrom && l.timestamp && new Date(l.timestamp) < dateFrom) return false;
        if (fileParam && l.fileName && fileParam.toLowerCase() !== l.fileName.toLowerCase()) return false;
        if (!q) return true;
        const inFile = (l.fileName || '').toLowerCase().includes(q);
        const inDetails = (l.details || '').toLowerCase().includes(q);
        const inActor = (l.actor || '').toLowerCase().includes(q);
        return inFile || inDetails || inActor;
      })
      .sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));

    tableBody.innerHTML = '';
    if (!filtered.length) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="5" style="text-align:center;padding:24px;color:#666">No logs found</td>`;
      tableBody.appendChild(tr);
      return;
    }

    filtered.forEach(l => {
      const tr = document.createElement('tr');
      const action = (l.action || '').toLowerCase();
      const badgeClass = {
        upload: 'action-upload',
        share: 'action-share',
        view: 'action-view',
        download: 'action-download',
        delete: 'action-delete',
        revoke: 'action-delete'
      }[action] || 'action-default';

      tr.innerHTML = `
        <td class="td-ts">${formatTimestamp(l.timestamp)}</td>
        <td class="td-file">${escapeHtml(l.fileName || '-')}</td>
        <td class="td-action"><span class="action-badge ${badgeClass}">${escapeHtml((l.action || '-').replace('-', ' ').toUpperCase())}</span></td>
        <td class="td-user">${escapeHtml(l.actor || l.recipient || '-')}</td>
        <td class="td-details">${escapeHtml(l.details || '')}</td>
      `;
      tableBody.appendChild(tr);
    });
  }

  function escapeHtml(str) { if (!str) return ''; return String(str).replace(/[&<>"]/g, s => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[s])); }

  scopeSelect?.addEventListener('change', () => { activeLogs = scopeSelect.value === 'related' ? relatedLogs : myLogs; renderLogs(); });
  actionFilter.addEventListener('change', renderLogs);
  searchInput.addEventListener('input', renderLogs);
  dateFilter.addEventListener('change', renderLogs);

  exportBtn.addEventListener('click', () => {
    const rows = [ ['Timestamp','File Name','Action','User/Recipient','Details'] ];
    const nodes = Array.from(tableBody.querySelectorAll('tr'));
    nodes.forEach(r => {
      const cols = Array.from(r.querySelectorAll('td')).map(td => td.textContent.replace(/\s+/g,' ').trim());
      if (cols.length) rows.push(cols);
    });
    const csv = rows.map(r => r.map(c => '"'+(c||'')+'"').join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `dsms-logs-${new Date().toISOString()}.csv`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  });

  await fetchLogs();
  renderLogs();
});
