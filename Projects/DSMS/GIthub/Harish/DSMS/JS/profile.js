document.addEventListener('DOMContentLoaded', async () => {
  async function loadProfile() {
    try {
      const res = await fetch('/api/profile', { credentials: 'include' });
      if (!res.ok) { console.warn('Failed to load profile', res.status); return; }
      const data = await res.json();
      if (!data) return;
      document.getElementById('full-name-display').textContent = data.name || '';
      document.getElementById('email-display').textContent = data.email || '';
      document.getElementById('uid-display').textContent = data.uid || '';
      if (data.joinDate) document.getElementById('join-date-display').textContent = new Date(data.joinDate).toLocaleString();
      if (data.lastLogin) document.getElementById('last-login-display').textContent = new Date(data.lastLogin).toLocaleString();
      const enc = data.encryptionStatus || 'Unknown';
      const encEl = document.querySelector('.profile-header-section .detail-item .detail-value') || null;
      // There is a specific element in the template; also place in a fallback id
      const encTarget = document.querySelector('.account-info-grid .detail-item .detail-value') || null;
      // Update stats
      document.getElementById('doc-count').textContent = (data.stats && data.stats.documents) || 0;
      document.getElementById('storage-used').textContent = (data.stats && data.stats.storageUsed) || '0 B';
      document.getElementById('share-count').textContent = (data.stats && data.stats.activeShares) || 0;

      // Update encryption status area if present
      const encElem = document.querySelector('.profile-card .account-info-grid .detail-item .detail-value') || document.getElementById('encryption-status');
      if (encElem) encElem.textContent = enc;
    } catch (err) { console.error('loadProfile error', err); }
  }

  // Edit profile flow (simple prompt-based modal)
  const editBtn = document.querySelector('.btn-edit-profile');
  if (editBtn) {
    editBtn.addEventListener('click', async () => {
      const current = document.getElementById('full-name-display')?.textContent || '';
      const newName = prompt('Enter your display name', current);
      if (!newName) return;
      try {
        const res = await fetch('/api/profile/update', { method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newName }) });
        const data = await res.json();
        if (res.ok && data.success) { await loadProfile(); alert('Profile updated'); }
        else alert('Failed to update profile');
      } catch (err) { console.error('update profile failed', err); alert('Update error'); }
    });
  }

  await loadProfile();
});
