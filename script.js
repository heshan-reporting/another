// ================================================================
// CL META ADS DASHBOARD — script.js
// Period: Apr 1–24, 2026 | Currency: AUD
// Attribution: 7-day click / 1-day view
// ================================================================

// ── DATA ─────────────────────────────────────────────────────
const D = {
  meta: {
    account: "CL", period: "Apr 1–24, 2026", currency: "AUD",
    attribution: "7-day click / 1-day view", geo: "Australia"
  },
  bench: { cpl: { green: 5, red: 12 }, cpm: { green: 10, red: 20 }, freqWarn: 3.5, lpvWarn: 0.70 },

  account: {
    spend: 112718.02, impressions: 17437794, reach: 8620659,
    cpm: 9.76, frequency: 2.02, link_clicks: 53510,
    lpv: 34207, lpv_rate: 0.639, results: 3882, blended_cpl: 3.75
  },

  // All campaigns — enriched with type & derived fields
  campaigns: [
    { name:"Seg 4 – Mar Creative Refresh – Awareness", type:"awareness", spend:17824.10, results:1635402, cpr:10.90, cpm:5.56, freq:1.96, lc:4056, lpv:1588, reach:1635402, imp:3204552, status:"active" },
    { name:"Seg 6 – Mar Creative Refresh – Awareness", type:"awareness", spend:11376.65, results:1322425, cpr:8.60,  cpm:3.67, freq:2.34, lc:2105, lpv:1588, reach:1322425, imp:3096985, status:"active" },
    { name:"Seg 3 – Mar Creative Refresh – April",     type:"awareness", spend:9114.05,  results:1405160, cpr:6.49,  cpm:3.16, freq:2.05, lc:1674, lpv:1948, reach:1405160, imp:2881341, status:"active" },
    { name:"Seg 8 - Job Portal (Conversions)",          type:"lead_gen",  spend:5970.35,  results:2051,    cpr:2.91,  cpm:14.78,freq:2.54, lc:7590, lpv:6890, reach:158828,  imp:403812,  status:"active" },
    { name:"Seg 3 – VIC Apr Regional Content",          type:"engagement",spend:5358.54,  results:4149,    cpr:1.29,  cpm:14.27,freq:3.35, lc:3565, lpv:2280, reach:112015,  imp:375639,  status:"active" },
    { name:"Seg 8 - Job Portal (Traffic)",              type:"traffic",   spend:5313.41,  results:9744,    cpr:0.55,  cpm:7.29, freq:1.79, lc:11130,lpv:9744, reach:407710,  imp:728479,  status:"active" },
    { name:"Seg 4 – VIC Apr Regional – Relaunch",       type:"engagement",spend:5263.56,  results:2579,    cpr:2.04,  cpm:14.29,freq:3.90, lc:2326, lpv:942,  reach:94382,   imp:368342,  status:"active" },
    { name:"Seg 4 – NSW Apr Regional Content",          type:"engagement",spend:4508.10,  results:2691,    cpr:1.67,  cpm:13.97,freq:3.49, lc:2117, lpv:884,  reach:89210,   imp:322800,  status:"active" },
    { name:"Seg 3 – NSW Apr Regional Content",          type:"engagement",spend:4498.27,  results:4056,    cpr:1.11,  cpm:11.07,freq:3.13, lc:3272, lpv:1842, reach:107500,  imp:406200,  status:"active" },
    { name:"Seg 4 – QLD Apr Regional Content",          type:"engagement",spend:4491.86,  results:2846,    cpr:1.58,  cpm:14.91,freq:3.44, lc:2049, lpv:835,  reach:88200,   imp:301400,  status:"active" },
    { name:"Seg 3 – QLD Apr Regional Content",          type:"engagement",spend:4486.80,  results:3339,    cpr:1.34,  cpm:13.95,freq:3.15, lc:2875, lpv:1423, reach:103200,  imp:321700,  status:"active" },
    { name:"Seg 3 - Quiz (Instant Forms) – Correct",   type:"lead_gen",  spend:4188.49,  results:981,     cpr:4.27,  cpm:21.19,freq:2.67, lc:1982, lpv:245,  reach:198100,  imp:197600,  status:"active" },
    { name:"Seg 3 – Ethnic Arabic Apr",                 type:"awareness", spend:3530.77,  results:285997,  cpr:12.35, cpm:12.35,freq:2.24, lc:431,  lpv:198,  reach:285997,  imp:286000,  status:"active" },
    { name:"Seg 3 – Ethnic Chinese Apr",                type:"awareness", spend:3502.19,  results:297702,  cpr:11.76, cpm:11.76,freq:2.21, lc:403,  lpv:209,  reach:297702,  imp:297800,  status:"active" },
    { name:"Seg 3 – Ethnic Hindi Apr",                  type:"awareness", spend:3497.52,  results:276503,  cpr:12.65, cpm:12.65,freq:2.29, lc:448,  lpv:224,  reach:276503,  imp:276600,  status:"active" },
    { name:"Seg 3 – Tax Awareness",                     type:"awareness", spend:2095.29,  results:545231,  cpr:3.84,  cpm:5.38, freq:1.91, lc:1032, lpv:554,  reach:545231,  imp:554700,  status:"active" },
    { name:"Seg 4 – Tax Awareness",                     type:"awareness", spend:2091.74,  results:478294,  cpr:4.37,  cpm:7.48, freq:1.98, lc:891,  lpv:374,  reach:478294,  imp:474400,  status:"active" },
    { name:"Seg 2 – Mar Batch – Awareness",             type:"awareness", spend:2267.62,  results:342617,  cpr:6.62,  cpm:6.62, freq:1.87, lc:659,  lpv:191,  reach:342617,  imp:342800,  status:"active" },
    { name:"Seg 6 - Quiz (Instant Forms)",              type:"lead_gen",  spend:1646.70,  results:576,     cpr:2.86,  cpm:26.56,freq:2.69, lc:1269, lpv:170,  reach:62000,   imp:62000,   status:"active" },
    { name:"Seg 4 - Quiz No Cap (Instant Forms)",       type:"lead_gen",  spend:1274.99,  results:75,      cpr:17.00, cpm:44.17,freq:2.04, lc:351,  lpv:30,   reach:28900,   imp:28900,   status:"active" },
    { name:"Seg 2 - Quiz (Instant Forms) No caps",      type:"lead_gen",  spend:797.98,   results:54,      cpr:14.78, cpm:17.18,freq:2.03, lc:233,  lpv:13,   reach:22800,   imp:46400,   status:"inactive" },
    { name:"Seg 8 - Job Portal (Instant Form)",         type:"lead_gen",  spend:693.38,   results:145,     cpr:4.78,  cpm:17.06,freq:2.22, lc:491,  lpv:85,   reach:18300,   imp:40600,   status:"inactive" }
  ],

  alerts: [
    { type:"warning", icon:"⚠️", title:"No WoW Comparison Available",
      msg:"Export is a single aggregated period (Apr 1–24). To unlock week-over-week analysis, upload a daily breakdown export from Meta Ads Manager → Reports → Set date range per day.",
      action:"Upload daily export" },
    { type:"critical", icon:"🚨", title:"166 / 271 Ads: Below Average Quality Ranking",
      msg:"61% of all ads carry a Below Average quality ranking — the highest level seen in this account. This actively suppresses delivery and inflates CPM. Root cause: stale creatives running too long.",
      action:"Run creative audit immediately" },
    { type:"critical", icon:"📉", title:"LPV Rate 63.9% — Below 70% Threshold",
      msg:"Account-wide landing page view rate is 63.9%. Regional content ads (Corio, La Trobe, McEwen, Ballarat) are 20–55%. Possible causes: slow mobile load time, broken URL, or ad-to-page mismatch.",
      action:"Run PageSpeed on destination URLs" },
    { type:"flag", icon:"🔁", title:"4 Ad Sets Above Frequency 3.5 — Creative Fatigue",
      msg:"La Trobe 01 (3.70), Dobell 01 (3.66), McEwen 01 (3.56), Hawke 01 (3.55). These audiences have been overexposed. Swap in new creative variants within the same ad sets to reset frequency without losing delivery.",
      action:"Refresh creatives this week" },
    { type:"flag", icon:"💸", title:"Seg 4 Quiz: $17.00 CPL — 3× Benchmark",
      msg:"75 leads at $17/lead vs $3–5 account average. Below-average quality ranking. CPM of $44.17 is 4.5× account average. This campaign is actively wasting budget at scale.",
      action:"Pause immediately & reallocate" },
    { type:"flag", icon:"💸", title:"Seg 2 Quiz: $14.78 CPL — Now Inactive",
      msg:"54 leads at $14.78/lead before going inactive. Audience likely exhausted. Do not reactivate without a new creative and audience reset.",
      action:"Do not reactivate without rebuild" }
  ],

  recos: [
    { title:"Pause Seg 4 Quiz (Instant Forms)", desc:"$17 CPL, Below Average quality, $44 CPM. Reallocate that $1,275 to Seg 6 Quiz ($2.86 CPL) or Job Portal Conversions ($2.91/conv).", effort:"low", impact:"high" },
    { title:"Scale Seg 6 Quiz — Best Lead CPL at $2.86", desc:"576 leads at $2.86 CPL with room to scale. Increase daily budget by 20–30% and monitor CPL for stability over 3 days before scaling further.", effort:"low", impact:"high" },
    { title:"Increase Job Portal Conversions Budget", desc:"2,051 GTM conversions at $2.91 each. Ad 02 ($2.41/conv, Above Average quality) is your best creative. Model new variants on its format and test.", effort:"med", impact:"high" },
    { title:"Fix LPV Rate on Regional Content Campaigns", desc:"Run PageSpeed Insights on all regional landing page URLs. Fix mobile load time (target <3s). Ensure the destination matches the ad's promise. Test with a dedicated landing page per region.", effort:"med", impact:"high" },
    { title:"Refresh Creatives on 4 Frequency-Fatigued Ad Sets", desc:"La Trobe 01, Dobell 01, McEwen 01, Hawke 01 all above 3.5 frequency. Add new creative variants within existing ad sets — do not create new ad sets (loses learning).", effort:"med", impact:"med" },
    { title:"Address Systemic Quality Ranking Crisis", desc:"166/271 ads are Below Average quality. Start a full creative audit: retire all Seg 04 Carousel formats (39% LPV rate), test new ad types (video, collection). Goal: get 50%+ of ads to Average within 4 weeks.", effort:"high", impact:"high" },
    { title:"Switch Regional Engagement Campaigns to Traffic Objective", desc:"VIC/NSW/QLD regional campaigns optimise for post engagements but LPV rates average 35–50%. If site visits are the goal, switch objective to Traffic with LPV optimisation event.", effort:"med", impact:"med" }
  ]
};

