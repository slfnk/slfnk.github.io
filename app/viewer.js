// ============================================================
// GUIIDES VIEWER — shared by every guide page
// Each guide page (/<slug>/index.html) loads /app/viewer.css and this file.
// Edit the viewer here once; all guides update.
// ============================================================

// ---- Page shell (injected so each guide page stays tiny) ----
document.body.classList.add(...["view-list", "diamond-pins", "tag-filters", "text-compact"]);
document.body.insertAdjacentHTML('afterbegin', `

<div class="layout">
  <div class="col-left" id="colLeft">
    <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>

    <div class="top-bar">
      <a href="/" class="guiides-brand">⛺︎ made with <strong>GUIIDES</strong> ⛺︎</a>
      <div class="topbar-icons">
        <button class="topbar-icon" id="copyPageLink" title="Copy page link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
          <span class="copied-tip" id="pageCopiedTip">Copied!</span>
        </button>
        <div class="settings-wrap">
          <button class="topbar-icon settings-btn" id="settingsBtn" title="Settings">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div id="introSection" class="intro-section"></div>
    <div id="introBody" class="intro-body collapsed"></div>
    <div class="intro-toggle-wrap" id="introToggleWrap">
      <button class="intro-toggle" id="introToggle" onclick="toggleIntro()">
        <span>Read more</span>
        <svg viewBox="0 0 22 12" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2 2 L11 10 L20 2"/>
        </svg>
      </button>
    </div>

    <div class="filter-bar" id="filterBar">
      <button class="filter-btn active" data-filter="all">All</button>
      <button class="filter-btn" data-filter="__saved" id="filterSaved" style="display:none"><svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" style="width:10px;height:10px;vertical-align:-1px;margin-right:0.15rem"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>Saved</button>
      <span class="filter-count" id="filterCount"></span>
    </div>

    <div id="entries"></div>
  </div>

  <div class="col-right">
    <div id="map"></div>
    <button class="locate-btn" id="locateBtn" onclick="locateUser()" title="Find me on the map">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
        <circle cx="12" cy="12" r="8" stroke-dasharray="2 3"/>
      </svg>
    </button>
  </div>
</div>

<!-- Mobile map-view filter bar -->
<div class="map-filter-bar" id="mapFilterBar"></div>

<!-- Mobile card carousel -->
<div class="card-carousel" id="cardCarousel"></div>

<!-- View transition overlay -->
<div class="view-fade" id="viewFade"></div>
<div class="saved-toast" id="savedToast">Bookmark spots to save them for later. Clearing cookies will reset your saves.</div>

<!-- Mobile bottom toggle -->
<div class="mobile-toggle" id="mobileToggle">
  <button id="btnList" class="active" onclick="window.setView('list')">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
    List
  </button>
  <button id="btnMap" onclick="window.setView('map')">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="12" cy="10" r="3"/>
      <path d="M12 13 L12 17"/>
    </svg>
    Map
  </button>
</div>

<!-- Settings popover (body-level so it's visible in all views) -->
<div class="settings-popover" id="settingsPopover"></div>
`);

// ============================================
// GUIDE RESOLUTION
// Each guide is a folder: /<slug>/index.html (small page) + /<slug>/places.md
// The page names its guide with <body data-guide="slug">; the URL path is the fallback
// ============================================
const GUIDE_SLUG = (function() {
  const d = document.body.dataset.guide;
  if (d && /^[a-z0-9-]+$/.test(d)) return d;
  return location.pathname.split('/').filter(Boolean)[0] || '';
})();
// Canonical URL for this guide
function guideUrl() {
  return location.origin + '/' + GUIDE_SLUG + '/';
}
// Per-guide localStorage keys (spot slugs can repeat across cities)
function guideKey(k) { return k + ':' + GUIDE_SLUG; }

// ============================================
// SETTINGS SYSTEM
// ============================================
const cardThemes = ['', 'card-turquoise', 'card-plum', 'card-light'];
const cardLabels = ['Dark Glass', 'Turquoise', 'Plum', 'Light'];
let cardThemeIdx = 0;

