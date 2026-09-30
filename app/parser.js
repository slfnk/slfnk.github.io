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
        else if (key === 'Categories') guide.categoriesOff = /^(off|no|none|false)$/i.test(val);
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
        content: contentLines.join(' ')
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
        else if ((key === 'link' || key === 'website') && /^https?:\/\//i.test(val)) place.links.push(val);
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

// ============================================================
// PASSWORD PROTECTION
// A protected places.md keeps only its title area in plain text. Everything
// else is encrypted (AES-GCM, key from the password via PBKDF2) into one line:
//   Locked: v1.<salt>.<iv>.<ciphertext>
// The site is public, so the encryption is what actually keeps it private.
// ============================================================
const LOCK_PUBLIC_KEYS = ['Guide', 'Title', 'Subtitle', 'Author', 'Author Link', 'Updated', 'Center'];
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
