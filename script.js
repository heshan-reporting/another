/* ═══════════════════════════════════════════════════
   MCA ADS INTEL — DASHBOARD SCRIPT
   Vanilla JS · Chart.js · No frameworks
═══════════════════════════════════════════════════ */

'use strict';

/* ── STATE ─────────────────────────────────────── */
let state = {
  week: 'current',
  search: '',
  statusFilter: 'all',
  campaignFilter: 'all',
  sortCol: 'spend',
  sortDir: 'desc',
  page: 1,
  rowsPerPage: 20,
  activeSection: 'overview'
};

/* ── CHART INSTANCES ───────────────────────────── */
let cplChartInst = null;
let spendChartInst = null;
const sparkInstances = {};

/* ── INIT ──────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initFilters();
  populateCampaignDropdown();
  render();
});

/* ═══════════════════════════════════════════════════
   NAVIGATION
═══════════════════════════════════════════════════ */

function initNav() {
  document.querySelectorAll('.sidebar-nav li').forEach(li => {
    li.addEventListener('click', () => {
      const sec = li.dataset.section;
      state.activeSection = sec;
      document.querySelectorAll('.sidebar-nav li').forEach(l => l.classList.remove('active'));
      li.classList.add('active');
      showSection(sec);
      updateSectionTitle(sec);
    });
  });
}

function showSection(sec) {
  const sections = ['overview', 'campaigns', 'ads', 'alerts'];
  const kpiGrid = document.getElementById('section-overview');
  const chartRow = document.querySelector('.chart-row');

  if (sec === 'overview') {
    kpiGrid.style.display = '';
    chartRow.style.display = '';
  } else {
    kpiGrid.style.display = 'none';
    chartRow.style.display = 'none';
  }

  sections.forEach(s => {
    const el = document.getElementById(`section-${s}`);
    if (el && s !== 'overview') {
      el.classList.toggle('hidden', s !== sec);
    }
  });

  if (sec === 'campaigns') renderCampaigns();
  if (sec === 'ads') renderAdTable();
  if (sec === 'alerts') renderAlerts();
}

function updateSectionTitle(sec) {
  const titles = {
    overview: 'Account Overview',
    campaigns: 'Campaigns',
    ads: 'Ad Performance',
    alerts: 'Flags & Alerts'
  };
  document.getElementById('section-title').textContent = titles[sec] || sec;
}

/* ═══════════════════════════════════════════════════
   FILTERS & CONTROLS
═══════════════════════════════════════════════════ */

function initFilters() {
  document.getElementById('weekToggle').addEventListener('change', e => {
    state.week = e.target.value;
    state.page = 1;
    render();
    document.getElementById('spendWeekLabel').textContent =
      state.week === 'current' ? 'Current week' : 'Previous week';
  });

  document.getElementById('globalSearch').addEventListener('input', e => {
    state.search = e.target.value.toLowerCase().trim();
    state.page = 1;
    renderCampaigns();
    renderAdTable();
  });

  document.getElementById('campaignFilter').addEventListener('change', e => {
    state.campaignFilter = e.target.value;
    state.page = 1;
    renderCampaigns();
    renderAdTable();
  });

  const statusFilter = document.getElementById('statusFilter');
  if (statusFilter) {
    statusFilter.addEventListener('change', e => {
      state.statusFilter = e.target.value;
      state.page = 1;
      renderCampaigns();
    });
  }
}

function populateCampaignDropdown() {
  const sel = document.getElementById('campaignFilter');
  const campaigns = new Set();
  dashboardData.weeks.current.campaigns.forEach(c => campaigns.add(c.name));
  campaigns.forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name.length > 40 ? name.substring(0, 38) + '…' : name;
    sel.appendChild(opt);
  });
}

/* ═══════════════════════════════════════════════════
   MAIN RENDER
═══════════════════════════════════════════════════ */

function render() {
  const w = dashboardData.weeks[state.week];
  updatePartialBadge(w);
  renderKPIs(w);
  renderCharts(w);
  if (state.activeSection === 'campaigns') renderCampaigns();
  if (state.activeSection === 'ads') renderAdTable();
  if (state.activeSection === 'alerts') renderAlerts();
}

