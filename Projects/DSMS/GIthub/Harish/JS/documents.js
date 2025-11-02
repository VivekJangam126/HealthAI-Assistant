/**
 * documents.js - frontend for documents.html
 */
document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('file-upload-input');
  const uploadStatus = document.getElementById('upload-status');
  const tableBody = document.getElementById('document-table-body');
  const docCount = document.getElementById('document-count');

  // Load documents on start
  loadDocuments();

  // Auto-upload when file selected
  fileInput?.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    for (const f of files) {
      await uploadFile(f);
    }
    fileInput.value = '';
    await loadDocuments();
  });

  async function uploadFile(file) {
    try {
      if (uploadStatus) { uploadStatus.classList.remove('hidden'); uploadStatus.textContent = 'Uploading...'; }
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/documents/upload', { method: 'POST', body: fd, credentials: 'include' });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        showMessage(`Uploaded ${file.name}`);
      } else {
        showMessage(`Upload failed: ${data.message || 'Server error'}`, true);
      }
    } catch (err) {
      console.error('Upload error', err);
      showMessage('Upload failed — see console', true);
    } finally {
      if (uploadStatus) { uploadStatus.classList.add('hidden'); }
    }
  }

  async function loadDocuments() {
    try {
      const res = await fetch('/api/documents/list', { credentials: 'include' });
      if (res.status === 401) { window.location.href = '/HTML/auth.html'; return; }
      const docs = await res.json();
      renderTable(docs);
    } catch (err) {
      console.error('Failed to load documents', err);
    }
  }

  function renderTable(docs) {
    if (!tableBody) return;
    tableBody.innerHTML = '';
    if (docCount) docCount.textContent = docs.length || 0;
    if (!docs.length) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="5" class="table-cell-padding text-center">No documents uploaded yet</td>`;
      tableBody.appendChild(tr);
      return;
    }

    docs.forEach(doc => {
      const tr = document.createElement('tr');
      const sizeKb = doc.fileSize ? (doc.fileSize / 1024).toFixed(2) + ' KB' : '—';
      const status = doc.status || 'active';
      const date = doc.uploadDate ? new Date(doc.uploadDate).toLocaleString() : '—';
      tr.className = 'document-row table-row-item';
      tr.innerHTML = `
        <td class="table-cell-padding document-name-cell">${escapeHtml(doc.fileName || '—')}</td>
        <td class="table-cell-padding table-cell-desktop-small table-timestamp">${escapeHtml(sizeKb)}</td>
        <td class="table-cell-padding table-cell-desktop-medium"><span class="status-badge">${escapeHtml(status)}</span></td>
        <td class="table-cell-padding table-timestamp">${escapeHtml(date)}</td>
        <td class="table-cell-padding text-center">
          <button class="action-btn action-view" data-id="${doc.id}">View</button>
          <button class="action-btn action-share" data-id="${doc.id}">Share</button>
          <button class="action-btn action-delete" data-id="${doc.id}">Delete</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    // Attach handlers
    document.querySelectorAll('.action-view').forEach(btn => btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id'); viewFile(id);
    }));
    document.querySelectorAll('.action-delete').forEach(btn => btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id'); deleteFile(id);
    }));
    document.querySelectorAll('.action-share').forEach(btn => btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id'); shareFile(id);
    }));
  }

  function viewFile(id) {
    window.open(`/api/documents/view/${id}`, '_blank');
  }

  async function deleteFile(id) {
    if (!confirm('Delete this file?')) return;
    try {
      const res = await fetch(`/api/documents/delete/${id}`, { method: 'DELETE', credentials: 'include' });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        showMessage('Deleted');
        await loadDocuments();
      } else {
        showMessage(`Delete failed: ${data.message || 'Server error'}`, true);
      }
    } catch (err) {
      console.error('Delete failed', err);
      showMessage('Delete failed — see console', true);
    }
  }

  function shareFile(id) {
    window.location.href = `/HTML/share.html?fileId=${encodeURIComponent(id)}`;
  }

  function showMessage(msg, isError = false) {
    const el = document.getElementById('upload-status');
    if (!el) return alert(msg);
    el.textContent = msg;
    el.classList.remove('hidden');
    if (isError) el.classList.add('error');
    setTimeout(() => { el.classList.add('hidden'); el.classList.remove('error'); }, 3500);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>\"]+/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[s] || s));
  }

});