// ── UTILITIES ─────────────────────────────────────────────────
const C = { blue:"#4F6EF7", purple:"#8B5CF6", cyan:"#06B6D4", green:"#10B981", amber:"#F59E0B", red:"#EF4444", grid:"#1E1E28" };

function $id(id) { return document.getElementById(id); }
function n(v, dec=0) {
  if (v === null || v === undefined || isNaN(v)) return "—";
  return Number(v).toLocaleString("en-AU", { minimumFractionDigits: dec, maximumFractionDigits: dec });
}
function pct(v, dec=1) { return isNaN(v) ? "—" : (v * 100).toFixed(dec) + "%"; }
function cplClass(v) { return v < D.bench.cpl.green ? "val-green" : v <= D.bench.cpl.red ? "val-amber" : "val-red"; }
function cpmClass(v) { return v < D.bench.cpm.green ? "val-green" : v <= D.bench.cpm.red ? "val-amber" : "val-red"; }
function freqClass(v) { return v >= D.bench.freqWarn ? "val-red" : v >= 2.5 ? "val-amber" : "val-green"; }
function lpvClass(v)  { return v < 0.5 ? "val-red" : v < D.bench.lpvWarn ? "val-amber" : "val-green"; }
function pill(label, cls) { return `<span class="status-pill ${cls}">${label}</span>`; }
function typeBadge(t) {
  const m = { lead_gen:"badge-green", awareness:"badge-blue", engagement:"badge-amber", traffic:"badge-cyan" };
  const l = { lead_gen:"Lead Gen", awareness:"Awareness", engagement:"Engagement", traffic:"Traffic" };
  return `<span class="cc-badge ${m[t]||'badge-grey'}">${l[t]||t}</span>`;
}