const settingsConfig = [
  {
    key: 'theme', label: 'Theme', type: 'cycle', options: ['Light', 'Dark'],
    get: () => document.body.classList.contains('dark') ? 1 : 0,
    set: (idx) => {
      document.body.classList.toggle('dark', idx === 1);
      if (window._swapTiles) window._swapTiles(idx === 1);
      try { localStorage.setItem('vg-dark', idx === 1 ? '1' : '0'); } catch(e) {}
    }
  },
  {
    key: 'layout', label: 'Map Position', type: 'cycle', options: ['Map Right', 'Map Left'],
    get: () => document.body.classList.contains('layout-swapped') ? 1 : 0,
    set: (idx) => {
      document.body.classList.toggle('layout-swapped', idx === 1);
      try { localStorage.setItem('vg-layout', idx === 1 ? '1' : '0'); } catch(e) {}
      setTimeout(() => { if (window._map) window._map.invalidateSize(); }, 200);
    }
  },
  {
    key: 'accent', label: 'Accent', type: 'cycle',
    options: ['Teal', 'Coral', 'Gold', 'Indigo', 'Rose', 'Slate'],
    _colors: ['#2AAA8A', '#D95B43', '#C4A035', '#4A6FA5', '#C96B8B', '#6B8291'],
    get: function() {
      const cur = getComputedStyle(document.documentElement).getPropertyValue('--progress').trim();
      let idx = this._colors.indexOf(cur);
      if (idx < 0) {
        // Try matching via canvas hex conversion for rgb() values
        const ctx = document.createElement('canvas').getContext('2d');
        ctx.fillStyle = cur;
        const norm = ctx.fillStyle; // always returns #rrggbb
        idx = this._colors.findIndex(c => { ctx.fillStyle = c; return ctx.fillStyle === norm; });
      }
      return idx >= 0 ? idx : 5; // default Slate
    },
    set: function(idx) {
      document.documentElement.style.setProperty('--progress', this._colors[idx]);
      try { localStorage.setItem('vg-accent', idx); } catch(e) {}
    }
  },
  { key: '_d0', type: 'divider' },
  {
    key: 'pinshape', label: 'Pin Shape', type: 'cycle', options: ['Circle', 'Diamond', 'Square'],
    get: () => document.body.classList.contains('diamond-pins') ? 1 : document.body.classList.contains('square-pins') ? 2 : 0,
    set: (idx) => {
      document.body.classList.remove('diamond-pins', 'square-pins');
      if (idx === 1) document.body.classList.add('diamond-pins');
      if (idx === 2) document.body.classList.add('square-pins');
      try { localStorage.setItem('vg-pin-shape', idx); } catch(e) {}
    }
  },
  {
    key: 'pinsize', label: 'Pin Size', type: 'slider', min: 8, max: 28, step: 2, unit: 'px',
    get: () => parseInt(getComputedStyle(document.documentElement).getPropertyValue('--pin-size')) || 16,
    set: (val) => {
      document.documentElement.style.setProperty('--pin-size', val + 'px');
      try { localStorage.setItem('vg-pinsize', val); } catch(e) {}
    }
  },
  { key: '_d1', type: 'divider' },
  {
    key: 'cards', label: 'Cards', type: 'cycle', options: cardLabels,
    get: () => cardThemeIdx,
    set: (idx) => {
      if (cardThemes[cardThemeIdx]) document.body.classList.remove(cardThemes[cardThemeIdx]);
      cardThemeIdx = idx;
      if (cardThemes[cardThemeIdx]) document.body.classList.add(cardThemes[cardThemeIdx]);
      try { localStorage.setItem('vg-card-theme', cardThemeIdx); } catch(e) {}
    }
  },
  {
    key: 'blur', label: 'Card Blur', type: 'slider', min: 0, max: 30, step: 1, unit: 'px',
    get: () => parseInt(getComputedStyle(document.documentElement).getPropertyValue('--card-blur')) || 0,
    set: (val) => {
      document.documentElement.style.setProperty('--card-blur', val + 'px');
      try { localStorage.setItem('vg-blur', val); } catch(e) {}
    }
  },
  {
    key: 'opacity', label: 'Card Opacity', type: 'slider', min: 10, max: 100, step: 5, unit: '%',
    get: () => Math.round((parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--card-alpha')) || 0.85) * 100),
    set: (val) => {
      document.documentElement.style.setProperty('--card-alpha', val / 100);
      try { localStorage.setItem('vg-opacity', val); } catch(e) {}
    }
  },
  { key: '_d2', type: 'divider' },
  {
    key: 'filters', label: 'Filters', type: 'cycle', options: ['Pills', 'Tags'],
    get: () => document.body.classList.contains('tag-filters') ? 1 : 0,
    set: (idx) => {
      document.body.classList.toggle('tag-filters', idx === 1);
      try { localStorage.setItem('vg-tags', idx === 1 ? '1' : '0'); } catch(e) {}
    }
  },
  {
    key: 'textsize', label: 'Text Size', type: 'cycle', options: ['Normal', 'Compact', 'Large'],
    get: () => document.body.classList.contains('text-compact') ? 1 : document.body.classList.contains('text-large') ? 2 : 0,
    set: (idx) => {
      document.body.classList.remove('text-compact', 'text-large');
      if (idx === 1) document.body.classList.add('text-compact');
      if (idx === 2) document.body.classList.add('text-large');
      try { localStorage.setItem('vg-textsize', idx); } catch(e) {}
    }
  },
  {
    key: 'catlabel', label: 'Category Labels', type: 'cycle', options: ['Box', 'Text', 'Pill'],
    get: () => document.body.classList.contains('tag-text') ? 1 : document.body.classList.contains('tag-pill') ? 2 : 0,
    set: (idx) => {
      document.body.classList.remove('tag-text', 'tag-pill');
      if (idx === 1) document.body.classList.add('tag-text');
      if (idx === 2) document.body.classList.add('tag-pill');
      try { localStorage.setItem('vg-catlabel', idx); } catch(e) {}
    }
  },
  {
    key: 'thumbs', label: 'Thumbnails', type: 'cycle', options: ['Show', 'Hide'],
    get: () => document.body.classList.contains('hide-thumbs') ? 1 : 0,
    set: (idx) => {
      document.body.classList.toggle('hide-thumbs', idx === 1);
      try { localStorage.setItem('vg-thumbs', idx === 1 ? '1' : '0'); } catch(e) {}
    }
  },
  { key: '_d3', type: 'divider' },
  {
    key: 'bannerwidth', label: 'Banner Width', type: 'slider', min: 20, max: 100, step: 5, unit: '%',
    get: () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--banner-width')) || 35,
    set: (val) => {
      document.documentElement.style.setProperty('--banner-width', val);
      try { localStorage.setItem('vg-bannerwidth', val); } catch(e) {}
    }
  }
];

function cycleSetting(key, dir) {
  const cfg = settingsConfig.find(s => s.key === key);
  if (!cfg) return;
  let cur = cfg.get();
  cur = (cur + dir + cfg.options.length) % cfg.options.length;
  cfg.set(cur);
  const val = document.getElementById('sv-' + key);
  if (val) val.textContent = cfg.options[cur];
}

// Build settings popover
(function buildSettings() {
  const pop = document.getElementById('settingsPopover');
  settingsConfig.forEach(cfg => {
    if (cfg.type === 'divider') {
      const d = document.createElement('div');
      d.className = 'settings-divider';
      pop.appendChild(d);
      return;
    }
    const row = document.createElement('div');
    row.className = 'settings-row';
    if (cfg.type === 'slider') {
      const curVal = cfg.get();
      row.innerHTML =
        '<span class="settings-label">' + cfg.label + '</span>' +
        '<div class="settings-slider-wrap">' +
        '<input type="range" class="settings-slider" id="ss-' + cfg.key + '" ' +
        'min="' + cfg.min + '" max="' + cfg.max + '" step="' + cfg.step + '" value="' + curVal + '">' +
        '<span class="settings-value" id="sv-' + cfg.key + '">' + curVal + cfg.unit + '</span>' +
        '</div>';
      pop.appendChild(row);
      setTimeout(() => {
        const slider = document.getElementById('ss-' + cfg.key);
        if (slider) slider.addEventListener('input', () => {
          const v = parseInt(slider.value);
          cfg.set(v);
          const lbl = document.getElementById('sv-' + cfg.key);
          if (lbl) lbl.textContent = v + cfg.unit;
        });
      }, 0);
    } else {
      row.innerHTML =
        '<span class="settings-label">' + cfg.label + '</span>' +
        '<div class="settings-cycle">' +
        '<button class="settings-arrow" data-key="' + cfg.key + '" data-dir="-1">‹</button>' +
        '<span class="settings-value" id="sv-' + cfg.key + '">' + cfg.options[cfg.get()] + '</span>' +
        '<button class="settings-arrow" data-key="' + cfg.key + '" data-dir="1">›</button>' +
        '</div>';
      pop.appendChild(row);
    }
  });
  pop.addEventListener('click', e => {
    const arrow = e.target.closest('.settings-arrow');
    if (arrow) { e.stopPropagation(); cycleSetting(arrow.dataset.key, parseInt(arrow.dataset.dir)); }
  });
  // Shared open function — positions popover below whichever gear was clicked
  function openSettings(triggerBtn) {
    settingsConfig.forEach(cfg => {
      if (cfg.type === 'divider') return;
      const val = document.getElementById('sv-' + cfg.key);
      if (!val) return;
      if (cfg.type === 'slider') {
        const cv = cfg.get();
        val.textContent = cv + cfg.unit;
        const sl = document.getElementById('ss-' + cfg.key);
        if (sl) sl.value = cv;
      } else {
        val.textContent = cfg.options[cfg.get()];
      }
    });
    const rect = triggerBtn.getBoundingClientRect();
    pop.style.top = (rect.bottom + 6) + 'px';
    pop.style.right = Math.max(8, window.innerWidth - rect.right) + 'px';
    pop.classList.toggle('open');
  }
  window._openSettings = openSettings;
  document.getElementById('settingsBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    openSettings(e.currentTarget);
  });
  document.addEventListener('click', (e) => {
    if (!pop.contains(e.target)) pop.classList.remove('open');
  });
})();

// ============================================
// COPY PAGE LINK
// ============================================
document.getElementById('copyPageLink').addEventListener('click', function() {
  const url = guideUrl();
  navigator.clipboard.writeText(url).then(function() {
    const tip = document.getElementById('pageCopiedTip');
    tip.classList.add('show');
    setTimeout(function() { tip.classList.remove('show'); }, 1500);
  });
});

// ============================================
// MISC
// ============================================
function toggleIntro() {
  const body = document.getElementById('introBody');
  const btn = document.getElementById('introToggle');
  const label = btn.querySelector('span');
  body.classList.toggle('collapsed');
  label.textContent = body.classList.contains('collapsed') ? 'Read more' : 'Less';
}

// Restore persisted settings — bidirectional (respects HTML defaults)
try {
  const bp = (key, cls) => { const v = localStorage.getItem(key); if (v !== null) document.body.classList.toggle(cls, v === '1'); };
  bp('vg-dark', 'dark');
  bp('vg-tags', 'tag-filters');
  bp('vg-layout', 'layout-swapped');
  bp('vg-thumbs', 'hide-thumbs');
  // Pin shape (3-way)
  const ps = localStorage.getItem('vg-pin-shape');
  if (ps !== null) {
    document.body.classList.remove('diamond-pins', 'square-pins');
    if (ps === '1') document.body.classList.add('diamond-pins');
    if (ps === '2') document.body.classList.add('square-pins');
  }
  // Text size (3-way)
  const ts = localStorage.getItem('vg-textsize');
  if (ts !== null) {
    document.body.classList.remove('text-compact', 'text-large');
    if (ts === '1') document.body.classList.add('text-compact');
    if (ts === '2') document.body.classList.add('text-large');
  }
  // Category label style (3-way)
  const cl = localStorage.getItem('vg-catlabel');
  if (cl !== null) {
    document.body.classList.remove('tag-text', 'tag-pill');
    if (cl === '1') document.body.classList.add('tag-text');
    if (cl === '2') document.body.classList.add('tag-pill');
  }
  const savedTheme = parseInt(localStorage.getItem('vg-card-theme') || '0');
  if (savedTheme > 0 && savedTheme < cardThemes.length) {
    cardThemeIdx = savedTheme;
    document.body.classList.add(cardThemes[cardThemeIdx]);
  }
  const savedBlur = localStorage.getItem('vg-blur');
  if (savedBlur !== null) document.documentElement.style.setProperty('--card-blur', savedBlur + 'px');
  const savedOpacity = localStorage.getItem('vg-opacity');
  if (savedOpacity !== null) document.documentElement.style.setProperty('--card-alpha', parseInt(savedOpacity) / 100);
  const savedBannerWidth = localStorage.getItem('vg-bannerwidth');
  if (savedBannerWidth !== null) document.documentElement.style.setProperty('--banner-width', savedBannerWidth);
  const savedPinSize = localStorage.getItem('vg-pinsize');
  if (savedPinSize !== null) document.documentElement.style.setProperty('--pin-size', savedPinSize + 'px');
  const savedAccent = localStorage.getItem('vg-accent');
  if (savedAccent !== null) {
    const accentColors = ['#2AAA8A', '#D95B43', '#C4A035', '#4A6FA5', '#C96B8B', '#6B8291'];
    const ai = parseInt(savedAccent);
    if (ai >= 0 && ai < accentColors.length) document.documentElement.style.setProperty('--progress', accentColors[ai]);
  }
} catch(e) {}

// ============================================
// MARKDOWN PARSER
// ============================================
function parsePlacesMd(text) {
  const [configBlock, ...entryBlocks] = text.split(/^===$/m);
  const guide = {};
  const categories = {};
  let introLines = [];
  let section = 'meta';

  configBlock.split('\n').forEach(line => {
    if (line.trim() === '## Intro') { section = 'intro'; return; }
    if (line.trim() === '## Categories') { section = 'categories'; return; }

    if (section === 'meta') {
      const m = line.match(/^(\w[\w\s]*?):\s*(.+)$/);
      if (m) {
        const key = m[1].trim(), val = m[2].trim();
        if (key === 'Guide') guide.eyebrow = val;
        else if (key === 'Title') guide.title = val;
        else if (key === 'Subtitle') guide.deck = val;
        else if (key === 'Author') guide.byline = val;
        else if (key === 'Updated') guide.updated = val;
        else if (key === 'Center') {
          const c = val.split(',').map(x => parseFloat(x.trim()));
          if (!isNaN(c[0]) && !isNaN(c[1])) guide.center = { lat: c[0], lng: c[1], zoom: isNaN(c[2]) ? 15 : c[2] };
        }
        else if (key === 'More Guides') {
          guide.moreGuides = [];
          const lr = /\[([^\]]+)\]\(([^)]+)\)/g;
          let lm;
          while ((lm = lr.exec(val)) !== null) {
            guide.moreGuides.push({ name: lm[1], url: lm[2] });
          }
        }
      }
    } else if (section === 'intro') {
      introLines.push(line);
    } else if (section === 'categories') {
      const cm = line.match(/^(.+?):\s*(#[0-9a-fA-F]{3,8})$/);
      if (cm) categories[cm[1].trim()] = { color: cm[2].trim() };
    }
  });

  guide.intro = introLines.join('\n').split(/\n\n+/).map(p => p.trim()).filter(Boolean);

  const entriesRaw = entryBlocks.join('===').split(/^---$/m).filter(b => b.trim());
  const places = [];
  const sectionBreaks = []; // { beforeIndex, title, content }

  entriesRaw.forEach(block => {
    const lines = block.split('\n');
    // Detect section break: ## Title (double hash)
    const sectionLine = lines.find(l => l.trim().match(/^## (.+)$/));
    if (sectionLine) {
      const title = sectionLine.trim().replace(/^##\s*/, '');
      const contentLines = [];
      let pastTitle = false;
      lines.forEach(l => {
        if (l.trim() === sectionLine.trim()) { pastTitle = true; return; }
        if (pastTitle && l.trim()) contentLines.push(l.trim());
      });
      sectionBreaks.push({
        beforeIndex: places.length,
        title: title,
        content: contentLines.join(' ')
      });
      return;
    }

    const place = { gmaps: null, instagram: null, facebook: null, image: null, price: null };
    const descLines = [];
    let foundName = false;

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) { if (foundName) descLines.push(''); return; }

      if (!foundName && trimmed.startsWith('# ')) {
        place.name = trimmed.replace(/^#+\s*/, '');
        place.slug = place.name.toLowerCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        foundName = true;
        return;
      }

      const meta = trimmed.match(/^-\s*(.+?):\s*(.+)$/);
      if (meta && descLines.filter(l => l.trim()).length === 0) {
        const key = meta[1].trim().toLowerCase(), val = meta[2].trim();
        if (key === 'category') place.category = val;
        else if (key === 'price') place.price = val;
        else if (key === 'location') {
          const c = val.split(',').map(x => parseFloat(x.trim()));
          place.lat = c[0]; place.lng = c[1];
        }
        else if (key === 'image') place.image = val;
        else if (key === 'google maps') place.gmaps = val;
        else if (key === 'instagram') place.instagram = val;
        else if (key === 'facebook') place.facebook = val;
        return;
      }

      descLines.push(trimmed);
    });

    place.description = descLines.join('\n').split(/\n\n+/)
      .map(p => p.trim()).filter(Boolean).join(' ');
    if (place.name && place.lat) places.push(place);
  });

  return { guide, categories, places, sectionBreaks };
}

// ============================================
// LOAD + INIT
// ============================================
// ============================================
// BANNER DIVIDER
// Files live at /banners/banner_1.webp … banner_N.webp
// ============================================
const BANNER_COUNT = 20;
const BANNER_DAILY = false; // false = new banner every refresh (testing), true = one banner per day

function pickBanner() {
  if (BANNER_DAILY) {
    // Local calendar day, so it flips at the reader's midnight
    const d = new Date();
    const dayNum = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5);
    return (dayNum % BANNER_COUNT) + 1;
  }
  // Random, but never the same banner twice in a row
  let last = null, n;
  try { last = parseInt(localStorage.getItem('vg-last-banner'), 10); } catch(e) {}
  do { n = Math.floor(Math.random() * BANNER_COUNT) + 1; } while (n === last && BANNER_COUNT > 1);
  try { localStorage.setItem('vg-last-banner', n); } catch(e) {}
  return n;
}

function loadBanner() {
  const el = document.getElementById('guideBanner');
  if (!el) return;
  const src = '/banners/banner_' + pickBanner() + '.webp';
  const img = new Image();
  img.onload = () => { el.style.backgroundImage = 'url(' + src + ')'; el.classList.add('loaded'); };
  img.onerror = () => el.classList.add('failed'); // missing file: hide instead of leaving a blank gap
  img.src = src;
}

function loadGuideText() {
  return fetch('/' + GUIDE_SLUG + '/places.md').then(r => {
    if (r.ok) return r.text();
    throw new Error('No guide found at /' + GUIDE_SLUG + '/places.md');
  });
}

function showGuideNotFound(err) {
  const el = document.getElementById('introSection');
  el.innerHTML =
    '<h1 style="color:#D95B43">Guide not found</h1>' +
    '<p class="deck">' + err.message + '</p>' +
    '<div id="guideList" class="byline"></div>';
  // List available guides from the index, if it exists
  fetch('/guides.json')
    .then(r => r.ok ? r.json() : null)
    .then(idx => {
      if (!idx || !idx.guides) return;
      document.getElementById('guideList').innerHTML = 'Available guides: ' +
        idx.guides.filter(g => g.published !== false).map(g =>
          '<a href="/' + g.slug + '/"><strong>' + g.title + '</strong></a>'
        ).join(' &middot; ');
    })
    .catch(() => {});
}

loadGuideText()
  .then(text => {
    // Guard against a wrong file pasted into places.md (e.g. index.html)
    if (/^\s*</.test(text) || !/^Title:/m.test(text)) {
      throw new Error('/' + GUIDE_SLUG + '/places.md doesn\'t look like a guide file — it may contain HTML or be missing its Title: line.');
    }
    init(parsePlacesMd(text));
  })
  .catch(showGuideNotFound);

function init(data) {

const guide = data.guide;
const CATEGORIES = {};
Object.entries(data.categories).forEach(([k, v]) => {
  CATEGORIES[k] = { color: v.color, label: k };
});
function catColor(cat) { return CATEGORIES[cat]?.color || '#888'; }
const places = data.places;
const sectionBreaks = data.sectionBreaks || [];

// Build a map of beforeIndex → section break for quick lookup
const sectionMap = {};
sectionBreaks.forEach(sb => { sectionMap[sb.beforeIndex] = sb; });

// ============================================
// RENDER INTRO
// ============================================
// Guide branding handled in HTML

const introSection = document.getElementById('introSection');

introSection.innerHTML =
  '<p class="updated-inline">' + 'Updated ' + guide.updated + '</p>' +
  '<h1>' + guide.title + '</h1>' +
  '<p class="deck">' + guide.deck + '</p>' +
  '<p class="byline">By <strong>' + guide.byline + '</strong></p>' +
  '<div class="guide-banner" id="guideBanner" role="presentation"></div>';

document.title = guide.title;
loadBanner();

document.getElementById('introBody').innerHTML = guide.intro.map((p, i) =>
  '<p' + (i === 0 ? ' class="drop-cap"' : '') + '>' + p + '</p>'
).join('');

// ============================================
// SVG ICONS
// ============================================
const I = {
  gmaps: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>',
  ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>',
  fb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
  share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  bookmark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>',
  bookmarkFill: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>'
};

function linkRow(p) {
  const a = [];
  if (p.gmaps)     a.push('<a href="' + p.gmaps + '" target="_blank" rel="noopener">' + I.gmaps + ' G.Maps</a>');
  if (p.instagram) a.push('<a href="' + p.instagram + '" target="_blank" rel="noopener">' + I.ig + ' IG</a>');
  if (p.facebook)  a.push('<a href="' + p.facebook + '" target="_blank" rel="noopener">' + I.fb + ' FB</a>');
  return a.length ? '<div class="entry-links">' + a.join('') + '</div>' : '';
}

function cardLinks(p) {
  const a = [];
  if (p.gmaps)     a.push('<a href="' + p.gmaps + '" target="_blank">G.Maps</a>');
  if (p.instagram) a.push('<a href="' + p.instagram + '" target="_blank">IG</a>');
  if (p.facebook)  a.push('<a href="' + p.facebook + '" target="_blank">FB</a>');
  return a.length ? '<div class="card-action-links">' + a.join(' &#8226; ') + '</div>' : '';
}

// Copy share link to clipboard
window.copyShareLink = function(slug, btn) {
  const url = guideUrl() + '#' + slug;
  navigator.clipboard.writeText(url).then(function() {
    var tip = btn.querySelector('.copied-tip');
    tip.classList.add('show');
    setTimeout(function() { tip.classList.remove('show'); }, 1500);
  });
};

window.toggleHeart = function(btn) {
  const slug = btn.dataset.slug;
  const wasSaved = savedSlugs.has(slug);
  btn.classList.toggle('hearted');
  btn.classList.add('pop');
  setTimeout(() => btn.classList.remove('pop'), 300);

  if (wasSaved) {
    savedSlugs.delete(slug);
  } else {
    savedSlugs.add(slug);
    if (!hasShownSavedToast) {
      hasShownSavedToast = true;
      const toast = document.getElementById('savedToast');
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 4000);
    }
  }
  try { localStorage.setItem(guideKey('vg-saved'), JSON.stringify([...savedSlugs])); } catch(e) {}

  const isSaved = savedSlugs.has(slug);

  // Sync all bookmark buttons for this slug (swap SVG fill)
  document.querySelectorAll('.entry-heart[data-slug="' + slug + '"]').forEach(h => {
    h.classList.toggle('hearted', isSaved);
    h.innerHTML = isSaved ? I.bookmarkFill : I.bookmark;
  });

  // Sync saved filter button visibility across both filter bars
  document.querySelectorAll('.filter-btn[data-filter="__saved"]').forEach(b => {
    b.style.display = savedSlugs.size > 0 ? '' : 'none';
  });

  // If all bookmarks removed while in Saved filter, kick back to All
  if (activeFilter === '__saved' && savedSlugs.size === 0) {
    const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
    if (allBtn) syncFilterBars(allBtn);
    return;
  }
  if (activeFilter === '__saved') updateFilter();
};

// ============================================
// FILTER BUTTONS
// ============================================
const filterBar = document.getElementById('filterBar');
const usedCats = [...new Set(places.map(p => p.category))];
usedCats.forEach(cat => {
  const btn = document.createElement('button');
  btn.className = 'filter-btn';
  btn.dataset.filter = cat;
  btn.textContent = CATEGORIES[cat]?.label || cat;
  const hoverCol = CATEGORIES[cat]?.color || '#888';
  btn.addEventListener('mouseenter', () => {
    if (!btn.classList.contains('active')) {
      btn.style.background = hoverCol + '22';
      btn.style.borderColor = hoverCol + '44';
    }
  });
  btn.addEventListener('mouseleave', () => {
    if (!btn.classList.contains('active')) {
      btn.style.background = '';
      btn.style.borderColor = '';
    }
  });
  filterBar.insertBefore(btn, document.getElementById('filterCount'));
});

let activeFilter = 'all';

function syncFilterBars(clickedBtn) {
  activeFilter = clickedBtn.dataset.filter;
  document.querySelectorAll('.filter-btn').forEach(b => {
    const isActive = b.dataset.filter === activeFilter;
    b.classList.toggle('active', isActive);
    if (isActive) {
      let col;
      if (b.dataset.filter === 'all') col = 'var(--text)';
      else if (b.dataset.filter === '__saved') col = 'var(--progress)';
      else col = CATEGORIES[b.dataset.filter]?.color || '#888';
      b.style.background = col;
      b.style.borderColor = col;
    } else {
      b.style.background = '';
      b.style.borderColor = '';
    }
  });
  updateFilter();
}

filterBar.addEventListener('click', e => {
  const btn = e.target.closest('.filter-btn');
  if (btn) syncFilterBars(btn);
});

// Clone filter buttons into mobile map filter bar
const mapFilterBar = document.getElementById('mapFilterBar');
filterBar.querySelectorAll('.filter-btn').forEach(btn => {
  const clone = btn.cloneNode(true);
  if (btn.classList.contains('active')) {
    clone.style.background = 'var(--text)';
    clone.style.borderColor = 'var(--text)';
  }
  mapFilterBar.appendChild(clone);
});
// Add gear icon to map filter bar (right end)
const mapGear = document.createElement('button');
mapGear.className = 'topbar-icon';
mapGear.title = 'Settings';
mapGear.style.cssText = 'margin-left:auto;flex-shrink:0;';
mapGear.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';
mapGear.addEventListener('click', (e) => {
  e.stopPropagation();
  if (window._openSettings) window._openSettings(e.currentTarget);
});
mapFilterBar.appendChild(mapGear);

mapFilterBar.addEventListener('click', e => {
  const btn = e.target.closest('.filter-btn');
  if (btn) syncFilterBars(btn);
});

// Style initial "All" button
filterBar.querySelector('.filter-btn.active').style.background = 'var(--text)';
filterBar.querySelector('.filter-btn.active').style.borderColor = 'var(--text)';

// ============================================
// RENDER ENTRIES
// ============================================
const entriesEl = document.getElementById('entries');
const carousel = document.getElementById('cardCarousel');

// Load saved favorites from localStorage
let savedSlugs = new Set();
let hasShownSavedToast = false;
try {
  const raw = localStorage.getItem(guideKey('vg-saved'));
  const saved = JSON.parse(raw || '[]');
  savedSlugs = new Set(saved);
  if (saved.length > 0) hasShownSavedToast = true;
} catch(e) {}

// Show Saved filter if items exist (both filter bars)
if (savedSlugs.size > 0) {
  document.querySelectorAll('.filter-btn[data-filter="__saved"]').forEach(b => b.style.display = '');
}

places.forEach((p, i) => {
  const col = catColor(p.category);

  // Insert section break if one exists before this index
  if (sectionMap[i]) {
    const sb = sectionMap[i];
    const sbDiv = document.createElement('div');
    sbDiv.className = 'section-break';
    sbDiv.dataset.cat = p.category; // tag with the category of entries that follow
    sbDiv.innerHTML = '<h3>' + sb.title + '</h3>' +
      (sb.content ? '<p>' + sb.content + '</p>' : '');
    entriesEl.appendChild(sbDiv);
  }

  // Desktop entry
  const entry = document.createElement('div');
  entry.className = 'entry';
  entry.id = 'entry-' + p.slug;
  entry.dataset.index = i;
  entry.dataset.cat = p.category;

  const price = p.price ? '<span class="entry-price">[' + p.price + ']</span>' : '';
  const thumbHtml = p.image
    ? '<div class="entry-thumb-wrap"><img class="entry-thumb" src="' + p.image + '" alt="' + p.name + '" loading="lazy"/></div>'
    : (p.showThumb !== false
      ? '<div class="entry-thumb-wrap"><div class="entry-thumb-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg></div></div>'
      : '');

  const isHearted = savedSlugs.has(p.slug);
  entry.innerHTML =
    '<button class="entry-heart' + (isHearted ? ' hearted' : '') + '" data-slug="' + p.slug + '" onclick="toggleHeart(this)">' + (isHearted ? I.bookmarkFill : I.bookmark) + '</button>' +
    '<div class="entry-head"><span class="entry-tag" style="background:' + col + ';--tag-color:' + col + '">' + p.category + '</span>' + price + '</div>' +
    '<div class="entry-title-row"><h2>' + p.name + '</h2>' +
    '<button class="share-link" onclick="copyShareLink(\'' + p.slug + '\',this)" title="Copy link">' +
    I.share + '<span class="copied-tip">Copied!</span></button></div>' +
    thumbHtml +
    '<p class="desc">' + p.description + '</p>' +
    '<div style="clear:both"></div>' +
    linkRow(p);

  entriesEl.appendChild(entry);

  // Click entry → fly to pin
  entry.addEventListener('click', e => {
    if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.closest('a')) return;
    setActive(i, 'map');
  });

  // Mobile card
  const card = document.createElement('div');
  card.className = 'card';
  card.id = 'card-' + i;
  card.dataset.index = i;
  card.dataset.cat = p.category;
  const thumb = p.image
    ? '<img class="card-thumb-float" src="' + p.image + '" alt="' + p.name + '"/>'
    : '';
  card.innerHTML =
    '<button class="entry-heart card-heart' + (isHearted ? ' hearted' : '') + '" data-slug="' + p.slug + '" onclick="toggleHeart(this)">' + (isHearted ? I.bookmarkFill : I.bookmark) + '</button>' +
    '<div class="card-body">' +
    thumb +
    '<div class="card-cat">' + p.category + (p.price ? ' &middot; ' + p.price : '') + '</div>' +
    '<h3>' + p.name + '</h3>' +
    '<p class="card-desc">' + p.description + '</p>' +
    '<div class="card-action-row"><button class="card-expand-btn">Read more ▾</button>' +
    cardLinks(p) + '</div></div>';

  card.addEventListener('click', e => {
    if (e.target.tagName === 'A') return;
    if (e.target.classList.contains('card-expand-btn')) {
      card.classList.toggle('expanded');
      e.target.textContent = card.classList.contains('expanded') ? 'Less ▴' : 'Read more ▾';
      return;
    }
    setActive(i, 'card');
  });
  carousel.appendChild(card);
});

