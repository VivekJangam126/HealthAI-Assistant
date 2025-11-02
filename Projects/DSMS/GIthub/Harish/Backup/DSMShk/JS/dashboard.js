/*
 * Dashboard frontend
 * - loads cached data quickly (localStorage)
 * - fetches /api/dashboard/summary
 * - renders stats, recent activities and three charts using Chart.js
 */
(function () {
  const API = '/api/dashboard/summary';
  const CACHE_KEY = 'dsms.dashboard.summary';
  const CACHE_TTL_MS = 1000 * 60 * 2; // 2 minutes

  let charts = {};

  document.addEventListener('DOMContentLoaded', () => {
    // show cached immediately
    const cached = loadCache();
    if (cached) renderDashboard(cached.data, true);

    // wire refresh button
    const refreshBtn = document.getElementById('refresh-dashboard');
    if (refreshBtn) refreshBtn.addEventListener('click', () => fetchAndRender(true));

    // fetch fresh data
    fetchAndRender();
  });

  function loadCache() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.ts) return null;
      if ((Date.now() - parsed.ts) > CACHE_TTL_MS) return null;
      return parsed;
    } catch (e) { return null; }
  }

  function saveCache(data) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data })); } catch (e) {}
  }

  async function fetchAndRender(forceSpinner = false) {
    try {
      const res = await fetch(API, { credentials: 'include' });
      if (res.status === 401) return window.location.href = '/HTML/auth.html';
      if (!res.ok) return console.error('Failed to load dashboard summary', res.status);
      const data = await res.json();
      saveCache(data);
      renderDashboard(data);
    } catch (err) {
      console.error('Dashboard fetch failed', err);
    }
  }

  function renderDashboard(data, fromCache = false) {
    // Stats
    const totalDocsEl = document.getElementById('total-documents');
    const activeSharesEl = document.getElementById('active-shares');
    const storageUsedEl = document.getElementById('storage-used');
    if (totalDocsEl) totalDocsEl.textContent = data.totalDocuments ?? 0;
    if (activeSharesEl) activeSharesEl.textContent = data.activeShares ?? 0;
    if (storageUsedEl) storageUsedEl.innerHTML = `${data.storageUsedMB ?? 0} MB <span class="stat-sub-value">/ 5 GB</span>`;

    // Recent Activities table (tbody)
    const tbody = document.querySelector('#recent-activity-table tbody');
    if (tbody) {
      tbody.innerHTML = ''; // clear
      const activities = data.recentActivities || [];
      if (activities.length === 0) {
        const tr = document.createElement('tr');
        tr.className = 'table-row-empty';
        tr.innerHTML = '<td colspan="4" class="table-cell-padding">No recent activity</td>';
        tbody.appendChild(tr);
      } else {
        for (const a of activities) {
          const tr = document.createElement('tr');
          tr.className = 'table-row-item';
          const when = a.timestamp ? new Date(a.timestamp).toLocaleString() : '';
          const details = a.details ? `<div class="text-slate-400">${escapeHtml(a.details)}</div>` : '';
          tr.innerHTML = `
            <td class="table-cell-padding action-cell">${escapeHtml(capitalize(a.action || ''))}</td>
            <td class="table-cell-padding">${escapeHtml(a.fileName || '—')}</td>
            <td class="table-cell-padding table-cell-desktop-only">${details}</td>
            <td class="table-cell-padding table-timestamp">${escapeHtml(when)}</td>
          `;
          tbody.appendChild(tr);
        }
      }
    }

    // Charts
    setupOrUpdateCharts(data.chartData || {});

    // Last updated
    const lu = document.getElementById('last-updated');
    if (lu) lu.textContent = 'Last updated: ' + (fromCache ? 'cached' : new Date().toLocaleString());
  }

  function setupOrUpdateCharts(chartData) {
    // Prepare labels (weeks)
    const uploads = chartData.uploadsPerWeek || [];
    const shares = chartData.sharesPerWeek || [];
    const storage = chartData.storageUsage || [];

    const labels = uploads.map(i => i.week);
    const uploadsValues = uploads.map(i => i.count);
    const sharesValues = shares.map(i => i.count);
    const storageValues = storage.map(i => i.storageMB);

    // Colors (neon cyan, violet, green)
    const cyan = '#00f5ff';
    const violet = '#b084ff';
    const green = '#34d399';

    // Uploads line chart
    const ctxU = document.getElementById('chart-uploads');
    if (ctxU) {
      if (charts.uploads) {
        charts.uploads.data.labels = labels;
        charts.uploads.data.datasets[0].data = uploadsValues;
        charts.uploads.update();
      } else {
        charts.uploads = new Chart(ctxU.getContext('2d'), {
          type: 'line',
          data: {
            labels,
            datasets: [{
              label: 'Uploads',
              data: uploadsValues,
              borderColor: cyan,
              backgroundColor: hexToRgba(cyan, 0.12),
              tension: 0.3,
              fill: true,
              pointRadius: 3
            }]
          },
          options: smallChartOptions()
        });
      }
    }

    // Shares bar chart
    const ctxS = document.getElementById('chart-shares');
    if (ctxS) {
      if (charts.shares) {
        charts.shares.data.labels = labels;
        charts.shares.data.datasets[0].data = sharesValues;
        charts.shares.update();
      } else {
        charts.shares = new Chart(ctxS.getContext('2d'), {
          type: 'bar',
          data: {
            labels,
            datasets: [{
              label: 'Shares',
              data: sharesValues,
              backgroundColor: hexToRgba(violet, 0.9),
              borderRadius: 4
            }]
          },
          options: smallChartOptions()
        });
      }
    }

    // Storage area chart
    const ctxSt = document.getElementById('chart-storage');
    if (ctxSt) {
      if (charts.storage) {
        charts.storage.data.labels = labels;
        charts.storage.data.datasets[0].data = storageValues;
        charts.storage.update();
      } else {
        charts.storage = new Chart(ctxSt.getContext('2d'), {
          type: 'line',
          data: {
            labels,
            datasets: [{
              label: 'Storage (MB)',
              data: storageValues,
              borderColor: green,
              backgroundColor: hexToRgba(green, 0.12),
              tension: 0.3,
              fill: true
            }]
          },
          options: smallChartOptions()
        });
      }
    }
  }

  function smallChartOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#9ca3af', maxRotation: 0 } },
        y: { grid: { color: '#0b1220' }, ticks: { color: '#9ca3af' } }
      }
    };
  }

  function hexToRgba(hex, alpha) {
    const h = hex.replace('#', '');
    const bigint = parseInt(h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>\"]+/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[s] || s));
  }

  function capitalize(s) { if (!s) return s; return s.charAt(0).toUpperCase() + s.slice(1); }

})();