function countUp(el, target, pre="", suf="", dec=0, dur=900) {
  const s = performance.now();
  function frame(now) {
    const p = Math.min((now - s) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = pre + n(target * e, dec) + suf;
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

// ── CHARTS STATE ──────────────────────────────────────────────
const charts = {};
function destroyChart(id) { if (charts[id]) { charts[id].destroy(); delete charts[id]; } }

function makeChart(id, cfg) {
  destroyChart(id);
  const ctx = $id(id)?.getContext("2d");
  if (!ctx) return;
  charts[id] = new Chart(ctx, cfg);
}

const baseScales = {
  x: { grid: { color: C.grid }, ticks: { color: "#666", font: { size: 11 } } },
  y: { grid: { color: C.grid }, ticks: { color: "#666", font: { size: 11 } } }
};

// ── NAVIGATION ────────────────────────────────────────────────
const sectionTitles = {
  overview: "Account Overview", leadgen: "Lead Generation",
  awareness: "Reach & Awareness", campaigns: "All Campaigns",
  alerts: "Alerts & Actions", recos: "Recommendations"
};

function showSection(id, el) {
  document.querySelectorAll(".page-section").forEach(s => s.classList.remove("visible"));
  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
  const sec = $id("section-" + id);
  if (sec) sec.classList.add("visible");
  if (el) el.classList.add("active");
  $id("pageTitle").textContent = sectionTitles[id] || id;
}

// ── KPI CARDS RENDERER ────────────────────────────────────────
function buildKpiCard({ icon, label, value, valueClass, sub, delta }) {
  return `<div class="kpi-card">
    <span class="kpi-icon">${icon}</span>
    <div class="kpi-label">${label}</div>
    <div class="kpi-value ${valueClass || ""}">${value}</div>
    <div class="kpi-sub">${sub}</div>
    ${delta ? `<div class="kpi-delta">${delta}</div>` : ""}
  </div>`;
}

// ── SECTION: OVERVIEW ─────────────────────────────────────────
function renderOverviewKPIs() {
  const a = D.account;
  $id("kpiGrid").innerHTML = [
    { icon:"💰", label:"Total Spend",     value:"$" + n(a.spend, 0),   sub:"Apr 1–24, 2026",              delta:"⚠️ WoW n/a — single period" },
    { icon:"🎯", label:"Leads & Convs",   value:n(a.results),           sub:"GTM + form leads",            valueClass: "val-green", delta:"Blended $3.75/result" },
    { icon:"📊", label:"Cost per Lead",   value:"$" + n(a.blended_cpl,2), sub:"Blended all conv campaigns", valueClass: cplClass(a.blended_cpl) },
    { icon:"👁️", label:"Avg CPM",         value:"$" + n(a.cpm, 2),      sub:"Weighted by spend",           valueClass: cpmClass(a.cpm) },
    { icon:"📡", label:"Total Reach",     value:n(a.reach),             sub:"Unique AU accounts" }
  ].map(buildKpiCard).join("");

  // animate numbers
  document.querySelectorAll("#kpiGrid .kpi-value").forEach((el, i) => {
    const vals = [a.spend, a.results, a.blended_cpl, a.cpm, a.reach];
    const pres  = ["$","","$","$",""];
    const decs  = [0, 0, 2, 2, 0];
    setTimeout(() => countUp(el, vals[i], pres[i], "", decs[i]), i * 120);
  });
}

function renderStatRow() {
  $id("statRow").innerHTML = [
    { label:"Total Impressions", value: n(D.account.impressions), sub:"17.4M total" },
    { label:"Avg Frequency",     value: n(D.account.frequency, 2), sub:"Healthy (<3.5)" },
    { label:"LPV Rate",          value: pct(D.account.lpv_rate), sub:"⚠️ Below 70% threshold" },
    { label:"Link Clicks",       value: n(D.account.link_clicks), sub:"53.5K total clicks" }
  ].map(s => `<div class="stat-card">
    <div class="s-label">${s.label}</div>
    <div class="s-value">${s.value}</div>
    <div class="s-sub">${s.sub}</div>
  </div>`).join("");
}

// Overview chart: CPL/Spend/Leads toggle
let currentMetric = "cpl";
let cplChartData = {};

function buildCplChartData() {
  const leads = D.campaigns.filter(c => c.type === "lead_gen" || c.type === "traffic");
  cplChartData = {
    labels: leads.map(c => c.name.length > 26 ? c.name.slice(0,26) + "…" : c.name),
    cpl:    leads.map(c => c.cpr),
    spend:  leads.map(c => c.spend),
    leads:  leads.map(c => c.results),
    colors: leads.map(c => c.cpr < D.bench.cpl.green ? C.green : c.cpr <= D.bench.cpl.red ? C.amber : C.red)
  };
}

function renderCplChart(metric = "cpl") {
  currentMetric = metric;
  buildCplChartData();
  const data  = cplChartData[metric];
  const label = metric === "cpl" ? "Cost per Result (AUD)" : metric === "spend" ? "Spend (AUD)" : "Results";
  const colors = metric === "cpl" ? cplChartData.colors : metric === "spend" ? C.blue : C.cyan;

  makeChart("cplChart", {
    type: "bar",
    data: {
      labels: cplChartData.labels,
      datasets: [{ label, data, backgroundColor: colors, borderRadius: 4, borderSkipped: false }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, indexAxis: "y",
      plugins: { legend: { display: false }, tooltip: { callbacks: {
        label: ctx => metric === "cpl" || metric === "spend" ? ` $${ctx.raw.toLocaleString("en-AU",{minimumFractionDigits:2,maximumFractionDigits:2})}` : ` ${ctx.raw.toLocaleString()}`
      }}},
      scales: {
        x: { grid:{color:C.grid}, ticks:{color:"#666"}, callback: v => metric==="leads" ? v : "$"+v },
        y: { grid:{display:false}, ticks:{color:"#ccc", font:{size:11}} }
      }
    }
  });
}

function setBarMetric(metric, btn) {
  document.querySelectorAll(".chart-toggle button").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  renderCplChart(metric);
}

function renderBudgetMixChart() {
  const spendByType = {};
  D.campaigns.forEach(c => {
    const k = c.type === "lead_gen" ? "Lead Gen" : c.type === "awareness" ? "Reach/Awareness" :
              c.type === "engagement" ? "Engagement" : "Traffic";
    spendByType[k] = (spendByType[k] || 0) + c.spend;
  });
  makeChart("barChart", {
    type: "doughnut",
    data: {
      labels: Object.keys(spendByType),
      datasets: [{ data: Object.values(spendByType),
        backgroundColor: [C.green, C.blue, C.amber, C.cyan],
        borderWidth: 2, borderColor: "#111118" }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: "62%",
      plugins: {
        legend: { position:"bottom", labels:{ color:"#999", padding:12, font:{size:11} } },
        tooltip: { callbacks: { label: ctx => ` $${n(ctx.raw,0)} (${(ctx.raw/D.account.spend*100).toFixed(1)}%)` }}
      }
    }
  });
}

function renderFreqCpmBubble() {
  const data = D.campaigns.map(c => ({
    x: c.freq, y: c.cpm, r: Math.max(4, Math.sqrt(c.spend) / 3.5),
    label: c.name.slice(0,28), spend: c.spend
  }));
  makeChart("trendChart", {
    type: "bubble",
    data: { datasets: [{ label:"Campaigns", data,
      backgroundColor: data.map(d => d.x >= D.bench.freqWarn ? "rgba(239,68,68,0.55)" : d.x >= 2.5 ? "rgba(245,158,11,0.55)" : "rgba(79,110,247,0.55)"),
      borderColor: "transparent"
    }]},
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend:{display:false}, tooltip:{ callbacks:{
        label: ctx => `${ctx.raw.label} | Freq: ${ctx.raw.x.toFixed(2)} | CPM: $${ctx.raw.y.toFixed(2)} | Spend: $${n(ctx.raw.spend,0)}`
      }}},
      scales: {
        x: { title:{display:true,text:"Frequency",color:"#666"}, grid:{color:C.grid}, ticks:{color:"#666"}, min:0 },
        y: { title:{display:true,text:"CPM (AUD)",color:"#666"}, grid:{color:C.grid}, ticks:{color:"#666",callback:v=>"$"+v} }
      }
    }
  });
}

// ── SECTION: LEAD GENERATION ──────────────────────────────────
function renderLeadKPIs() {
  const leads = D.campaigns.filter(c => c.type === "lead_gen");
  const totalSpend  = leads.reduce((s,c) => s + c.spend, 0);
  const totalLeads  = leads.reduce((s,c) => s + c.results, 0);
  const blendedCPL  = totalSpend / totalLeads;
  const bestCPL     = Math.min(...leads.map(c => c.cpr));
  const worstCPL    = Math.max(...leads.map(c => c.cpr));

  $id("leadKpiGrid").innerHTML = [
    { icon:"💸", label:"Lead Campaign Spend", value:"$"+n(totalSpend,0), sub:"Across 6 lead-gen campaigns" },
    { icon:"🎯", label:"Total Leads / Convs",  value:n(totalLeads),       sub:"GTM + instant form leads", valueClass:"val-green" },
    { icon:"📊", label:"Blended CPL",          value:"$"+n(blendedCPL,2), sub:"All lead campaigns",       valueClass:cplClass(blendedCPL) },
    { icon:"✅", label:"Best CPL",             value:"$"+n(bestCPL,2),    sub:"Seg 8 Job Portal Conv",    valueClass:"val-green" },
    { icon:"🚨", label:"Worst CPL",            value:"$"+n(worstCPL,2),   sub:"Seg 4 Quiz — pause now",   valueClass:"val-red" }
  ].map(buildKpiCard).join("");
}

function renderLeadCplChart() {
  const leads = D.campaigns.filter(c => c.type === "lead_gen");
  makeChart("leadCplWeeklyChart", {
    type: "bar",
    data: {
      labels: leads.map(c => c.name.length > 24 ? c.name.slice(0,24)+"…" : c.name),
      datasets: [{ label:"CPL (AUD)",
        data: leads.map(c => c.cpr),
        backgroundColor: leads.map(c => c.cpr < D.bench.cpl.green ? C.green : c.cpr <= D.bench.cpl.red ? C.amber : C.red),
        borderRadius:4, borderSkipped:false }]
    },
    options: {
      responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{display:false}, tooltip:{callbacks:{label:ctx=>` $${ctx.raw.toFixed(2)}`}}},
      scales:{
        x:{grid:{display:false},ticks:{color:"#666",font:{size:10}}},
        y:{grid:{color:C.grid},ticks:{color:"#666",callback:v=>"$"+v}}
      }
    }
  });
}

function renderLeadVolumeChart() {
  const leads = D.campaigns.filter(c => c.type === "lead_gen");
  makeChart("leadVolumeChart", {
    type:"bar",
    data:{
      labels: leads.map(c => c.name.length>22?c.name.slice(0,22)+"…":c.name),
      datasets:[{label:"Results/Leads",
        data: leads.map(c=>c.results),
        backgroundColor: C.cyan, borderRadius:4, borderSkipped:false
      }]
    },
    options:{
      responsive:true,maintainAspectRatio:false,
      plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>` ${n(ctx.raw)} results`}}},
      scales:{
        x:{grid:{display:false},ticks:{color:"#666",font:{size:10}}},
        y:{grid:{color:C.grid},ticks:{color:"#666"}}
      }
    }
  });
}