function updatePartialBadge(w) {
  const badge = document.getElementById('partial-badge');
  if (w.partial) {
    badge.style.display = '';
    badge.textContent = `⚡ Partial Week — ${w.label} (${w.days} of 7 days)`;
  } else {
    badge.style.display = 'none';
  }
}

/* ═══════════════════════════════════════════════════
   KPI CARDS
═══════════════════════════════════════════════════ */

function renderKPIs(w) {
  const pw = dashboardData.weeks.previous;
  const cw = dashboardData.weeks.current;

  // Adjust previous week projections if current week is partial
  const scaleFactor = w === cw && cw.partial ? (cw.days / 7) : 1;
  const pwScaled = {
    spend:   pw.totalSpend * scaleFactor,
    leads:   pw.totalLeads * scaleFactor,
    cpl:     pw.costPerLead,
    cpm:     pw.avgCPM,
    reach:   pw.totalReach * scaleFactor
  };

  // Spend
  animateCounter('kpi-spend', w.totalSpend, v => '$' + fmtNum(v, 0));
  document.getElementById('kpi-spend-rate').textContent = '';
  setDelta('kpi-spend-delta', w.totalSpend, pwScaled.spend, false, false);

  // Leads
  animateCounter('kpi-leads', w.totalLeads, v => Math.round(v).toLocaleString());
  document.getElementById('kpi-leads-rate').textContent = '';
  setDelta('kpi-leads-delta', w.totalLeads, pwScaled.leads, false, false);

  // CPL (lower = better)
  animateCounter('kpi-cpl', w.costPerLead, v => '$' + v.toFixed(2));
  setDeltaCPL('kpi-cpl-delta', w.costPerLead, pw.costPerLead);

  // CPM
  animateCounter('kpi-cpm', w.avgCPM, v => '$' + v.toFixed(2));
  setDelta('kpi-cpm-delta', w.avgCPM, pw.avgCPM, true, true);

  // Reach
  animateCounter('kpi-reach', w.totalReach, v => fmtBig(v));
  const freq = (w.totalImpressions / w.totalReach).toFixed(2);
  document.getElementById('kpi-reach-freq').textContent = `Avg freq. ${freq}×`;
  setDelta('kpi-reach-delta', w.totalReach, pwScaled.reach, false, false);

  // Sparklines (static demo curves)
  drawSparkline('spark-spend',  [0.4, 0.6, 0.55, 0.7, 0.65, 0.8, 0.9, 1.0], '#4F6EF7');
  drawSparkline('spark-leads',  [0.3, 0.5, 0.6, 0.55, 0.7, 0.8, 0.85, 1.0], '#10B981');
  drawSparkline('spark-cpl',    [1.0, 0.9, 0.85, 0.92, 0.88, 0.82, 0.78, 0.75], '#8B5CF6');
  drawSparkline('spark-cpm',    [0.6, 0.65, 0.7, 0.68, 0.72, 0.75, 0.73, 0.78], '#F59E0B');
  drawSparkline('spark-reach',  [0.5, 0.6, 0.7, 0.65, 0.8, 0.85, 0.9, 1.0], '#38BDF8');
}

function setDelta(elId, current, previous, lowerBetter, lowerBetter2) {
  const el = document.getElementById(elId);
  if (!el || !previous) { el.textContent = '—'; return; }
  const pct = ((current - previous) / Math.abs(previous)) * 100;
  const up = pct > 0;
  const good = lowerBetter ? !up : up;
  el.textContent = (up ? '▲ +' : '▼ ') + Math.abs(pct).toFixed(1) + '% WoW';
  el.className = 'kpi-delta ' + (good ? 'up' : 'down');
}

function setDeltaCPL(elId, current, previous) {
  const el = document.getElementById(elId);
  if (!el || !previous) { el.textContent = '—'; return; }
  const pct = ((current - previous) / Math.abs(previous)) * 100;
  const up = pct > 0; // up = worse for CPL
  el.textContent = (up ? '▲ +' : '▼ ') + Math.abs(pct).toFixed(1) + '% WoW';
  el.className = 'kpi-delta ' + (up ? 'cpl-bad' : 'cpl-good');
}

