document.addEventListener('DOMContentLoaded', async () => {
  const emailToggle = document.getElementById('email-alert-toggle');
  const inAppToggle = document.getElementById('inapp-alert-toggle');
  const encryptToggle = document.getElementById('encrypt-toggle');
  const themeToggle = document.getElementById('theme-toggle');
  const logoutAllBtn = document.getElementById('logout-all-btn');
  const exportBtn = document.getElementById('export-data-btn');
  const deleteBtn = document.getElementById('delete-account-btn');

  async function loadSettings() {
    try {
      const res = await fetch('/api/settings', { credentials: 'include' });
      if (!res.ok) return console.warn('Failed to load settings', res.status);
      const data = await res.json();
      const prefs = data.preferences || {};
      if (emailToggle) emailToggle.checked = !!prefs.emailAlerts;
      if (inAppToggle) inAppToggle.checked = !!prefs.inAppNotifications;
      if (encryptToggle) encryptToggle.checked = !!prefs.alwaysEncryptFiles;
      if (themeToggle) themeToggle.checked = (prefs.theme === 'dark');
    } catch (err) { console.error('loadSettings error', err); }
  }

  async function patchPrefs(partial) {
    try {
      const body = { preferences: partial };
      const res = await fetch('/api/settings/update', { method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) console.warn('Failed to patch prefs', res.status);
      const data = await res.json().catch(()=>null);
      // refresh unread count or other UI if provided
      if (window.refreshUnreadCount) window.refreshUnreadCount();
      return data;
    } catch (err) { console.error('patchPrefs error', err); }
  }

  emailToggle?.addEventListener('change', () => { patchPrefs({ emailAlerts: !!emailToggle.checked }); });
  inAppToggle?.addEventListener('change', () => { patchPrefs({ inAppNotifications: !!inAppToggle.checked }); });
  encryptToggle?.addEventListener('change', () => { patchPrefs({ alwaysEncryptFiles: !!encryptToggle.checked }); });
  themeToggle?.addEventListener('change', () => { patchPrefs({ theme: themeToggle.checked ? 'dark' : 'light' }); });

  logoutAllBtn?.addEventListener('click', async () => {
    if (!confirm('Logout from all devices?')) return;
    try {
      const res = await fetch('/api/settings/logoutAll', { method: 'POST', credentials: 'include' });
      const data = await res.json().catch(()=>null);
      if (res.ok && data && data.success) alert('All sessions revoked');
      else alert('Failed to logout all');
    } catch (err) { console.error('logoutAll error', err); alert('Error'); }
  });

  exportBtn?.addEventListener('click', async () => {
    try {
      const res = await fetch('/api/settings/exportData', { method: 'POST', credentials: 'include' });
      if (!res.ok) return alert('Export failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      const disposition = res.headers.get('Content-Disposition') || '';
      let filename = 'dsms_export.json';
      const m = /filename="?(.*?)"?$/.exec(disposition);
      if (m && m[1]) filename = m[1];
      a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); window.URL.revokeObjectURL(url);
    } catch (err) { console.error('exportData error', err); alert('Export failed'); }
  });

  deleteBtn?.addEventListener('click', async () => {
    if (!confirm('Permanently delete your account and all data? This cannot be undone.')) return;
    try {
      const res = await fetch('/api/settings/deleteAccount', { method: 'DELETE', credentials: 'include' });
      const data = await res.json().catch(()=>null);
      if (res.ok && data && data.success) {
        alert('Account deleted');
        window.location.href = '/HTML/index.html';
      } else alert('Failed to delete account');
    } catch (err) { console.error('deleteAccount error', err); alert('Delete failed'); }
  });

  await loadSettings();
});