function renderLeadCampaignCards() {
  const leads = D.campaigns.filter(c => c.type === "lead_gen");
  $id("leadCampaignGrid").innerHTML = leads.map(c => {
    const lpvRate = c.lpv / c.lc;
    let alertHtml = "";
    if (c.cpr > D.bench.cpl.red) alertHtml = `<div class="cc-alert red">🚨 CPL $${c.cpr.toFixed(2)} — ${c.cpr > 15 ? "Pause immediately" : "Above red threshold"}</div>`;
    else if (c.cpr > D.bench.cpl.green) alertHtml = `<div class="cc-alert">⚠️ CPL $${c.cpr.toFixed(2)} — Monitor closely</div>`;
    else alertHtml = `<div class="cc-alert green">✅ CPL $${c.cpr.toFixed(2)} — Performing well</div>`;
    if (lpvRate < D.bench.lpvWarn) alertHtml += `<div class="cc-alert">📉 LPV rate ${pct(lpvRate)} — check landing page</div>`;

    return `<div class="campaign-card">
      <div class="cc-header">
        <div class="cc-name">${c.name}</div>
        ${typeBadge(c.type)}
      </div>
      <div class="cc-metrics">
        <div class="cc-metric">
          <div class="m-label">Results</div>
          <div class="m-value ${c.results > 500 ? "val-green" : ""}">${n(c.results)}</div>
        </div>
        <div class="cc-metric">
          <div class="m-label">CPL</div>
          <div class="m-value ${cplClass(c.cpr)}">$${n(c.cpr,2)}</div>
        </div>
        <div class="cc-metric">
          <div class="m-label">Spend</div>
          <div class="m-value">$${n(c.spend,0)}</div>
        </div>
        <div class="cc-metric">
          <div class="m-label">CPM</div>
          <div class="m-value ${cpmClass(c.cpm)}">$${n(c.cpm,2)}</div>
        </div>
      </div>
      <hr class="cc-divider">
      <div class="cc-metrics">
        <div class="cc-metric">
          <div class="m-label">Link Clicks</div>
          <div class="m-value">${n(c.lc)}</div>
        </div>
        <div class="cc-metric">
          <div class="m-label">LPV Rate</div>
          <div class="m-value ${lpvClass(lpvRate)}">${pct(lpvRate)}</div>
        </div>
      </div>
      ${alertHtml}
    </div>`;
  }).join("");
}