// ============================================
// MAP
// ============================================
const map = L.map('map', { zoomControl: true, scrollWheelZoom: true });

// Initial view: explicit Center meta if set, otherwise fit all spots.
// fitBounds needs a visible container, so on hidden (mobile list) maps it
// uses a rough placeholder and re-applies when the map is first revealed.
let initialViewApplied = false;
function applyInitialView() {
  if (guide.center) {
    map.setView([guide.center.lat, guide.center.lng], guide.center.zoom, { animate: false });
    initialViewApplied = true;
  } else if (places.length) {
    const bounds = L.latLngBounds(places.map(p => [p.lat, p.lng]));
    if (map.getSize().x > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15, animate: false });
      initialViewApplied = true;
    } else {
      map.setView(bounds.getCenter(), 13, { animate: false });
    }
  } else {
    map.setView([20, 0], 2, { animate: false });
    initialViewApplied = true;
  }
}
applyInitialView();
window._map = map;

const tileUrls = {
  light: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=cb1_2thp_1_6ffbb574555fa573f30768f0',
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=cb1_2thp_1_6ffbb574555fa573f30768f0'
};
const tileAttr = '&copy; <a href="https://openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>';

// Defer tile loading on mobile — no tile HTTP requests until user opens map view
let tileLayer = null;
let tilesLoaded = false;
function ensureTiles() {
  if (tilesLoaded) return;
  tilesLoaded = true;
  tileLayer = L.tileLayer(
    document.body.classList.contains('dark') ? tileUrls.dark : tileUrls.light,
    { attribution: tileAttr, maxZoom: 19 }
  ).addTo(map);
}
if (window.innerWidth > 768) ensureTiles(); // Desktop: load immediately (split pane visible)

