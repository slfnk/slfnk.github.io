// ============================================================
// GUIIDES PROFILE PAGE — shared by every /by/<handle>/ page
// Reads /by/<handle>/profile.md for the person, and /guides.json for the
// guides whose "Profile:" line points here. Needs /app/parser.js first.
// ============================================================
(function () {
  const HANDLE = (function () {
    const d = document.body.dataset.profile;
    if (d && /^[a-z0-9-]+$/.test(d)) return d;
    return (location.pathname.split('/').filter(Boolean)[1] || '').toLowerCase();
  })();
  const TILES = {
    light: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=cb1_2thp_1_6ffbb574555fa573f30768f0',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=cb1_2thp_1_6ffbb574555fa573f30768f0'
  };
  const ACCENTS = ['#038f9e', '#D95B43', '#C4A035', '#4A6FA5', '#C96B8B', '#6B8291', '#2AAA8A'];

  // Same reader settings as the guide pages (theme + accent)
  let dark = false;
  try {
    dark = localStorage.getItem('vg-dark') === '1';
    const saved = localStorage.getItem('vg-accent') || '';
    const a = /^#[0-9a-fA-F]{3,8}$/.test(saved) ? saved : ACCENTS[parseInt(saved, 10)];
    if (a) document.documentElement.style.setProperty('--accent', a);
  } catch (e) {}
  document.documentElement.classList.toggle('dark', dark);

  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // [text](https://…) and bare https:// links, after escaping
  const rich = s => esc(s)
    .replace(/\[([^\]\n]+)\]\((https?:\/\/[^\s)"'<>]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/(^|[\s(])(https?:\/\/[^\s<>"']+?)([.,;:!?)]*)(?=\s|$)/g, '$1<a href="$2" target="_blank" rel="noopener">$2</a>$3');

  const ICON = {
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>',
    web: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z"/></svg>',
    lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>'
  };
  function linkLabel(u) {
    let h = '';
    try { h = new URL(u).hostname.replace(/^www\./, '').toLowerCase(); } catch (e) { return 'Link'; }
    const is = d => h === d || h.endsWith('.' + d);
    if (is('instagram.com')) return 'Instagram';
    if (is('facebook.com')) return 'Facebook';
    if (is('tiktok.com')) return 'TikTok';
    if (is('x.com') || is('twitter.com')) return 'X';
    if (is('youtube.com') || is('youtu.be')) return 'YouTube';
    if (is('threads.net')) return 'Threads';
    if (is('substack.com')) return 'Substack';
    return h || 'Website';
  }

  document.body.insertAdjacentHTML('afterbegin',
    '<div class="pf-wrap">' +
    '<div class="pf-top"><a href="/" class="pf-brand">⛺︎ <strong>GUIIDES</strong> ⛺︎</a></div>' +
    '<main id="pf"><p class="pf-msg">Loading…</p></main>' +
    '</div>');
  const main = document.getElementById('pf');

  const get = url => fetch(url, { cache: 'no-cache' }).then(r => r.ok ? r.text() : Promise.reject(new Error(r.status)));

  // Authors who sign in by email keep their profile in the database; this page
  // then arrives through /404.html with data-source="db". GitHub profiles are files.
  const FROM_DB = document.body.dataset.source === 'db';
  const CFG = window.GUIIDES || {};
  const db = q => fetch(CFG.supabaseUrl + '/rest/v1/' + q, { headers: { apikey: CFG.supabaseKey }, cache: 'no-cache' })
    .then(r => r.ok ? r.json() : Promise.reject(new Error(r.status)));
  const loadProfile = FROM_DB
    ? db('profiles?select=handle,name,location,photo,bio,links&handle=eq.' + encodeURIComponent(HANDLE)).then(rows => {
        const r = rows && rows[0];
        if (!r) throw new Error('none');
        return { name: r.name, location: r.location, photo: r.photo, banner: '', links: r.links || [],
          bio: String(r.bio || '').split(/\n\s*\n/).map(x => x.replace(/\s*\n\s*/g, ' ').trim()).filter(Boolean) };
      })
    : get('/by/' + HANDLE + '/profile.md').then(parseProfileMd);
  loadProfile
    .then(render)
    .catch(() => {
      main.innerHTML = '<p class="pf-msg">There\'s no profile at this address. <a href="/">Back to GUIIDES</a></p>';
    });

  function render(p) {
    const name = p.name || HANDLE;
    document.title = name + ' — GUIIDES';
    main.innerHTML =
      '<header class="pf-head">' +
      (/^https?:\/\//i.test(p.photo) ? '<img class="pf-photo" src="' + esc(p.photo) + '" alt="">' : '') +
      '<h1 class="pf-name">' + esc(name) + '</h1>' +
      (p.location ? '<p class="pf-where">' + esc(p.location) + '</p>' : '') +
      '<div class="pf-banner" id="pfBanner" role="presentation"></div>' +
      '</header>' +
      (p.bio.length ? '<section class="pf-bio">' + p.bio.map(x => '<p>' + rich(x) + '</p>').join('') + '</section>' : '') +
      (p.links.length ? '<nav class="pf-links" aria-label="Links">' + p.links.map(u => {
        const l = linkLabel(u);
        return '<a href="' + esc(u) + '" target="_blank" rel="noopener">' + (l === 'Instagram' ? ICON.ig : ICON.web) + esc(l) + '</a>';
      }).join('') + '</nav>' : '') +
      '<section class="pf-guides"><h2>Guides</h2><ul class="pf-list" id="pfList"><li class="pf-empty">Loading guides…</li></ul></section>';

    // Banner: "Banner:" in profile.md, otherwise a new one each visit
    const el = document.getElementById('pfBanner');
    const c = bannerChoice(p.banner);
    if (c === 'none') el.classList.add('failed');
    else {
      const src = '/banners/banner_' + (c === 'random' ? 1 + Math.floor(Math.random() * BANNER_COUNT) : c) + '.webp';
      const img = new Image();
      img.onload = () => { el.style.backgroundImage = 'url(' + src + ')'; el.classList.add('loaded'); };
      img.onerror = () => el.classList.add('failed');
      img.src = src;
    }
    loadGuides();
  }

  function loadGuides() {
    const list = document.getElementById('pfList');
    if (FROM_DB) {
      db('guides?select=slug,title,markdown&visibility=eq.public&order=created_at.asc&handle=eq.' + encodeURIComponent(HANDLE))
        .then(rows => {
          if (!rows.length) { list.innerHTML = '<li class="pf-empty">No guides published yet.</li>'; return; }
          list.innerHTML = rows.map(g => guideRow(g, '/by/' + HANDLE + '/' + g.slug + '/')).join('');
          rows.forEach(g => fillFromText(g, g.markdown));
        })
        .catch(() => { list.innerHTML = '<li class="pf-empty">The guide list couldn\'t be loaded. Try again in a moment.</li>'; });
      return;
    }
    get('/guides.json')
      .then(t => JSON.parse(t).guides || [])
      .then(all => {
        const mine = all.filter(g => g.profile === HANDLE && g.published !== false);
        if (!mine.length) { list.innerHTML = '<li class="pf-empty">No guides published yet.</li>'; return; }
        list.innerHTML = mine.map(g => guideRow(g, '/' + (g.path || g.slug) + '/')).join('');
        mine.forEach(fillGuide);
      })
      .catch(() => { list.innerHTML = '<li class="pf-empty">The guide list couldn\'t be loaded. Try again in a moment.</li>'; });
  }

  function guideRow(g, href) {
    return '<li class="pf-row"><a href="' + esc(href) + '">' +
      '<div class="pf-map" id="pfm-' + esc(g.slug) + '"><div class="m"></div></div>' +
      '<div><p class="pf-meta" id="pfmeta-' + esc(g.slug) + '">&nbsp;</p>' +
      '<h3 class="pf-title">' + esc(g.title || g.slug) + '</h3>' +
      '<p class="pf-deck" id="pfdeck-' + esc(g.slug) + '"></p></div>' +
      '</a></li>';
  }
  function fillGuide(g) {
    get('/' + (g.path || g.slug) + '/places.md').then(text => fillFromText(g, text)).catch(() => {
      document.getElementById('pfmeta-' + g.slug).textContent = '';
    });
  }
  function fillFromText(g, text) {
    {
      const data = parsePlacesMd(text), gd = data.guide;
      const locked = !!gd.locked;
      const nk = k => data.places.filter(p => (p.kind || 'spot') === k).length;
      const pl = (c, w) => c ? c + ' ' + w + (c === 1 ? '' : 's') : '';
      const counts = locked ? ['Password protected'] : [pl(nk('spot'), 'spot'), pl(nk('area'), 'area'), pl(nk('route'), 'route')];
      const meta = counts.concat([gd.updated ? 'Updated ' + gd.updated : '']).filter(Boolean);
      document.getElementById('pfmeta-' + g.slug).innerHTML = meta.map(esc).join('<span class="dot" aria-hidden="true">•</span>');
      document.getElementById('pfdeck-' + g.slug).textContent = gd.deck || '';
      drawMap(g.slug, data, locked);
    }
  }

  // A small, still map of the guide's pins (or a blurred one for a protected guide)
  function drawMap(slug, data, locked) {
    if (!window.L) return;
    const box = document.getElementById('pfm-' + slug);
    const gd = data.guide;
    const offColor = /^#[0-9a-fA-F]{3,8}$/.test(gd.pinColor || '') ? gd.pinColor : '#038f9e';
    const color = p => p.kind ? (p.color || offColor) : gd.categoriesOff ? offColor : ((data.categories[p.category] || {}).color || '#888888');
    const m = L.map(box.querySelector('.m'), {
      zoomControl: false, attributionControl: false, dragging: false, scrollWheelZoom: false, doubleClickZoom: false,
      boxZoom: false, keyboard: false, touchZoom: false, tap: false, zoomSnap: 0.25, fadeAnimation: false
    });
    L.tileLayer(dark ? TILES.dark : TILES.light, { maxZoom: 19 }).addTo(m);
    const pts = data.places.map(p => [p.lat, p.lng]);
    if (!locked && pts.length) {
      m.fitBounds(pts, { padding: [14, 14], maxZoom: 15, animate: false });
      data.places.forEach(p => L.circleMarker([p.lat, p.lng], { radius: 3.5, weight: 1.25, color: '#fff', fillColor: color(p), fillOpacity: 1, interactive: false }).addTo(m));
    } else if (gd.center && !isNaN(gd.center.lat)) {
      m.setView([gd.center.lat, gd.center.lng], Math.min(gd.center.zoom || 14, 14), { animate: false });
    } else {
      m.setView([20, 0], 1, { animate: false });
    }
    if (locked) { box.classList.add('locked'); box.insertAdjacentHTML('beforeend', '<div class="lock">' + ICON.lock + '</div>'); }
  }
})();