// ── SECTION: AWARENESS ────────────────────────────────────────
function renderAwarenessKPIs() {
  const aw = D.campaigns.filter(c => c.type === "awareness");
  const totalSpend  = aw.reduce((s,c) => s+c.spend, 0);
  const totalReach  = aw.reduce((s,c) => s+c.reach, 0);
  const totalImp    = aw.reduce((s,c) => s+c.imp, 0);
  const avgFreq     = aw.reduce((s,c)=>s+(c.freq*c.reach),0) / totalReach;
  const avgCPM      = totalSpend / totalImp * 1000;

  $id("awarenessKpiGrid").innerHTML = [
    { icon:"📡", label:"Awareness Spend",  value:"$"+n(totalSpend,0), sub:"8 awareness campaigns" },
    { icon:"👥", label:"Total Reach",       value:n(totalReach),       sub:"Unique AU accounts" },
    { icon:"📄", label:"Total Impressions", value:n(totalImp),         sub:"Gross impression count" },
    { icon:"🔄", label:"Avg Frequency",     value:n(avgFreq,2),        sub:"Impressions per person",  valueClass:avgFreq>3.5?"val-red":avgFreq>2.5?"val-amber":"val-green" },
    { icon:"💵", label:"Blended CPM",       value:"$"+n(avgCPM,2),     sub:"Weighted by impressions", valueClass:cpmClass(avgCPM) }
  ].map(buildKpiCard).join("");
}