function animateCounter(elId, target, formatter) {
  const el = document.getElementById(elId);
  if (!el) return;
  const duration = 900;
  const start = performance.now();
  const step = ts => {
    const p = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = formatter(target * ease);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = formatter(target);
  };
  requestAnimationFrame(step);
}

function drawSparkline(canvasId, data, color) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const pad = 2;
  const points = data.map((v, i) => ({
    x: pad + (i / (data.length - 1)) * (w - pad * 2),
    y: h - pad - v * (h - pad * 2)
  }));

  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, color + '40');
  grad.addColorStop(1, color + '00');

  ctx.beginPath();
  ctx.moveTo(points[0].x, h);
  points.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(points[points.length - 1].x, h);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  points.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.lineJoin = 'round';
  ctx.stroke();
}

/* ═══════════════════════════════════════════════════
   CHARTS
═══════════════════════════════════════════════════ */

const CHART_DEFAULTS = {
  font: { family: "'Sora', sans-serif", size: 11 },
  color: '#8A8A9A'
};

function chartTheme() {
  Chart.defaults.font.family = CHART_DEFAULTS.font.family;
  Chart.defaults.color = CHART_DEFAULTS.color;
}

function renderCharts(w) {
  chartTheme();
  renderCPLChart();
  renderSpendChart(w);
}