window._swapTiles = function(isDark) {
  if (tileLayer) map.removeLayer(tileLayer);
  tileLayer = L.tileLayer(isDark ? tileUrls.dark : tileUrls.light, { attribution: tileAttr, maxZoom: 19 }).addTo(map);
  tilesLoaded = true;
};

const markerLayer = L.layerGroup().addTo(map);
const markerRefs = [];

places.forEach((p, i) => {
  const col = catColor(p.category);
  const icon = L.divIcon({
    className: '',
    html: '<div class="pin-wrap">' +
      '<div class="pin" id="pin-' + i + '" style="background:' + col + '" data-index="' + i + '"></div>' +
      '<div class="pin-label">' + p.name + '</div>' +
      '</div>',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
  const marker = L.marker([p.lat, p.lng], { icon }).addTo(markerLayer);
  marker.on('click', () => setActive(i, 'map'));
  markerRefs.push(marker);
});

// ============================================
// SYNC LOGIC
// ============================================
let activeIndex = -1;
let lockSource = null;
let lockTimer = null;

function acquireLock(src, ms) {
  lockSource = src;
  clearTimeout(lockTimer);
  lockTimer = setTimeout(() => { lockSource = null; }, ms);
}

function setActive(index, source) {
  if (index < 0 || index >= places.length) return;
  if (index === activeIndex && source === 'scroll') return;
  activeIndex = index;

  // Highlight entries
  document.querySelectorAll('.entry').forEach((el, i) => {
    el.classList.toggle('active', i === index);
    if (i === index) el.style.setProperty('--c-active', catColor(places[i].category));
  });

  // Highlight pins (by ID, not DOM position — Leaflet reorders DOM on filter)
  document.querySelectorAll('.pin.active').forEach(el => el.classList.remove('active'));
  const targetPin = document.getElementById('pin-' + index);
  if (targetPin) targetPin.classList.add('active');

  // Fly map — on mobile map view, offset southward so pin sits above card carousel
  const isMobileMap = window.innerWidth <= 768 && document.body.classList.contains('view-map');
  if (isMobileMap) {
    const targetZoom = map.getZoom() < 14 ? 16 : map.getZoom();
    const targetPoint = map.project([places[index].lat, places[index].lng], targetZoom);
    targetPoint.y += window.innerHeight * 0.18; // push center south so pin rises
    const offsetLatLng = map.unproject(targetPoint, targetZoom);
    map.flyTo(offsetLatLng, targetZoom, { duration: 0.7 });
  } else {
    map.flyTo([places[index].lat, places[index].lng], 16, { duration: 0.7 });
  }

  // Scroll list on marker click
  if (source === 'map') {
    acquireLock('map', 1200);
    const el = document.getElementById('entry-' + places[index].slug);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Scroll carousel
  if (source === 'map' || source === 'list') {
    const card = document.getElementById('card-' + index);
    if (card) {
      acquireLock('carousel', 800);
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  // Hash is NOT set in the URL — only used when copying share links
}

// ============================================
// SCROLL OBSERVER
// ============================================
const colLeft = document.getElementById('colLeft');
const progressFill = document.getElementById('progressFill');

const observer = new IntersectionObserver(entries => {
  if (lockSource === 'map' || lockSource === 'carousel' || lockSource === 'view-switch') return;
  let best = null;
  entries.forEach(e => {
    if (e.isIntersecting && e.intersectionRatio >= 0.45) {
      if (!best || e.intersectionRatio > best.intersectionRatio) best = e;
    }
  });
  if (best) {
    const idx = parseInt(best.target.dataset.index);
    if (!isNaN(idx) && idx !== activeIndex) setActive(idx, 'scroll');
  }
}, { root: colLeft, threshold: [0.45, 0.6, 0.8] });

document.querySelectorAll('.entry').forEach(el => observer.observe(el));

// Progress bar
colLeft.addEventListener('scroll', () => {
  const t = colLeft.scrollTop;
  const h = colLeft.scrollHeight - colLeft.clientHeight;
  progressFill.style.width = (h > 0 ? (t / h) * 100 : 0) + '%';
});

// Carousel swipe detection
let carouselTimer;
carousel.addEventListener('scroll', () => {
  if (lockSource === 'carousel') return;
  clearTimeout(carouselTimer);
  carouselTimer = setTimeout(() => {
    // Collapse any expanded cards when swiping
    carousel.querySelectorAll('.card.expanded').forEach(c => {
      c.classList.remove('expanded');
      const btn = c.querySelector('.card-expand-btn');
      if (btn) btn.textContent = 'Read more ▾';
    });
    const cx = carousel.scrollLeft + carousel.clientWidth / 2;
    let closest = 0, dist = Infinity;
    carousel.querySelectorAll('.card:not(.hidden)').forEach(card => {
      const d = Math.abs((card.offsetLeft + card.offsetWidth / 2) - cx);
      if (d < dist) { dist = d; closest = parseInt(card.dataset.index); }
    });
    if (closest !== activeIndex) setActive(closest, 'carousel-swipe');
  }, 100);
});

// ============================================
// FILTER
// ============================================
const filterCount = document.getElementById('filterCount');

function updateFilter() {
  let visible = 0;

  places.forEach((p, i) => {
    let show;
    if (activeFilter === 'all') show = true;
    else if (activeFilter === '__saved') show = savedSlugs.has(p.slug);
    else show = p.category === activeFilter;

    // List entries
    document.getElementById('entry-' + p.slug).classList.toggle('hidden', !show);

    // Mobile cards
    document.getElementById('card-' + i).classList.toggle('hidden', !show);

    // Fully hide/show map markers (not just faded)
    if (show) {
      if (!map.hasLayer(markerRefs[i])) markerRefs[i].addTo(markerLayer);
    } else {
      markerLayer.removeLayer(markerRefs[i]);
    }

    if (show) visible++;
  });

  filterCount.textContent = visible + ' spot' + (visible !== 1 ? 's' : '');

  // Filter section breaks to only show the matching category's blurb
  document.querySelectorAll('.section-break').forEach(sb => {
    const show = activeFilter === 'all' || sb.dataset.cat === activeFilter;
    sb.style.display = show ? '' : 'none';
  });

  // Re-observe only visible entries
  observer.disconnect();
  document.querySelectorAll('.entry:not(.hidden)').forEach(el => observer.observe(el));

  // Scroll behavior — skip on initial load (page starts at top)
  if (!filterInitialized) return;

  const visibleEntries = document.querySelectorAll('.entry:not(.hidden)');

  if (activeFilter !== 'all') {
    const sb = document.querySelector('.section-break[data-cat="' + activeFilter + '"]');
    if (sb) setTimeout(() => sb.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }

  if (visibleEntries.length) {
    const midEl = visibleEntries[Math.floor(visibleEntries.length / 2)];
    const midIdx = parseInt(midEl.dataset.index);
    activeIndex = midIdx;

    document.querySelectorAll('.entry.active').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.pin.active').forEach(el => el.classList.remove('active'));
    midEl.classList.add('active');
    midEl.style.setProperty('--c-active', catColor(places[midIdx].category));
    const pin = document.getElementById('pin-' + midIdx);
    if (pin) pin.classList.add('active');

    if (activeFilter === 'all') {
      setTimeout(() => midEl.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
    }
  }

  // Fit map to visible markers
  const vc = places
    .filter(p => activeFilter === 'all' || p.category === activeFilter)
    .map(p => [p.lat, p.lng]);
  if (vc.length) {
    map.fitBounds(vc, { padding: [40, 40], maxZoom: 16, duration: 0.6 });
  }
}

let filterInitialized = false;
updateFilter();
filterInitialized = true;

// ============================================
// MOBILE VIEW TOGGLE
// ============================================
window.setView = function(mode) {
  const fade = document.getElementById('viewFade');
  const currentMode = document.body.classList.contains('view-map') ? 'map' : 'list';
  if (currentMode === mode) return;

  // Fade in
  fade.classList.add('active');

  setTimeout(() => {
    // Swap view behind the overlay
    const persist = [];
    if (document.body.classList.contains('dark')) persist.push('dark');
    if (document.body.classList.contains('tag-filters')) persist.push('tag-filters');
    if (document.body.classList.contains('diamond-pins')) persist.push('diamond-pins');
    if (document.body.classList.contains('square-pins')) persist.push('square-pins');
    if (document.body.classList.contains('layout-swapped')) persist.push('layout-swapped');
    if (document.body.classList.contains('text-compact')) persist.push('text-compact');
    if (document.body.classList.contains('text-large')) persist.push('text-large');
    if (document.body.classList.contains('hide-thumbs')) persist.push('hide-thumbs');
    if (document.body.classList.contains('tag-text')) persist.push('tag-text');
    if (document.body.classList.contains('tag-pill')) persist.push('tag-pill');
    cardThemes.forEach(t => { if (t && document.body.classList.contains(t)) persist.push(t); });
    document.body.className = persist.join(' ') + ' view-' + mode;

    document.getElementById('btnList').classList.toggle('active', mode === 'list');
    document.getElementById('btnMap').classList.toggle('active', mode === 'map');

    if (mode === 'map') {
      ensureTiles();
      // Force synchronous reflow so map container has correct dimensions
      const colRight = document.querySelector('.col-right');
      void colRight.offsetHeight;
      map.invalidateSize();

      // Leaflet may need one more tick after invalidateSize on first reveal
      // from display:none — schedule a second pass to be safe
      const centerOnPin = () => {
        map.invalidateSize();
        if (activeIndex >= 0) {
          const p = places[activeIndex];
          const isMobile = window.innerWidth <= 768;
          if (isMobile) {
            const targetZoom = 16;
            const targetPoint = map.project([p.lat, p.lng], targetZoom);
            targetPoint.y += window.innerHeight * 0.18;
            const offsetLatLng = map.unproject(targetPoint, targetZoom);
            map.setView(offsetLatLng, targetZoom, { animate: false });
          } else {
            map.setView([p.lat, p.lng], 16, { animate: false });
          }
          const card = document.getElementById('card-' + activeIndex);
          if (card) card.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' });
          // Highlight active pin + label
          document.querySelectorAll('.pin.active').forEach(el => el.classList.remove('active'));
          const pin = document.getElementById('pin-' + activeIndex);
          if (pin) pin.classList.add('active');
        } else if (!initialViewApplied) {
          applyInitialView();
        }
      };

      // First attempt immediately after reflow
      centerOnPin();
      // Second attempt after a real frame — catches cases where Leaflet's
      // internal pixel origin hasn't settled after the first invalidateSize
      requestAnimationFrame(() => {
        centerOnPin();
        // Fade out after second pass
        setTimeout(() => { fade.classList.remove('active'); }, 100);
      });
      return;
    }

    if (mode === 'list' && activeIndex >= 0) {
      const savedIdx = activeIndex;
      acquireLock('view-switch', 600);
      activeIndex = savedIdx;
      const el = document.getElementById('entry-' + places[savedIdx].slug);
      if (el) {
        el.scrollIntoView({ behavior: 'auto', block: 'center' });
        document.querySelectorAll('.entry.active').forEach(e => e.classList.remove('active'));
        el.classList.add('active');
        el.style.setProperty('--c-active', catColor(places[savedIdx].category));
      }
      // Re-center desktop split-pane map on active pin
      setTimeout(() => {
        map.invalidateSize();
        map.setView([places[savedIdx].lat, places[savedIdx].lng], 16, { animate: false });
      }, 200);
    }

    // Fade out
    requestAnimationFrame(() => {
      fade.classList.remove('active');
    });
  }, 150);
};

// ============================================
// DEEP LINKS
// ============================================
function handleHash() {
  const h = location.hash.slice(1);
  if (h) {
    const idx = places.findIndex(p => p.slug === h);
    if (idx >= 0) {
      setTimeout(() => setActive(idx, 'map'), 400);
      return;
    }
  }
  // No hash — start at top, let user scroll naturally
  window.scrollTo(0, 0);
  const colLeft = document.getElementById('colLeft');
  if (colLeft) colLeft.scrollTop = 0;
}

handleHash();
window.addEventListener('hashchange', handleHash);

// ============================================
// LOCATE USER
// ============================================
let userMarker = null;

window.locateUser = function() {
  const btn = document.getElementById('locateBtn');
  if (!navigator.geolocation) {
    btn.title = 'Location not supported';
    return;
  }

  btn.classList.add('active');
  btn.title = 'Finding you…';

  navigator.geolocation.getCurrentPosition(
    function(pos) {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      if (userMarker) {
        userMarker.setLatLng([lat, lng]);
      } else {
        const icon = L.divIcon({
          className: '',
          html: '<div class="user-marker"></div>',
          iconSize: [14, 14],
          iconAnchor: [7, 7]
        });
        userMarker = L.marker([lat, lng], { icon: icon, zIndexOffset: 9999 }).addTo(map);
      }

      map.flyTo([lat, lng], 16, { duration: 0.8 });
      btn.title = 'Find me on the map';
    },
    function(err) {
      btn.classList.remove('active');
      if (err.code === 1) {
        btn.title = 'Location access denied';
      } else {
        btn.title = 'Could not get location';
      }
    },
    { enableHighAccuracy: true, timeout: 8000 }
  );
};

} // end init()
