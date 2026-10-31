(function () {
  var S = window.SITE || {}, T = window.DI_T || {};
  var lang = 'en';
  try { lang = localStorage.getItem('mi_lang') || 'en'; } catch (e) {}
  if (!T[lang]) lang = 'en';
  function t(k) { return (T[lang] && T[lang][k]) || (T.en && T.en[k]) || ''; }

  // ---- Language
  function apply() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n')); if (v) el.textContent = v;
    });
    var sel = document.getElementById('lang'); if (sel) sel.value = lang;
  }
  var sel = document.getElementById('lang');
  if (sel) sel.addEventListener('change', function () {
    lang = sel.value; try { localStorage.setItem('mi_lang', lang); } catch (e) {} apply();
  });
  apply();

  // ---- Social icons (links come from assets/config.js; empty ones are hidden)
  var ICON = {
    instagram: '<svg viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6"/></svg>',
    facebook: '<svg viewBox="0 0 24 24"><path d="M14 8.5h2.8V4.8H14c-2.3 0-4 1.700-4 4v2H7.2v3.700H10V21h3.800v-6.500h2.800l.6-3.700h-3.400v-1.800c0-.3.200-.5.500-.5z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24"><rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10.200 9.300v5.400l4.600-2.700z"/></svg>'
  };
  document.querySelectorAll('[data-social]').forEach(function (box) {
    var n = 0;
    ['instagram', 'facebook', 'youtube'].forEach(function (k) {
      var u = S.social && S.social[k]; if (!u) return;
      var a = document.createElement('a'); a.href = u; a.target = '_blank'; a.rel = 'noopener';
      a.setAttribute('aria-label', k); a.innerHTML = ICON[k]; box.appendChild(a); n++;
    });
    if (!n) box.hidden = true;
  });

  // ---- Mobile menu
  var burger = document.getElementById('burger'), nav = document.getElementById('nav');
  if (burger) burger.addEventListener('click', function () {
    var o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', o ? 'true' : 'false');
  });

  // ---- Lightbox
  var lb = document.getElementById('lightbox');
  document.addEventListener('click', function (e) {
    var z = e.target.closest('[data-zoom]');
    if (z) { lb.querySelector('img').src = z.getAttribute('data-zoom'); lb.hidden = false; document.body.classList.add('noscroll'); }
  });
  function closeLb() { lb.hidden = true; document.body.classList.remove('noscroll'); }
  lb.addEventListener('click', closeLb);

  // ---- Contact page: project pre-fill (?project=Westwyn%20County)
  var proj = '';
  try { proj = new URLSearchParams(location.search).get('project') || ''; } catch (e) {}
  var pill = document.getElementById('projPill');
  if (proj && pill) { pill.textContent = proj; pill.classList.add('on'); }

  // ---- Send a lead. 1) your own server (PHP on Hostinger)  2) Web3Forms (for GitHub Pages testing)
  var started = Date.now();
  function post(fd, obj) {
    return fetch('api/lead.php', { method: 'POST', body: fd })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (j) { if (!j || !j.ok) throw 0; return true; })
      .catch(function () {
        if (!S.web3formsKey) return false;
        obj.access_key = S.web3formsKey; obj.subject = 'New lead – ' + (obj.name || '') + ' (' + (obj.phone || '') + ')';
        obj.from_name = 'Mohnish Infratech Website';
        return fetch('https://api.web3forms.com/submit', {
          method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(obj)
        }).then(function (r) { return r.json(); }).then(function (j) { return !!(j && j.success); }).catch(function () { return false; });
      });
  }

  function submitForm(form, onOk) {
    var msg = form.querySelector('.msg'), btn = form.querySelector('button[type=submit]'), fb = form.querySelector('.wa-fallback');
    msg.className = 'msg'; msg.textContent = ''; if (fb) fb.hidden = true;
    var name = form.name.value.trim(), digits = form.phone.value.replace(/\D/g, '');
    if (name.length < 2 || digits.length < 10 || digits.length > 15 || (form.source && !form.source.value)) {
      msg.className = 'msg err'; msg.textContent = t('f_invalid') + (form.source && !form.source.value ? ' / ' + t('f_select') : ''); return;
    }
    var page = location.pathname.split('/').pop() || 'index.html';
    var obj = { name: name, phone: form.phone.value.trim(), email: form.email.value.trim(), source: form.source ? form.source.value : '',
                message: (form.message ? form.message.value.trim() : '') + (proj && form.message ? (form.message.value.trim() ? '\n' : '') + 'Project: ' + proj : ''),
                type: form.type.value, lang: lang, page: page, botcheck: form.website.value };
    if (!form.message && proj) obj.message = 'Project: ' + proj;
    var fd = new FormData(); Object.keys(obj).forEach(function (k) { fd.append(k, obj[k]); });
    fd.append('website', form.website.value); fd.append('elapsed', String(Date.now() - started));
    if (obj.botcheck) { onOk(); return; }
    var label = btn.textContent; btn.disabled = true; btn.textContent = t('f_sending');
    post(fd, obj).then(function (ok) {
      btn.disabled = false; btn.textContent = label;
      if (ok) { try { localStorage.setItem('mi_lead', String(Date.now())); } catch (e) {} onOk(); }
      else {
        msg.className = 'msg err'; msg.textContent = t('wc_fail');
        if (fb) {
          var text = 'Hello Mohnish Infratech, I am ' + name + ', ' + form.phone.value.trim() + '. Please contact me.';
          fb.href = 'https://wa.me/' + S.phone + '?text=' + encodeURIComponent(text); fb.hidden = false;
        }
      }
    });
  }

  var cf = document.getElementById('contactForm');
  if (cf) cf.addEventListener('submit', function (e) {
    e.preventDefault();
    submitForm(cf, function () { var m = cf.querySelector('.msg'); m.className = 'msg ok'; m.textContent = t('f_ok'); cf.reset(); });
  });

  // ---- Popup (3 seconds after the page opens)
  var modal = document.getElementById('leadModal');
  if (modal) {
    var form = document.getElementById('popForm'), wrap = document.getElementById('popFormWrap'), thanks = document.getElementById('popThanks');
    var show = function () { modal.hidden = false; document.body.classList.add('noscroll'); setTimeout(function () { try { form.name.focus(); } catch (e) {} }, 150); };
    var hide = function () { modal.hidden = true; document.body.classList.remove('noscroll'); try { sessionStorage.setItem('mi_pop_closed', '1'); } catch (e) {} };
    document.getElementById('popX').addEventListener('click', hide);
    document.getElementById('popClose').addEventListener('click', hide);
    modal.addEventListener('click', function (e) { if (e.target === modal) hide(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { if (!modal.hidden) hide(); if (!lb.hidden) closeLb(); } });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      submitForm(form, function () { wrap.hidden = true; thanks.hidden = false; });
    });
    var done = false, closed = false;
    try {
      var ts = parseInt(localStorage.getItem('mi_lead') || '0', 10);
      done = ts && (Date.now() - ts) < 30 * 24 * 3600 * 1000;
      closed = sessionStorage.getItem('mi_pop_closed') === '1';
    } catch (e) {}
    if (!done && !closed && document.body.getAttribute('data-page') !== 'contact') setTimeout(show, S.popupDelay || 3000);
  }
})();