function renderCPLChart() {
  const cw = dashboardData.weeks.current;
  const pw = dashboardData.weeks.previous;

  const leadCampaigns = cw.campaigns.filter(c => c.type === 'lead' && c.cpl !== null);
  const labels = leadCampaigns.map(c => shortName(c.name));
  const cwVals = leadCampaigns.map(c => c.cpl || 0);
  const pwVals = leadCampaigns.map(c => {
    const found = pw.campaigns.find(p => p.name === c.name);
    return found?.cpl || 0;
  });

  if (cplChartInst) cplChartInst.destroy();

  const ctx = document.getElementById('cplChart').getContext('2d');
  cplChartInst = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Current Week',
          data: cwVals,
          backgroundColor: 'rgba(79,110,247,0.75)',
          borderColor: 'rgba(79,110,247,1)',
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false
        },
        {
          label: 'Previous Week',
          data: pwVals,
          backgroundColor: 'rgba(139,92,246,0.35)',
          borderColor: 'rgba(139,92,246,0.6)',
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          align: 'end',
          labels: {
            boxWidth: 12,
            boxHeight: 12,
            borderRadius: 3,
            useBorderRadius: true,
            padding: 16,
            font: { size: 11, weight: '600' }
          }
        },
        tooltip: {
          backgroundColor: '#18181F',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: $${ctx.parsed.y.toFixed(2)}`
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { font: { size: 10, weight: '600' } }
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: {
            font: { size: 10 },
            callback: v => '$' + v.toFixed(0)
          }
        }
      }
    }
  });
}

function renderSpendChart(w) {
  // Group campaigns by type
  const groups = {};
  w.campaigns.forEach(c => {
    const key = typeLabel(c.type);
    groups[key] = (groups[key] || 0) + c.spend;
  });

  const labels = Object.keys(groups);
  const data = Object.values(groups);
  const colors = [
    'rgba(79,110,247,0.75)',
    'rgba(139,92,246,0.75)',
    'rgba(56,189,248,0.75)',
    'rgba(16,185,129,0.75)'
  ];
  const borders = [
    'rgba(79,110,247,1)',
    'rgba(139,92,246,1)',
    'rgba(56,189,248,1)',
    'rgba(16,185,129,1)'
  ];

  if (spendChartInst) spendChartInst.destroy();

  const ctx = document.getElementById('spendChart').getContext('2d');
  spendChartInst = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
        borderColor: borders,
        borderWidth: 1,
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: {
          position: 'right',
          labels: {
            boxWidth: 12,
            boxHeight: 12,
            borderRadius: 3,
            useBorderRadius: true,
            padding: 14,
            font: { size: 11, weight: '600' }
          }
        },
        tooltip: {
          backgroundColor: '#18181F',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          callbacks: {
            label: ctx => ` $${fmtNum(ctx.parsed, 0)} AUD`
          }
        }
      }
    }
  });
}

/* ═══════════════════════════════════════════════════
   CAMPAIGN CARDS
═══════════════════════════════════════════════════ */

function renderCampaigns() {
  const w = dashboardData.weeks[state.week];
  const pw = dashboardData.weeks[state.week === 'current' ? 'previous' : 'current'];
  const grid = document.getElementById('campaignGrid');
  if (!grid) return;

  const totalSpend = w.campaigns.reduce((s, c) => s + c.spend, 0);

  grid.innerHTML = '';
  let shown = 0;

  w.campaigns.forEach(c => {
    const match = matchesFilter(c.name, null, null, c.type);
    if (!match) return;
    shown++;

    const prev = pw.campaigns.find(p => p.name === c.name);
    const spendPct = ((c.spend / totalSpend) * 100).toFixed(1);
    const spendDeltaEl = prev
      ? deltaHTML(c.spend, prev.spend, false)
      : '<span class="camp-delta na">New</span>';

    const card = document.createElement('div');
    card.className = 'camp-card searchable-item';
    card.dataset.name = c.name.toLowerCase();
    card.dataset.type = c.type;

    card.innerHTML = `
      <div class="camp-header">
        <div class="camp-name">${c.name}</div>
        <div class="camp-type type-${c.type}">${typeLabel(c.type)}</div>
      </div>
      <div class="camp-metrics">
        <div>
          <div class="camp-metric-label">Spend</div>
          <div class="camp-metric-value">$${fmtNum(c.spend, 0)}</div>
        </div>
        <div>
          <div class="camp-metric-label">${c.type === 'lead' ? 'Leads' : 'Reach'}</div>
          <div class="camp-metric-value">${c.type === 'lead' ? c.leads : fmtBig(c.reach)}</div>
        </div>
        <div>
          <div class="camp-metric-label">${c.type === 'lead' ? 'CPL' : 'CPM'}</div>
          <div class="camp-metric-value">${c.type === 'lead' ? '$' + (c.cpl || 0).toFixed(2) : '$' + c.cpm.toFixed(2)}</div>
        </div>
      </div>
      <div class="camp-footer">
        ${spendDeltaEl}
        <div class="camp-bar"><div class="camp-bar-fill" style="width:${Math.min(spendPct * 3, 100)}%"></div></div>
        <span style="font-size:11px;color:var(--text-muted);font-family:var(--font-mono)">${spendPct}%</span>
      </div>
    `;

    grid.appendChild(card);
  });

  if (shown === 0) {
    grid.innerHTML = '<div style="padding:40px;text-align:center;color:var(--text-muted);">No campaigns match your filters.</div>';
  }
}

/* ═══════════════════════════════════════════════════
   AD TABLE
═══════════════════════════════════════════════════ */

function renderAdTable() {
  const ads = dashboardData.ads[state.week] || dashboardData.ads.current;

  // Filter
  let filtered = ads.filter(ad => {
    const spend = ad.spend || 0;
    if (spend < 50) return false;
    return matchesFilter(ad.ad_name, ad.adset_name, ad.campaign, null);
  });

  // Sort
  filtered.sort((a, b) => {
    let av = a[state.sortCol] ?? -Infinity;
    let bv = b[state.sortCol] ?? -Infinity;
    if (typeof av === 'string') av = av.toLowerCase();
    if (typeof bv === 'string') bv = bv.toLowerCase();
    if (av < bv) return state.sortDir === 'asc' ? -1 : 1;
    if (av > bv) return state.sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  document.getElementById('adCount').textContent = filtered.length;

  // Pagination
  const totalPages = Math.ceil(filtered.length / state.rowsPerPage);
  const pageStart = (state.page - 1) * state.rowsPerPage;
  const pageData = filtered.slice(pageStart, pageStart + state.rowsPerPage);

  // Render rows
  const tbody = document.getElementById('adTableBody');
  tbody.innerHTML = '';

  pageData.forEach(ad => {
    const tr = document.createElement('tr');
    const lpvr = ad.lpv_rate || 0;
    const freq = ad.frequency || 0;
    const leads = ad.leads || 0;

    const freqClass = freq > 3.5 ? 'val-bad' : freq > 2.5 ? 'val-warn' : '';
    const lpvrClass = lpvr < 60 ? 'val-bad' : lpvr < 75 ? 'val-warn' : 'val-good';
    const cplClass = ad.cpl ? (ad.cpl > 20 ? 'val-bad' : ad.cpl > 10 ? 'val-warn' : 'val-good') : '';
    const cpmClass = ad.cpm > 50 ? 'val-bad' : ad.cpm > 25 ? 'val-warn' : '';

    const flags = buildFlagHTML(ad.flags || []);

    tr.innerHTML = `
      <td>
        <span class="ad-name-main" title="${ad.ad_name}">${ad.ad_name}</span>
        <span class="ad-name-sub">${ad.adset_name}</span>
      </td>
      <td><div class="campaign-cell" title="${ad.campaign}">${shortName(ad.campaign)}</div></td>
      <td class="num">$${fmtNum(ad.spend, 0)}</td>
      <td class="num">${fmtBig(ad.impressions)}</td>
      <td class="num">${fmtBig(ad.reach)}</td>
      <td class="num ${freqClass}">${freq.toFixed(2)}</td>
      <td class="num">${leads > 0 ? leads : '—'}</td>
      <td class="num ${cplClass}">${ad.cpl ? '$' + ad.cpl.toFixed(2) : '—'}</td>
      <td class="num ${cpmClass}">${'$' + (ad.cpm||0).toFixed(2)}</td>
      <td class="num">${((ad.ctr||0)*100).toFixed(2)}%</td>
      <td class="num ${lpvrClass}">${lpvr > 0 ? lpvr.toFixed(1) + '%' : '—'}</td>
      <td><div class="flag-cell">${flags}</div></td>
    `;
    tbody.appendChild(tr);
  });

  if (pageData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="12" style="text-align:center;padding:40px;color:var(--text-muted);">No ads match your filters.</td></tr>`;
  }

  renderPagination(totalPages);
  initSortHeaders();
}

