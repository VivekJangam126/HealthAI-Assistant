document.addEventListener('DOMContentLoaded', async () => {
  const receivedBody = document.getElementById('received-body');
  const sentBody = document.getElementById('sent-body');

  async function load() {
    try {
      const [receivedRes, sentRes] = await Promise.all([
        fetch('/api/requests/received', { credentials: 'include' }),
        fetch('/api/requests/sent', { credentials: 'include' })
      ]);
      if (receivedRes.status === 401 || sentRes.status === 401) { window.location.href = '/HTML/auth.html'; return; }
      const [received, sent] = await Promise.all([receivedRes.json(), sentRes.json()]);
      renderReceived(received || []);
      renderSent(sent || []);
    } catch (err) { console.error('Failed to load requests', err); }
  }

  function renderReceived(list) {
    receivedBody.innerHTML = '';
    list.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escapeHtml(r.requesterEmail || '')}</td>
        <td>${escapeHtml(r.docType || '')}</td>
        <td>${escapeHtml(r.reason || '')}</td>
        <td>${r.expiry ? new Date(r.expiry).toLocaleString() : 'None'}</td>
        <td>${escapeHtml(r.status || '')}</td>
        <td>${r.status === 'pending' ? `<button class="accept-btn" data-id="${r.id}">Accept</button><button class="deny-btn" data-id="${r.id}">Deny</button>` : '-'}</td>
      `;
      receivedBody.appendChild(tr);
    });

    receivedBody.querySelectorAll('.accept-btn').forEach(b => b.addEventListener('click', async (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      if (!confirm('Accept this request and create a share?')) return;
      try {
        const res = await fetch(`/api/requests/accept/${id}`, { method: 'PATCH', credentials: 'include' });
        const data = await res.json().catch(()=>({}));
        if (res.ok && data.success) { alert('Request accepted'); await load(); }
        else alert('Accept failed');
      } catch (err) { console.error('Accept failed', err); alert('Accept failed'); }
    }));

    receivedBody.querySelectorAll('.deny-btn').forEach(b => b.addEventListener('click', async (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      if (!confirm('Deny this request?')) return;
      try {
        const res = await fetch(`/api/requests/deny/${id}`, { method: 'PATCH', credentials: 'include' });
        const data = await res.json().catch(()=>({}));
        if (res.ok && data.success) { alert('Request denied'); await load(); }
        else alert('Deny failed');
      } catch (err) { console.error('Deny failed', err); alert('Deny failed'); }
    }));
  }

  function renderSent(list) {
    sentBody.innerHTML = '';
    list.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escapeHtml(r.recipientEmail || '')}</td>
        <td>${escapeHtml(r.docType || '')}</td>
        <td>${escapeHtml(r.reason || '')}</td>
        <td>${r.expiry ? new Date(r.expiry).toLocaleString() : 'None'}</td>
        <td>${escapeHtml(r.status || '')}</td>
      `;
      sentBody.appendChild(tr);
    });
  }

  function escapeHtml(s) { if (!s) return ''; return String(s).replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

  await load();
});
