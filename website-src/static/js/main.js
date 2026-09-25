/* PrintPack Lanka – site scripts (no dependencies) */
(function () {
  'use strict';
  var body = document.body;
  var ENDPOINT = body.getAttribute('data-form-endpoint') || '';
  var WA = body.getAttribute('data-wa') || '';
  var THANKS = body.getAttribute('data-thanks') || '';
  var endpointReady = ENDPOINT && ENDPOINT.indexOf('YOUR_FORM_ID') === -1;

  /* ---------- Mobile nav ---------- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      body.style.overflow = open ? 'hidden' : '';
    });
    // On mobile, first tap on a parent item expands its submenu
    nav.querySelectorAll('li.has-sub > a').forEach(function (a) {
      a.addEventListener('click', function (e) {
        if (window.innerWidth < 1024 && !a.parentNode.classList.contains('expanded')) {
          e.preventDefault();
          a.parentNode.classList.add('expanded');
        }
      });
    });
  }

  /* ---------- Attribution: source page + UTM + referrer ---------- */
  var params = new URLSearchParams(location.search);
  var utm = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'].forEach(function (k) {
    if (params.get(k)) utm[k] = params.get(k);
  });
  try {
    var stored = JSON.parse(sessionStorage.getItem('pp_utm') || '{}');
    if (Object.keys(utm).length) sessionStorage.setItem('pp_utm', JSON.stringify(utm)); else utm = stored;
    if (!sessionStorage.getItem('pp_ref') && document.referrer) sessionStorage.setItem('pp_ref', document.referrer);
  } catch (e) { /* storage blocked – fine */ }
  var utmString = Object.keys(utm).map(function (k) { return k + '=' + utm[k]; }).join('&');
  var refString = '';
  try { refString = sessionStorage.getItem('pp_ref') || ''; } catch (e) {}

  document.querySelectorAll('input[name="source_page"]').forEach(function (i) { i.value = location.href; });
  document.querySelectorAll('input[name="utm"]').forEach(function (i) { i.value = (utmString || 'direct') + (refString ? ' | ref: ' + refString : ''); });

  /* Prefill the service select from ?service= or ?industry= */
  var pre = params.get('service') || params.get('industry');
  if (pre) {
    var map = { 'packaging-boxes': 'Custom printed boxes', 'corrugated-boxes': 'Corrugated boxes', 'labels-stickers': 'Labels', 'rigid-gift-boxes': 'Rigid', 'brochures-catalogues': 'Brochures', 'business-stationery': 'Business cards', 'large-format-signage': 'Banners', 'paper-bags': 'Paper bags', 'food-packaging': 'Food packaging', 'annual-reports-books': 'Annual report', 'design-prepress': 'Design', 'offset-printing': 'Brochures', 'digital-printing': 'Business cards' };
    var needle = map[pre];
    document.querySelectorAll('select[name="service"]').forEach(function (sel) {
      if (!needle) return;
      for (var i = 0; i < sel.options.length; i++) {
        if (sel.options[i].text.indexOf(needle) === 0) { sel.selectedIndex = i; break; }
      }
    });
    var details = document.querySelector('#quoteForm textarea[name="details"]');
    if (details && params.get('industry')) details.value = 'Industry: ' + params.get('industry').replace(/-/g, ' ') + '\n';
  }

  /* ---------- Forms ---------- */
  function serialize(form) {
    var data = {};
    new FormData(form).forEach(function (v, k) { if (k !== '_gotcha') data[k] = v; });
    data.source = form.getAttribute('data-source') || '';
    return data;
  }
  function waMessage(data) {
    var lines = ['Hi, I would like a quote.'];
    if (data.name) lines.push('Name: ' + data.name);
    if (data.company) lines.push('Company: ' + data.company);
    if (data.service) lines.push('Need: ' + data.service);
    if (data.quantity) lines.push('Quantity: ' + data.quantity);
    if (data.deadline) lines.push('Needed by: ' + data.deadline);
    if (data.details) lines.push('Details: ' + data.details);
    if (data.email) lines.push('Email: ' + data.email);
    if (data.resource) lines.push('Requested download: ' + data.resource);
    return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(lines.join('\n'));
  }
  function validate(form) {
    var ok = true;
    form.querySelectorAll('[required]').forEach(function (el) {
      var bad = !el.value.trim() || (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value));
      el.setAttribute('aria-invalid', bad ? 'true' : 'false');
      if (bad) ok = false;
    });
    return ok;
  }
  function track(event, label) {
    try { if (window.gtag) gtag('event', event, { event_category: 'lead', event_label: label }); } catch (e) {}
    try { if (window.fbq) fbq('track', 'Lead', { content_name: label }); } catch (e) {}
  }

  document.querySelectorAll('form.lead-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = form.querySelector('.form-status');
      if (form.querySelector('.hp') && form.querySelector('.hp').value) return; // bot
      if (!validate(form)) { status.className = 'form-status err'; status.textContent = 'Please complete the highlighted fields.'; return; }
      var data = serialize(form);
      var btn = form.querySelector('button[type="submit"]');
      var label = btn.innerHTML;
      btn.disabled = true; btn.textContent = 'Sending…';
      status.className = 'form-status'; status.textContent = '';
      var onDone = function () {
        track('generate_lead', data.source);
        if (form.id === 'gateForm') { form.dispatchEvent(new CustomEvent('lead:ok')); btn.disabled = false; btn.innerHTML = label; return; }
        if (THANKS) location.href = THANKS + '?from=' + encodeURIComponent(data.source);
        else { status.className = 'form-status ok'; status.textContent = 'Thank you. We will reply within one working day.'; form.reset(); btn.disabled = false; btn.innerHTML = label; }
      };
      var onFail = function () {
        btn.disabled = false; btn.innerHTML = label;
        status.className = 'form-status err';
        status.innerHTML = 'We could not send this online. <a href="' + waMessage(data) + '" target="_blank" rel="noopener">Send it via WhatsApp</a> instead.';
        if (form.id === 'gateForm') form.dispatchEvent(new CustomEvent('lead:ok'));
      };
      if (!endpointReady) { // no backend configured yet: hand off to WhatsApp
        window.open(waMessage(data), '_blank');
        onDone();
        return;
      }
      fetch(ENDPOINT, { method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { if (r.ok) onDone(); else onFail(); })
        .catch(onFail);
    });
  });

  /* ---------- Gated downloads (lead magnets) ---------- */
  var modal = document.getElementById('gateModal');
  if (modal) {
    var gateForm = document.getElementById('gateForm');
    var pending = null;
    document.querySelectorAll('[data-download]').forEach(function (b) {
      b.addEventListener('click', function () {
        pending = { url: b.getAttribute('data-download'), title: b.getAttribute('data-title') };
        gateForm.querySelector('input[name="resource"]').value = pending.title;
        modal.hidden = false; body.style.overflow = 'hidden';
        setTimeout(function () { gateForm.querySelector('input[name="name"]').focus(); }, 50);
      });
    });
    var close = function () { modal.hidden = true; body.style.overflow = ''; };
    modal.querySelector('[data-close]').addEventListener('click', close);
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) close(); });
    gateForm.addEventListener('lead:ok', function () {
      if (!pending) return;
      var a = document.createElement('a'); a.href = pending.url; a.download = ''; a.rel = 'noopener'; document.body.appendChild(a); a.click(); a.remove();
      var st = gateForm.querySelector('.form-status'); st.className = 'form-status ok'; st.innerHTML = 'Your download has started. <a href="' + pending.url + '" download>Click here</a> if it did not.';
    });
  }

  /* ---------- Portfolio filter ---------- */
  var filters = document.querySelector('.filters');
  if (filters) {
    filters.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      filters.querySelectorAll('button').forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active');
      var f = b.getAttribute('data-f');
      document.querySelectorAll('.work').forEach(function (w) { w.classList.toggle('hide', f !== 'all' && w.getAttribute('data-ind') !== f); });
    });
  }

  /* ---------- Box price estimator ---------- */
  var calc = document.getElementById('calc');
  if (calc) {
    // Indicative LKR per unit at 1,000 pcs, medium size, plain varnish. Tune to your real costs.
    var base = { tuck: 48, crash: 62, mailer: 140, rigid: 520 };
    var sizeF = { s: 0.7, m: 1, l: 1.55 };
    var finishF = { none: 1, lam: 1.18, premium: 1.45 };
    var minQty = { tuck: 500, crash: 500, mailer: 100, rigid: 100 };
    function qtyFactor(type, q) {
      // fixed setup amortised: unit = base * (0.62 + 380/q) scaled to be 1 at q=1000
      var f = (0.62 + 380 / q) / (0.62 + 0.38);
      if (type === 'rigid') f = (0.8 + 200 / q) / 1.0; // hand assembly, flatter curve
      return f;
    }
    function fmt(n) { return 'LKR ' + Math.round(n).toLocaleString('en-LK'); }
    function update() {
      var t = calc.querySelector('#cType').value, s = calc.querySelector('#cSize').value, q = +calc.querySelector('#cQty').value, f = calc.querySelector('#cFinish').value;
      var unit = base[t] * sizeF[s] * finishF[f] * qtyFactor(t, q);
      var lo = unit * 0.85, hi = unit * 1.2;
      var note = q < minQty[t] ? ' (min ' + minQty[t] + ' pcs; digital short runs on request)' : '';
      calc.querySelector('#cUnit').textContent = fmt(lo) + ' – ' + fmt(hi);
      calc.querySelector('#cTotal').textContent = 'Total for ' + q.toLocaleString('en-LK') + ' pcs: ' + fmt(lo * q) + ' – ' + fmt(hi * q) + note;
      var sel = calc.querySelector('#cType');
      var summary = sel.options[sel.selectedIndex].text + ', ' + calc.querySelector('#cSize').options[calc.querySelector('#cSize').selectedIndex].text + ', ' + q + ' pcs, ' + calc.querySelector('#cFinish').options[calc.querySelector('#cFinish').selectedIndex].text + '. Estimated ' + fmt(lo) + '–' + fmt(hi) + ' per box.';
      calc.setAttribute('data-summary', summary);
    }
    calc.querySelectorAll('select').forEach(function (s) { s.addEventListener('change', update); });
    update();
    var send = document.getElementById('cSend');
    if (send) send.addEventListener('click', function () {
      var qf = document.getElementById('quoteForm'); if (!qf) return;
      var d = qf.querySelector('textarea[name="details"]'); if (d) d.value = 'Estimator: ' + calc.getAttribute('data-summary') + '\n' + d.value;
      var qty = qf.querySelector('input[name="quantity"]'); if (qty) qty.value = calc.querySelector('#cQty').value;
      var sel = qf.querySelector('select[name="service"]'); var t = calc.querySelector('#cType').value;
      var want = t === 'mailer' ? 'Corrugated' : t === 'rigid' ? 'Rigid' : 'Custom printed boxes';
      for (var i = 0; i < sel.options.length; i++) if (sel.options[i].text.indexOf(want) === 0) { sel.selectedIndex = i; break; }
      track('estimate_to_quote', t);
    });
  }

  /* ---------- Scroll reveal ---------- */
  if ('IntersectionObserver' in window) {
    var els = document.querySelectorAll('.card, .usp, .steps li, .testi, .work');
    els.forEach(function (el) { el.classList.add('reveal'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
    setTimeout(function () { els.forEach(function (el) { el.classList.add('in'); }); }, 1500); // safety net
  }

  /* ---------- Click tracking for call / WhatsApp ---------- */
  document.querySelectorAll('a[href^="tel:"]').forEach(function (a) { a.addEventListener('click', function () { track('click_call', 'phone'); }); });
  document.querySelectorAll('a[href*="wa.me"]').forEach(function (a) { a.addEventListener('click', function () { track('click_whatsapp', 'whatsapp'); }); });
})();