function renderReachChart() {
  const aw = D.campaigns.filter(c => c.type === "awareness").sort((a,b)=>b.reach-a.reach);
  makeChart("reachChart",{
    type:"bar",
    data:{
      labels: aw.map(c=>c.name.length>24?c.name.slice(0,24)+"…":c.name),
      datasets:[{label:"Reach",data:aw.map(c=>c.reach),backgroundColor:C.blue,borderRadius:4,borderSkipped:false}]
    },
    options:{
      responsive:true,maintainAspectRatio:false,indexAxis:"y",
      plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>` ${n(ctx.raw)} accounts`}}},
      scales:{x:{grid:{color:C.grid},ticks:{color:"#666"}},y:{grid:{display:false},ticks:{color:"#ccc",font:{size:11}}}}
    }
  });
}

function renderCPMChart() {
  const aw = D.campaigns.filter(c=>c.type==="awareness").sort((a,b)=>b.cpm-a.cpm);
  makeChart("cpmChart",{
    type:"bar",
    data:{
      labels:aw.map(c=>c.name.length>22?c.name.slice(0,22)+"…":c.name),
      datasets:[{label:"CPM (AUD)",data:aw.map(c=>c.cpm),
        backgroundColor:aw.map(c=>c.cpm<D.bench.cpm.green?C.green:c.cpm<=D.bench.cpm.red?C.amber:C.red),
        borderRadius:4,borderSkipped:false}]
    },
    options:{
      responsive:true,maintainAspectRatio:false,
      plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>` $${ctx.raw.toFixed(2)}`}}},
      scales:{
        x:{grid:{display:false},ticks:{color:"#666",font:{size:10}}},
        y:{grid:{color:C.grid},ticks:{color:"#666",callback:v=>"$"+v}}
      }
    }
  });
}

