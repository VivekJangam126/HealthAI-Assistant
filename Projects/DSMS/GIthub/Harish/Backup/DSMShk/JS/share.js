/**
 * share.js - frontend for share.html
 */
document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const fileIdParam = params.get('fileId');
  const fileSelect = document.getElementById('document-select');
  const form = document.getElementById('new-share-form');
  const shareTableBody = document.getElementById('share-table-body');
  const activeCount = document.getElementById('active-share-count');

  let docs = [];
  try {
    // always fetch user documents to populate dropdown or find file info
    const docsRes = await fetch('/api/documents/list', { credentials: 'include' });
    if (docsRes.status === 401) { window.location.href = '/HTML/auth.html'; return; }
    docs = await docsRes.json();
  } catch (err) { console.error('Failed to fetch documents', err); }

  if (fileIdParam) {
    // linked mode: find doc and lock selector
    const doc = docs.find(d => d.id === fileIdParam);
    if (doc) {
      fileSelect.innerHTML = '';
      const opt = document.createElement('option'); opt.value = doc.id; opt.textContent = doc.fileName; fileSelect.appendChild(opt);
      fileSelect.disabled = true;
    } else {
      // fallback: still allow selection
      populateFileSelect(docs);
      fileSelect.disabled = false;
    }
  } else {
    populateFileSelect(docs);
    fileSelect.disabled = false;
  }

  function populateFileSelect(docs) {
    fileSelect.innerHTML = '<option value="" disabled selected>Select a document from your files...</option>';
    docs.forEach(d => {
      const opt = document.createElement('option'); opt.value = d.id; opt.textContent = d.fileName; fileSelect.appendChild(opt);
    });
  }

  // Load shares list
  await loadShares();

  // Handle form submit
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const documentId = fileSelect.value;
    const recipientEmail = document.getElementById('recipient-email').value.trim();
    const permission = document.getElementById('permission-type').value;
    const expiry = document.getElementById('expiry-time').value;
    if (!documentId || !recipientEmail || !permission) return alert('Please complete the form');

    try {
      const res = await fetch('/api/shares/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ documentId, recipientEmail, permission, expiry })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        alert('File shared successfully');
        // find file name for redirect
        const file = docs.find(d => d.id === documentId);
        window.location.href = `/HTML/logs.html?file=${encodeURIComponent(file ? file.fileName : '')}`;
        return;
      }
      alert('Share failed: ' + (data.message || 'server error'));
    } catch (err) {
      console.error('Create share failed', err);
      alert('Share failed — see console');
    }
  });
  // New: load both sharedByMe and sharedWithMe lists and render
  async function loadShares() {
    try {
      const [byMeRes, withMeRes] = await Promise.all([
        fetch('/api/shares/sharedByMe', { credentials: 'include' }),
        fetch('/api/shares/sharedWithMe', { credentials: 'include' })
      ]);
      if (byMeRes.status === 401 || withMeRes.status === 401) { window.location.href = '/HTML/auth.html'; return; }
      const [byMe, withMe] = await Promise.all([byMeRes.json(), withMeRes.json()]);
      renderSharedByMe(byMe || []);
      renderSharedWithMe(withMe || []);
    } catch (err) { console.error('Failed to load shares', err); }
  }

  function renderSharedByMe(list) {
    const tbody = document.getElementById('sharedByMeBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    list.forEach(s => {
      const expiry = s.expiryTime ? new Date(s.expiryTime) : null;
      const now = new Date();
      let timeRemaining = 'Never';
      if (expiry) {
        const diff = expiry - now;
        if (diff <= 0) timeRemaining = 'Expired';
        else if (diff < 3600000) timeRemaining = `${Math.ceil(diff/60000)}m left`;
        else if (diff < 86400000) timeRemaining = `${Math.ceil(diff/3600000)}h left`;
        else timeRemaining = `${Math.ceil(diff/86400000)}d left`;
      }
      const status = s.revoked ? 'Revoked' : s.deleted ? 'Deleted' : (expiry && expiry < now ? 'Expired' : 'Active');
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="table-cell-padding">${escapeHtml(s.fileName || 'Deleted')}</td>
        <td class="table-cell-padding">${escapeHtml(s.recipientEmail || '')}</td>
        <td class="table-cell-padding">${escapeHtml(s.permission || '')}</td>
        <td class="table-cell-padding">${s.expiryTime ? new Date(s.expiryTime).toLocaleString() : 'Never'}</td>
        <td class="table-cell-padding">${escapeHtml(timeRemaining)}</td>
        <td class="table-cell-padding">${escapeHtml(status)}</td>
        <td class="table-cell-padding text-center">${!s.revoked && !s.deleted ? `<button class="revoke-btn" data-id="${s.id}">Revoke</button>` : '-'}</td>
      `;
      tbody.appendChild(tr);
    });

    // attach revoke handlers
    tbody.querySelectorAll('.revoke-btn').forEach(b => b.addEventListener('click', async (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      if (!confirm('Revoke this share?')) return;
      try {
        const res = await fetch(`/api/shares/revoke/${id}`, { method: 'POST', credentials: 'include' });
        const data = await res.json().catch(()=>({}));
        if (res.ok && data.success) { alert(data.message || 'Revoked'); await loadShares(); }
        else alert('Revoke failed: ' + (data.message || 'server error'));
      } catch (err) { console.error('Revoke failed', err); alert('Revoke failed — see console'); }
    }));
  }

  function renderSharedWithMe(list) {
    const tbody = document.getElementById('sharedWithMeBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    list.forEach(s => {
      const expiry = s.expiryTime ? new Date(s.expiryTime) : null;
      const now = new Date();
      let timeRemaining = 'Never';
      if (expiry) {
        const diff = expiry - now;
        if (diff <= 0) timeRemaining = 'Expired';
        else if (diff < 3600000) timeRemaining = `${Math.ceil(diff/60000)}m left`;
        else if (diff < 86400000) timeRemaining = `${Math.ceil(diff/3600000)}h left`;
        else timeRemaining = `${Math.ceil(diff/86400000)}d left`;
      }
      const status = s.revoked ? 'Revoked' : s.deleted ? 'Deleted' : (expiry && expiry < now ? 'Expired' : 'Active');
      const disabled = s.revoked || s.deleted || (expiry && expiry < now);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="table-cell-padding">${escapeHtml(s.fileName || 'Deleted')}</td>
        <td class="table-cell-padding">${escapeHtml(s.sharedByEmail || '')}</td>
        <td class="table-cell-padding">${escapeHtml(s.permission || '')}</td>
        <td class="table-cell-padding">${s.expiryTime ? new Date(s.expiryTime).toLocaleString() : 'Never'}</td>
        <td class="table-cell-padding">${escapeHtml(timeRemaining)}</td>
        <td class="table-cell-padding">${escapeHtml(status)}</td>
        <td class="table-cell-padding text-center">
          <button ${disabled ? 'disabled' : ''} class="view-btn" data-token="${s.token}">View</button>
          <button ${disabled || s.permission === 'view' ? 'disabled' : ''} class="download-btn" data-token="${s.token}">Download</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.view-btn').forEach(b => b.addEventListener('click', async (e) => {
      const token = e.currentTarget.getAttribute('data-token'); await viewSharedFile(token);
    }));
    tbody.querySelectorAll('.download-btn').forEach(b => b.addEventListener('click', async (e) => {
      const token = e.currentTarget.getAttribute('data-token'); await downloadSharedFile(token);
    }));
  }

  async function viewSharedFile(token) {
    try {
      const res = await fetch(`/api/shares/view/${encodeURIComponent(token)}`);
      const data = await res.json().catch(()=>({}));
      if (!data.success) {
        if (data.reason === 'revoked') alert('Access revoked by owner.');
        else if (data.reason === 'expired') alert('This share has expired.');
        else if (data.reason === 'deleted') alert('This file was deleted by owner.');
        else alert('Cannot view this share.');
        return;
      }
      // open viewer in new window/tab and include watermark overlay via viewer page
      const w = window.open('', '_blank');
      // open the direct serve URL in an iframe and overlay watermark
      w.document.write(`<!doctype html><html><head><title>Viewer</title><style>body{margin:0;height:100vh}iframe{width:100%;height:100vh;border:0}#wm{position:fixed;left:10px;top:10px;opacity:0.6;color:#fff;background:rgba(0,0,0,0.25);padding:6px 10px;border-radius:4px;font-size:13px;z-index:9999} </style></head><body><div id="wm">Shared via DSMS | Viewer: ${escapeHtml((window.__USER_EMAIL||''))} | ${new Date().toLocaleString()}</div><iframe src="${data.fileUrl}" ></iframe></body></html>`);
      // notify logs endpoint of view (best-effort)
      try { await fetch('/api/logs/view', { method: 'POST', credentials: 'include', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ fileId: token, viewerEmail: window.__USER_EMAIL || null, viewedAt: new Date().toISOString() }) }); } catch (e) { console.warn('Failed to send view log', e); }
    } catch (err) { console.error('View shared file failed', err); alert('Failed to view file'); }
  }

  async function downloadSharedFile(token) {
    try {
      const res = await fetch(`/api/shares/download/${encodeURIComponent(token)}`);
      if (!res.ok) {
        const text = await res.text().catch(()=>null);
        alert('Cannot download this file: ' + (text || res.statusText));
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) { console.error('Download failed', err); alert('Download failed'); }
  }

  function escapeHtml(str) { if (!str) return ''; return String(str).replace(/[&<>\"]/g, s => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[s])); }
});
