// ============================================================
// GUIIDES places.md PARSER — shared by the viewer and the editor
// Loaded before /app/viewer.js on guide pages, and by /admin/.
// ============================================================
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
        else if (key === 'Author Link') guide.authorLink = val;
        else if (key === 'Profile') { if (/^[a-z0-9-]+$/.test(val)) guide.profile = val; }
        else if (key === 'Banner') guide.banner = val.toLowerCase();
        else if (key === 'Categories') guide.categoriesOff = /^(off|no|none|false)$/i.test(val);
        else if (key === 'Category Intros') guide.introsOff = /^(off|no|none|false)$/i.test(val);
        else if (key === 'Pin Color') guide.pinColor = val;
        else if (key === 'Locked') guide.locked = val;
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
    const sectionLine = lines.find(l => /^##(\s+.*)?$/.test(l.trim()));
    if (sectionLine) {
      const title = sectionLine.trim().replace(/^##\s*/, '').trim();
      const contentLines = [];
      let pastTitle = false;
      lines.forEach(l => {
        if (l.trim() === sectionLine.trim()) { pastTitle = true; return; }
        if (pastTitle && l.trim()) contentLines.push(l.trim());
      });
      sectionBreaks.push({
        beforeIndex: places.length,
        title: title,
        content: contentLines.join(' '),
        category: matchCategory(title, Object.keys(categories))
      });
      return;
    }

    const place = { gmaps: null, instagram: null, facebook: null, image: null, price: null, links: [] };
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
        else if (key === 'color' && /^#[0-9a-fA-F]{3,8}$/.test(val)) place.color = val;
        else if (key === 'type') { const k = shapeKind(val); if (k) place.kind = k; }
        else if (key === 'shape') place.shape = parseShape(val);
        else if ((key === 'link' || key === 'website') && /^https?:\/\//i.test(val)) place.links.push(val);
        return;
      }

      descLines.push(trimmed);
    });

    place.description = descLines.join('\n').split(/\n\n+/)
      .map(p => p.trim()).filter(Boolean).join(' ');
    if (place.kind) {
      // Areas and routes sit outside the category system; their pin goes where the shape says
      delete place.category; delete place.price;
      place.shape = place.shape || [];
      if (!place.lat) { const a = shapeAnchor(place.kind, place.shape); if (a) { place.lat = a[0]; place.lng = a[1]; } }
    }
    if (place.name && place.lat) places.push(place);
  });

  return { guide, categories, places, sectionBreaks };
}

// A text break titled like a category ("## Landmarks" → Landmark) is that category's write-up.
// Shared by the viewer and the editor so both agree which category a write-up belongs to.
function matchCategory(title, names) {
  const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ').trim();
  const stem = s => s.replace(/(es|s)$/, '');
  const t = norm(title);
  if (!t) return null;
  return names.find(n => norm(n) === t) || names.find(n => stem(norm(n)) === stem(t)) || null;
}