function renderAwarenessCampaignCards() {
  const aw = D.campaigns.filter(c=>c.type==="awareness");
  $id("awarenessCampaignGrid").innerHTML = aw.map(c => {
    let alertHtml = c.freq > D.bench.freqWarn
      ? `<div class="cc-alert red">🔁 Freq ${c.freq.toFixed(2)} — creative refresh needed</div>`
      : c.freq > 2.5
      ? `<div class="cc-alert">⚠️ Freq ${c.freq.toFixed(2)} — watch closely</div>`
      : `<div class="cc-alert green">✅ Freq ${c.freq.toFixed(2)} — healthy</div>`;

    return `<div class="campaign-card">
      <div class="cc-header">
        <div class="cc-name">${c.name}</div>
        ${typeBadge(c.type)}
      </div>
      <div class="cc-metrics">
        <div class="cc-metric">
          <div class="m-label">Reach</div>
          <div class="m-value">${n(c.reach)}</div>
        </div>
        <div class="cc-metric">
          <div class="m-label">CPM</div>
          <div class="m-value ${cpmClass(c.cpm)}">$${n(c.cpm,2)}</div>
        </div>
        <div class="cc-metric">
          <div class="m-label">Spend</div>
          <div class="m-value">$${n(c.spend,0)}</div>
        </div>
        <div class="cc-metric">
          <div class="m-label">Frequency</div>
          <div class="m-value ${freqClass(c.freq)}">${n(c.freq,2)}</div>
        </div>
      </div>
      ${alertHtml}
    </div>`;
  }).join("");
}

// ── SECTION: ALL CAMPAIGNS TABLE ──────────────────────────────
let tableSortCol = "spend";
let tableSortDir = -1;
let tableCurrentPage = 1;
const TABLE_PER_PAGE = 10;

function getFilteredCampaigns() {
  const search = ($id("searchInput")?.value || "").toLowerCase();
  const type   = $id("typeFilter")?.value || $id("campaignTypeFilter")?.value || "";
  return D.campaigns.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search);
    const matchType   = !type || c.type === type;
    return matchSearch && matchType;
  });
}

function sortTableBy(col) {
  if (tableSortCol === col) tableSortDir *= -1;
  else { tableSortCol = col; tableSortDir = -1; }
  renderTable();
}

function filterTable() { tableCurrentPage = 1; renderTable(); }

