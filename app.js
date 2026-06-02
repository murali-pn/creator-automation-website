/* Pocketnori bold redesign — interactivity */
(function () {
  'use strict';

  // ── Gauge renderer ──────────────────────────────────────
  function buildGauge(svg) {
    var value = parseFloat(svg.getAttribute('data-value')) || 0;
    var color = svg.getAttribute('data-color') || '#6D28D9';
    var TICKS = 40, R = 80, INNER = 70, CX = 100, CY = 100;
    var active = Math.round((value / 100) * TICKS);
    var ns = 'http://www.w3.org/2000/svg';
    svg.innerHTML = '';
    for (var i = 0; i < TICKS; i++) {
      var t = i / (TICKS - 1);
      var a = Math.PI + t * Math.PI;
      var line = document.createElementNS(ns, 'line');
      line.setAttribute('x1', (CX + INNER * Math.cos(a)).toFixed(2));
      line.setAttribute('y1', (CY + INNER * Math.sin(a)).toFixed(2));
      line.setAttribute('x2', (CX + R * Math.cos(a)).toFixed(2));
      line.setAttribute('y2', (CY + R * Math.sin(a)).toFixed(2));
      line.setAttribute('stroke', i < active ? color : '#E5E7EB');
      line.setAttribute('stroke-width', '2.5');
      line.setAttribute('stroke-linecap', 'round');
      svg.appendChild(line);
    }
    var txt = document.createElementNS(ns, 'text');
    txt.setAttribute('x', '100'); txt.setAttribute('y', '105');
    txt.setAttribute('text-anchor', 'middle');
    txt.setAttribute('font-size', '22'); txt.setAttribute('font-weight', '700');
    txt.setAttribute('fill', '#0B0F1A');
    txt.setAttribute('font-family', "'Inter', sans-serif");
    txt.textContent = value + '%';
    svg.appendChild(txt);
  }
  document.querySelectorAll('.gauge').forEach(buildGauge);

  // ── Pricing feature list ────────────────────────────────
  var FEATURES = [
    'All automation templates',
    'Unlimited automations',
    'Real-time execution logs',
    'Connect 1 Instagram account',
    'Email support'
  ];
  var checkSVG = '<span class="check"><svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5L6.5 12L13 4.5"/></svg></span>';
  document.querySelectorAll('[data-plist]').forEach(function (ul) {
    ul.innerHTML = FEATURES.map(function (f) { return '<li>' + checkSVG + f + '</li>'; }).join('');
  });

  // ── Segmented toggles ───────────────────────────────────
  document.querySelectorAll('.seg').forEach(function (seg) {
    seg.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        seg.querySelectorAll('button').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
      });
    });
  });

  // ── Mobile menu ─────────────────────────────────────────
  var hamb = document.getElementById('hambBtn');
  var menu = document.getElementById('mobileMenu');
  if (hamb && menu) {
    hamb.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      hamb.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        hamb.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ── FAQ accordion ───────────────────────────────────────
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function (i) { i.classList.remove('open'); });
      if (!isOpen) item.classList.add('open');
    });
  });

  // ── Waitlist form → Google Sheet (via Apps Script web app) ──
  // PASTE your deployed Apps Script /exec URL here (see "Waitlist Setup.md").
  // Until then, submissions are kept in localStorage as a fallback.
  var WAITLIST_ENDPOINT = 'PASTE_YOUR_APPS_SCRIPT_EXEC_URL_HERE';

  function captureContext(email) {
    var now = new Date();
    var tz = '';
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (e) {}
    return {
      email: email,
      submittedAt: now.toISOString(),
      localTime: now.toString(),
      timezone: tz,
      page: location.href,
      referrer: document.referrer || 'direct',
      userAgent: navigator.userAgent,
      language: navigator.language || '',
      screen: (window.screen ? screen.width + 'x' + screen.height : '')
    };
  }

  function sendToSheet(data) {
    if (!WAITLIST_ENDPOINT || WAITLIST_ENDPOINT.indexOf('PASTE_') === 0) {
      // No endpoint configured yet — stash locally so nothing is lost.
      try {
        var pend = JSON.parse(localStorage.getItem('pn_waitlist') || '[]');
        pend.push(data);
        localStorage.setItem('pn_waitlist', JSON.stringify(pend));
      } catch (e) {}
      return;
    }
    var body = new FormData();
    Object.keys(data).forEach(function (k) { body.append(k, data[k]); });
    // no-cors: fire-and-forget (Apps Script doesn't return CORS headers,
    // but the row is still written server-side).
    fetch(WAITLIST_ENDPOINT, { method: 'POST', mode: 'no-cors', body: body })
      .catch(function () {});
  }

  var form = document.getElementById('waitlistForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var emailEl = document.getElementById('emailInput');
      var email = (emailEl && emailEl.value || '').trim();
      if (email) sendToSheet(captureContext(email));
      form.style.display = 'none';
      document.getElementById('thankYou').style.display = 'block';
    });
  }
})();