// ============================================================
// AREAS AND ROUTES — entries with "- Type: Area" or "- Type: Route" and a
// "- Shape: lat, lng; lat, lng; …" line. Their Location is the pin: an area's
// middle, a route's start.
// ============================================================
function shapeKind(v) {
  v = String(v || '').trim().toLowerCase();
  if (/^(area|region|neighbou?rhood|zone)$/.test(v)) return 'area';
  if (/^(route|path|walk|hike|trail)$/.test(v)) return 'route';
  return '';
}
function parseShape(v) {
  return String(v || '').split(';').map(s => s.split(',').map(x => parseFloat(x)))
    .filter(c => c.length === 2 && c[0] && !isNaN(c[0]) && !isNaN(c[1]));
}
function formatShape(pts) { return pts.map(p => (+p[0]).toFixed(5) + ', ' + (+p[1]).toFixed(5)).join('; '); }
function shapeDrawable(kind, pts) { return (pts || []).length >= (kind === 'area' ? 3 : 2); }
function shapeAnchor(kind, pts) {
  if (!pts || !pts.length) return null;
  if (kind === 'route' || pts.length < 3) return pts[0];
  // Area: center of mass of the polygon (falls back to the average of its corners)
  let a = 0, x = 0, y = 0;
  for (let i = 0; i < pts.length; i++) {
    const [y0, x0] = pts[i], [y1, x1] = pts[(i + 1) % pts.length];
    const f = x0 * y1 - x1 * y0;
    a += f; x += (x0 + x1) * f; y += (y0 + y1) * f;
  }
  if (Math.abs(a) < 1e-12) return [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
  return [y / (3 * a), x / (3 * a)];
}
function routeMeters(pts) {
  const R = 6371000, rad = d => d * Math.PI / 180;
  let m = 0;
  for (let i = 1; i < (pts || []).length; i++) {
    const [la1, lo1] = pts[i - 1], [la2, lo2] = pts[i];
    const h = Math.sin(rad(la2 - la1) / 2) ** 2 + Math.cos(rad(la1)) * Math.cos(rad(la2)) * Math.sin(rad(lo2 - lo1) / 2) ** 2;
    m += 2 * R * Math.asin(Math.sqrt(h));
  }
  return m;
}
function formatDistance(m) {
  const km = m / 1000, mi = m / 1609.344;
  if (km < 1) return Math.round(m / 10) * 10 + ' m / ' + mi.toFixed(1) + ' mi';
  return (km < 10 ? km.toFixed(1) : Math.round(km)) + ' km / ' + (mi < 10 ? mi.toFixed(1) : Math.round(mi)) + ' mi';
}
// "AREA" or "ROUTE · 2.4 km / 1.5 mi" — the tag a guide shows for one
function shapeLabel(p) {
  if (p.kind === 'area') return 'Area';
  return 'Route' + (shapeDrawable('route', p.shape) ? ' · ' + formatDistance(routeMeters(p.shape)) : '');
}
// A tiny drawing of the shape, for list thumbnails
function shapeSvg(kind, pts, color, w, h) {
  if (!shapeDrawable(kind, pts)) return '';
  const lat0 = pts.reduce((s, p) => s + p[0], 0) / pts.length, k = Math.cos(lat0 * Math.PI / 180);
  const xs = pts.map(p => p[1] * k), ys = pts.map(p => -p[0]);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const pad = 8, sc = Math.min((w - 2 * pad) / ((maxX - minX) || 1e-9), (h - 2 * pad) / ((maxY - minY) || 1e-9));
  const ox = (w - (maxX - minX) * sc) / 2, oy = (h - (maxY - minY) * sc) / 2;
  const P = xs.map((x, i) => [(ox + (x - minX) * sc).toFixed(1), (oy + (ys[i] - minY) * sc).toFixed(1)]);
  const d = 'M' + P.map(q => q.join(' ')).join(' L') + (kind === 'area' ? ' Z' : '');
  return '<svg viewBox="0 0 ' + w + ' ' + h + '" aria-hidden="true"><path d="' + d + '" fill="' + (kind === 'area' ? color : 'none') + '" fill-opacity="0.18" stroke="' + color + '" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"' + (kind === 'area' ? ' stroke-dasharray="5 4"' : '') + '/>' +
    (kind === 'route' ? '<circle cx="' + P[0][0] + '" cy="' + P[0][1] + '" r="3.5" fill="' + color + '"/><circle cx="' + P[P.length - 1][0] + '" cy="' + P[P.length - 1][1] + '" r="3.5" fill="#fff" stroke="' + color + '" stroke-width="2"/>' : '') + '</svg>';
}

// Banner files live at /banners/banner_1.webp … banner_20.webp.
// A guide's "Banner:" line is a number, "random" (the default) or "none".
const BANNER_COUNT = 20;
function bannerChoice(v) {
  v = String(v || '').trim().toLowerCase();
  if (v === 'none' || v === 'off') return 'none';
  const n = parseInt(v, 10);
  return n >= 1 && n <= BANNER_COUNT ? n : 'random';
}

// ============================================================
// PROFILE PAGES — /by/<handle>/profile.md
//   Name: SL FNK
//   Location: San Miguel de Allende
//   Photo: https://…
//   Link: https://…        (repeat for each link)
//   ## Bio
//   Paragraphs, blank line between them.
// ============================================================
function parseProfileMd(text) {
  const out = { name: '', location: '', photo: '', banner: '', links: [], bio: [] };
  const lines = String(text || '').replace(/\r\n?/g, '\n').split('\n');
  let inBio = false;
  const bio = [];
  lines.forEach(line => {
    if (/^##\s*Bio\s*$/i.test(line.trim())) { inBio = true; return; }
    if (inBio) { bio.push(line); return; }
    const m = line.match(/^(\w[\w\s]*?):\s*(.*)$/);
    if (!m) return;
    const k = m[1].trim().toLowerCase(), v = m[2].trim();
    if (k === 'name') out.name = v;
    else if (k === 'location') out.location = v;
    else if (k === 'photo') out.photo = v;
    else if (k === 'banner') out.banner = v;
    else if (k === 'link' && /^https?:\/\//i.test(v)) out.links.push(v);
  });
  out.bio = bio.join('\n').split(/\n\s*\n/).map(p => p.replace(/\s*\n\s*/g, ' ').trim()).filter(Boolean);
  return out;
}

// ============================================================
// PASSWORD PROTECTION
// A protected places.md keeps only its title area in plain text. Everything
// else is encrypted (AES-GCM, key from the password via PBKDF2) into one line:
//   Locked: v1.<salt>.<iv>.<ciphertext>
// The site is public, so the encryption is what actually keeps it private.
// ============================================================
const LOCK_PUBLIC_KEYS = ['Guide', 'Title', 'Subtitle', 'Author', 'Author Link', 'Profile', 'Banner', 'Updated', 'Center'];
const LOCK_ITERATIONS = 200000;

function lockB64(bytes) {
  let s = ''; const b = new Uint8Array(bytes);
  for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000));
  return btoa(s);
}
function lockUnB64(str) { return Uint8Array.from(atob(str), c => c.charCodeAt(0)); }
async function lockKey(password, salt) {
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: LOCK_ITERATIONS, hash: 'SHA-256' }, base,
    { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}
// Plain guide text → protected guide text
async function lockGuideText(text, password) {
  const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await lockKey(password, salt);
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(text));
  const header = String(text).split(/^===$/m)[0].split('\n').filter(line => {
    const m = line.match(/^(\w[\w\s]*?):\s*(.+)$/);
    return m && LOCK_PUBLIC_KEYS.includes(m[1].trim());
  });
  return header.join('\n') + '\nLocked: v1.' + lockB64(salt) + '.' + lockB64(iv) + '.' + lockB64(ct) + '\n';
}
// The "Locked:" value + password → plain guide text (throws if the password is wrong)
async function unlockGuideText(locked, password) {
  const parts = String(locked).trim().split('.');
  if (parts[0] !== 'v1' || parts.length !== 4) throw new Error('Unrecognized lock format');
  const key = await lockKey(password, lockUnB64(parts[1]));
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: lockUnB64(parts[2]) }, key, lockUnB64(parts[3]));
  return new TextDecoder().decode(pt);
}