function buildFlagHTML(flags) {
  if (!flags || flags.length === 0) return '<span style="color:var(--text-muted);font-size:10px;">—</span>';
  return flags.map(f => {
    if (f === 'BEST_CPL') return `<span class="flag-chip flag-best">⭐ Best</span>`;
    if (f === 'HIGH_CPL') return `<span class="flag-chip flag-hi-cpl">↑ CPL</span>`;
    if (f === 'HIGH_CPM') return `<span class="flag-chip flag-hi-cpm">↑ CPM</span>`;
    if (f === 'HIGH_FREQ') return `<span class="flag-chip flag-freq">Freq⚠</span>`;
    if (f === 'LOW_LPV') return `<span class="flag-chip flag-lpv">LPV↓</span>`;
    return '';
  }).join('');
}

function initSortHeaders() {
  document.querySelectorAll('.ad-table th.sortable').forEach(th => {
    th.classList.remove('sort-asc', 'sort-desc');
    if (th.dataset.col === state.sortCol) {
      th.classList.add(state.sortDir === 'asc' ? 'sort-asc' : 'sort-desc');
    }
    th.onclick = () => {
      if (state.sortCol === th.dataset.col) {
        state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortCol = th.dataset.col;
        state.sortDir = 'desc';
      }
      state.page = 1;
      renderAdTable();
    };
  });
}

function renderPagination(totalPages) {
  const container = document.getElementById('pagination');
  container.innerHTML = '';
  if (totalPages <= 1) return;

  const prevBtn = document.createElement('button');
  prevBtn.className = 'page-btn';
  prevBtn.textContent = '←';
  prevBtn.disabled = state.page === 1;
  prevBtn.onclick = () => { state.page--; renderAdTable(); };
  container.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.className = 'page-btn' + (i === state.page ? ' active' : '');
    btn.textContent = i;
    btn.onclick = () => { state.page = i; renderAdTable(); };
    container.appendChild(btn);
  }

  const nextBtn = document.createElement('button');
  nextBtn.className = 'page-btn';
  nextBtn.textContent = '→';
  nextBtn.disabled = state.page === totalPages;
  nextBtn.onclick = () => { state.page++; renderAdTable(); };
  container.appendChild(nextBtn);
}