function renderTable() {
  let data = getFilteredCampaigns();
  data.sort((a,b) => {
    let va, vb;
    switch(tableSortCol) {
      case "name":        va=a.name; vb=b.name; break;
      case "type":        va=a.type; vb=b.type; break;
      case "spend":       va=a.spend; vb=b.spend; break;
      case "impressions": va=a.imp; vb=b.imp; break;
      case "reach":       va=a.reach; vb=b.reach; break;
      case "frequency":   va=a.freq; vb=b.freq; break;
      case "cpm":         va=a.cpm; vb=b.cpm; break;
      case "leads":       va=a.results; vb=b.results; break;
      case "cpl":         va=a.cpr; vb=b.cpr; break;
      default:            va=a.spend; vb=b.spend;
    }
    return tableSortDir * (va > vb ? 1 : va < vb ? -1 : 0);
  });

  const start = (tableCurrentPage - 1) * TABLE_PER_PAGE;
  const page  = data.slice(start, start + TABLE_PER_PAGE);

  $id("campaignTableBody").innerHTML = page.map(c => {
    const lpvRate = c.lpv / c.lc;
    const statusCls = c.status === "active" ? "badge-green" : "badge-grey";
    const cprDisplay = c.type === "awareness" ? `<span class="td-mono">${n(c.results)}</span><div style="font-size:10px;color:var(--text-3)">reach</div>` : `<span class="td-mono ${cplClass(c.cpr)}">$${n(c.cpr,2)}</span>`;

    return `<tr>
      <td title="${c.name}">${c.name.length > 42 ? c.name.slice(0,42)+"…" : c.name}</td>
      <td>${typeBadge(c.type)}</td>
      <td class="td-mono">$${n(c.spend,0)}</td>
      <td class="td-mono">${n(c.imp)}</td>
      <td class="td-mono">${n(c.reach)}</td>
      <td class="td-mono ${freqClass(c.freq)}">${n(c.freq,2)}</td>
      <td class="td-mono ${cpmClass(c.cpm)}">$${n(c.cpm,2)}</td>
      <td class="td-mono">${c.type !== "awareness" ? n(c.results) : "—"}</td>
      <td>${c.type !== "awareness" ? `<span class="td-mono ${cplClass(c.cpr)}">$${n(c.cpr,2)}</span>` : "—"}</td>
      <td><span class="status-pill ${statusCls}">${c.status}</span></td>
    </tr>`;
  }).join("");

  // Pagination
  const totalPages = Math.ceil(data.length / TABLE_PER_PAGE);
  let pages = "";
  for (let i = 1; i <= totalPages; i++) {
    pages += `<button class="${i===tableCurrentPage?"active":""}" onclick="goPage(${i})">${i}</button>`;
  }
  $id("tablePagination").innerHTML = pages;
}

function goPage(p) { tableCurrentPage = p; renderTable(); }

function onWeekChange() {
  // In this single-period dataset, week selector is UI only
  const sel = $id("weekSelector").value;
  $id("syncBadge").textContent = sel === "full" ? "⚡ Full Period · AUD" : `⚡ ${sel.toUpperCase()} · AUD`;
}

// ── SECTION: ALERTS ───────────────────────────────────────────
function renderAlerts() {
  $id("alertsGrid").innerHTML = D.alerts.map(a => `
    <div class="alert-card ${a.type}">
      <div class="alert-icon">${a.icon}</div>
      <div class="alert-body">
        <div class="alert-title">${a.title}</div>
        <div class="alert-msg">${a.msg}</div>
        <span class="alert-action">→ ${a.action}</span>
      </div>
    </div>
  `).join("");
  $id("alertBadge").textContent = D.alerts.length;
}

// ── SECTION: RECOMMENDATIONS ──────────────────────────────────
const effortMap  = { low:"effort-low",  med:"effort-med",  high:"effort-high" };
const impactMap  = { low:"impact-low",  med:"impact-med",  high:"impact-high" };

function renderRecos() {
  $id("recoList").innerHTML = D.recos.map((r, i) => `
    <div class="reco-row">
      <div class="reco-num">${String(i+1).padStart(2,"0")}</div>
      <div class="reco-content">
        <div class="reco-title">${r.title}</div>
        <div class="reco-desc">${r.desc}</div>
      </div>
      <div><span class="effort-pill ${effortMap[r.effort]}">${r.effort.charAt(0).toUpperCase()+r.effort.slice(1)}</span></div>
      <div><span class="impact-pill ${impactMap[r.impact]}">${r.impact.charAt(0).toUpperCase()+r.impact.slice(1)}</span></div>
    </div>
  `).join("");
}

// ── INIT ──────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {

  // Overview
  renderOverviewKPIs();
  renderStatRow();
  buildCplChartData();
  setTimeout(() => {
    renderCplChart("cpl");
    renderBudgetMixChart();
    renderFreqCpmBubble();
  }, 150);

  // Lead Gen
  renderLeadKPIs();
  renderLeadCampaignCards();
  setTimeout(() => {
    renderLeadCplChart();
    renderLeadVolumeChart();
  }, 200);

  // Awareness
  renderAwarenessKPIs();
  renderAwarenessCampaignCards();
  setTimeout(() => {
    renderReachChart();
    renderCPMChart();
  }, 250);

  // Campaigns table
  renderTable();

  // Alerts & Recos
  renderAlerts();
  renderRecos();
});