/* ═══════════════════════════════════════════════════
   ALERTS
═══════════════════════════════════════════════════ */

function renderAlerts() {
  const w = dashboardData.weeks[state.week];
  const pw = dashboardData.weeks[state.week === 'current' ? 'previous' : 'current'];
  const container = document.getElementById('alertsContainer');
  container.innerHTML = '';

  const alerts = [];

  // PARTIAL WEEK FLAG
  if (w.partial) {
    alerts.push({
      type: 'info',
      icon: '⚡',
      title: 'Partial Week — Projections Only',
      desc: `Data covers ${w.days} of 7 days (${w.label}). All metrics are real but incompletely scaled. WoW comparisons are week-to-partial-week. Avoid structural campaign changes until the week closes.`,
      sub: `Partial week scale factor: ${w.days}/7 ≈ ${((w.days/7)*100).toFixed(0)}%`
    });
  }

  // ZERO LEADS ON HIGH SPEND CAMPAIGNS
  const highSpendNoLeads = w.campaigns.filter(c => c.spend > 500 && (c.leads === 0 || c.leads === null) && c.type !== 'awareness');
  if (highSpendNoLeads.length > 0) {
    alerts.push({
      type: 'warning',
      icon: '⚠️',
      title: `${highSpendNoLeads.length} Campaign(s): High Spend, Zero Tracked Leads`,
      desc: `Traffic and Conversion campaigns are generating spend without tracked leads. This is expected if leads are tracked via landing page, not Meta's native lead form — however confirm pixel/conversion event is firing correctly for Job Portal and Regional campaigns.`,
      sub: `Top: ${highSpendNoLeads.slice(0,2).map(c => c.name.substring(0,35)).join(' · ')}`
    });
  }

  // HIGH CPL ALERT
  const highCPL = w.campaigns.filter(c => c.cpl && c.cpl > 15);
  if (highCPL.length > 0) {
    alerts.push({
      type: 'danger',
      icon: '🔴',
      title: `High Cost per Lead: ${highCPL.map(c => shortName(c.name)).join(', ')}`,
      desc: `Seg 4 Quiz is generating leads at $${highCPL[0].cpl?.toFixed(2)} CPL — more than 4× the best-performing Seg 6 Quiz ($${dashboardData.weeks[state.week].campaigns.find(c => c.name.includes('Seg 6'))?.cpl?.toFixed(2) || '2.38'}). Review creative relevance, audience match, and form length. Reducing budget towards this ad in favour of Seg 6 and Seg 3 Quiz is recommended.`,
      sub: `Seg 4 Quiz CPM: $59.84 — 2.7× account average. Audience may be over-saturated or mis-targeted.`
    });
  }

  // BEST PERFORMER CALLOUT
  alerts.push({
    type: 'success',
    icon: '⭐',
    title: 'Best Performer: Seg 6 Quiz — $2.38 Cost per Lead',
    desc: `Seg 6 (55+ audience via Instant Forms) is the most efficient lead source at $2.38 CPL with 51 leads this week. CPM of $22.28 is in line with account averages for lead-gen. Consider increasing budget allocation to this campaign as it has headroom before frequency becomes an issue (currently 1.47×).`,
    sub: `51 leads · $121.25 spend · 3,692 reach · CTR 3.57%`
  });

  // FREQUENCY ALERTS
  const highFreqAds = (dashboardData.ads.current || []).filter(a => a.frequency > 2.5 && a.spend > 100);
  if (highFreqAds.length > 0) {
    alerts.push({
      type: 'warning',
      icon: '🔁',
      title: `${highFreqAds.length} Ads with Frequency Above 2.5× — Creative Fatigue Risk`,
      desc: `Several Regional and VIC/NSW/QLD electorate ads are showing high frequency, meaning the same Accounts Center accounts are seeing ads 2.5–2.7× per week. This compresses CTR and increases CPM over time. Priority refreshes: McEwen, Hawke, La Trobe (VIC), Dobell, Cunningham (NSW), Moncreiff (QLD).`,
      sub: `Highest: Hawke 01 (Seg 4 VIC Relaunch) – 2.73×`
    });
  }

  // JOB PORTAL NOTE
  alerts.push({
    type: 'info',
    icon: '📋',
    title: 'Job Portal Campaigns: Strong LPV Rate, No Native Leads Tracked',
    desc: `Seg 8 Job Portal (Traffic) and (Conversions) campaigns are delivering excellent landing page view rates (87–95%), suggesting strong ad-to-page relevance. However, leads appear to be tracked off-platform (external ATS/form). If you have conversion data from your CRM, feed it into Meta via offline conversions to improve optimisation signals.`,
    sub: `LPV Rate: Ad 05 (Traffic) 95.7% · Ad 01 (Conversions) 100.6% · Combined Spend: $2,909.13`
  });

  // CPM TREND
  const cpmChange = ((w.avgCPM - pw.avgCPM) / pw.avgCPM) * 100;
  if (cpmChange > 5) {
    alerts.push({
      type: 'warning',
      icon: '📈',
      title: `CPM Rising: +${cpmChange.toFixed(1)}% WoW ($${pw.avgCPM.toFixed(2)} → $${w.avgCPM.toFixed(2)})`,
      desc: `Account-blended CPM has increased week-on-week. The main driver is a higher share of spend flowing to Regional and Seg 3/4 Ethnic campaigns (CPM $7–16) vs. broad Awareness campaigns (CPM $2.70–5.87). This is expected as the account shifts to more targeted, geo-specific activity. Monitor if CPM continues to climb next week.`,
      sub: `Awareness CPM avg: $3.90 · Regional CPM avg: $12.80 · Lead Gen CPM avg: $28.03`
    });
  }

  // RENDER ALERTS
  alerts.forEach((a, i) => {
    const card = document.createElement('div');
    card.className = `alert-card alert-${a.type}`;
    card.style.setProperty('--i', i);
    card.innerHTML = `
      <div class="alert-icon">${a.icon}</div>
      <div class="alert-body">
        <div class="alert-title">${a.title}</div>
        <div class="alert-desc">${a.desc}</div>
        <div class="alert-sub">${a.sub}</div>
      </div>
    `;
    container.appendChild(card);
  });
}

/* ═══════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════ */

function matchesFilter(name, adset, campaign, type) {
  const q = state.search;
  if (q) {
    const haystack = [name, adset, campaign].filter(Boolean).join(' ').toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  if (state.campaignFilter !== 'all' && campaign && campaign !== state.campaignFilter) {
    if (name !== state.campaignFilter) return false;
  }
  if (state.statusFilter !== 'all' && type) {
    if (state.statusFilter !== type) return false;
  }
  return true;
}

function deltaHTML(current, previous, lowerBetter) {
  if (!previous) return '<span class="camp-delta na">—</span>';
  const pct = ((current - previous) / Math.abs(previous)) * 100;
  const up = pct > 0;
  const good = lowerBetter ? !up : up;
  return `<span class="camp-delta ${good ? 'up' : 'down'}">${up ? '▲' : '▼'} ${Math.abs(pct).toFixed(1)}%</span>`;
}

function typeLabel(type) {
  const map = { lead: 'Lead Gen', awareness: 'Awareness', traffic: 'Traffic' };
  return map[type] || type;
}

function shortName(name) {
  if (!name) return '';
  // Remove common suffixes
  return name
    .replace(' - Copy', '')
    .replace('– Copy', '')
    .replace('– Relaunch', '')
    .replace('06 Mar 2026', '')
    .replace('03/Mar/2026', '')
    .replace('26/Mar/2026', '')
    .replace('13/Apr/26', '')
    .replace('10/Apr/2026', '')
    .replace('(Correct form)', '')
    .replace('No Cap – Shorter Form', '')
    .trim()
    .replace(/\s+/g, ' ');
}

function fmtNum(n, dec = 2) {
  return Number(n).toLocaleString('en-AU', { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

function fmtBig(n) {
  if (!n) return '0';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
  return Math.round(n).toLocaleString();
}
