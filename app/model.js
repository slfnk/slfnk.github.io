// ============================================================
// GUIIDES GUIDE MODEL — used by the visual editor (/admin/)
// Turns places.md into an editable structure and back again.
// It reads the file with the same rules as /app/parser.js, so whatever
// the live guide shows before a save, it shows after.
// ============================================================

(function () {
  let uid = 0;
  const newId = () => 'b' + (++uid);

  // ---------- fields (the "- Key: value" lines on a spot) ----------
  function getField(spot, key) {
    const k = key.toLowerCase();
    const f = spot.fields.find(x => x.key.trim().toLowerCase() === k);
    return f ? f.value : '';
  }
  function setField(spot, key, value) {
    const k = key.toLowerCase();
    const i = spot.fields.findIndex(x => x.key.trim().toLowerCase() === k);
    const v = (value == null ? '' : String(value)).replace(/\s*\n\s*/g, ' ').trim();
    if (!v) { if (i >= 0) spot.fields.splice(i, 1); return; }
    if (i >= 0) { spot.fields[i].value = v; return; }
    // Keep a tidy, familiar order for new fields
    const order = ['category', 'price', 'location', 'image', 'google maps', 'instagram', 'facebook'];
    const rank = x => { const r = order.indexOf(x.trim().toLowerCase()); return r < 0 ? 99 : r; };
    const mine = rank(key);
    let at = spot.fields.findIndex(x => rank(x.key) > mine);
    if (at < 0) at = spot.fields.length;
    spot.fields.splice(at, 0, { key, value: v });
  }
  function getLatLng(spot) {
    const v = getField(spot, 'location');
    if (!v) return null;
    const c = v.split(',').map(x => parseFloat(x.trim()));
    // The live parser treats a latitude of 0 / NaN as "no location"
    if (!c[0] || isNaN(c[1])) return null;
    return { lat: c[0], lng: c[1] };
  }
  function setLatLng(spot, lat, lng) {
    if (lat == null) { setField(spot, 'Location', ''); return; }
    setField(spot, 'Location', (+lat).toFixed(7) + ', ' + (+lng).toFixed(7));
  }

  // ---------- parse ----------
  function parseGuideModel(text) {
    text = String(text).replace(/\r\n?/g, '\n');
    const [configBlock, ...entryBlocks] = text.split(/^===$/m);
    const model = { header: [], intro: [], categories: [], blocks: [] };
    const introLines = [];
    let section = 'meta';

    configBlock.split('\n').forEach(line => {
      if (line.trim() === '## Intro') { section = 'intro'; return; }
      if (line.trim() === '## Categories') { section = 'categories'; return; }
      if (section === 'meta') {
        const m = line.match(/^(\w[\w\s]*?):\s*(.+)$/);
        if (m) model.header.push({ key: m[1].trim(), value: m[2].trim() });
      } else if (section === 'intro') {
        introLines.push(line);
      } else {
        const cm = line.match(/^(.+?):\s*(#[0-9a-fA-F]{3,8})$/);
        if (cm) model.categories.push({ id: newId(), name: cm[1].trim(), color: cm[2].trim() });
      }
    });
    model.intro = introLines.join('\n').split(/\n\n+/).map(p => p.trim()).filter(Boolean);

    const raw = entryBlocks.join('===').split(/^---$/m).filter(b => b.trim());
    raw.forEach(block => {
      const lines = block.split('\n');
      const sectionLine = lines.find(l => l.trim().match(/^## (.+)$/));
      if (sectionLine) {
        const title = sectionLine.trim().replace(/^##\s*/, '');
        const blurb = [];
        let past = false;
        lines.forEach(l => {
          if (l.trim() === sectionLine.trim()) { past = true; return; }
          if (past && l.trim()) blurb.push(l.trim());
        });
        model.blocks.push({ type: 'section', id: newId(), title, blurb: blurb.join(' ') });
        return;
      }

      const spot = { type: 'spot', id: newId(), name: null, fields: [], paragraphs: [] };
      const desc = [];
      let foundName = false;
      lines.forEach(line => {
        const t = line.trim();
        if (!t) { if (foundName) desc.push(''); return; }
        if (!foundName && t.startsWith('# ')) {
          spot.name = t.replace(/^#+\s*/, '');
          foundName = true;
          return;
        }
        const meta = t.match(/^-\s*(.+?):\s*(.+)$/);
        if (meta && desc.filter(l => l.trim()).length === 0) {
          spot.fields.push({ key: meta[1].trim(), value: meta[2].trim() });
          return;
        }
        desc.push(t);
      });
      spot.paragraphs = desc.join('\n').split(/\n\n+/).map(p => p.trim()).filter(Boolean);
      if (spot.name) model.blocks.push(spot);
      else model.blocks.push({ type: 'raw', id: newId(), text: block.replace(/^\n+|\s+$/g, '') });
    });
    return model;
  }

  // ---------- write ----------
  function serializeGuideModel(model) {
    const o = [];
    model.header.forEach(h => { if (h.value.trim()) o.push(h.key + ': ' + h.value.replace(/\s*\n\s*/g, ' ').trim()); });
    o.push('', '## Intro', '');
    if (model.intro.length) o.push(model.intro.join('\n\n'), '');
    o.push('## Categories', '');
    model.categories.forEach(c => o.push(c.name.trim() + ': ' + c.color));
    o.push('', '===');
    model.blocks.forEach(b => {
      o.push('', '---', '');
      if (b.type === 'section') {
        o.push('## ' + b.title.trim());
        if (b.blurb.trim()) o.push('', b.blurb.trim());
      } else if (b.type === 'spot') {
        o.push('# ' + b.name.trim(), '');
        b.fields.forEach(f => o.push('- ' + f.key + ': ' + f.value));
        if (b.paragraphs.length) o.push(b.paragraphs.join('\n\n'));
      } else {
        o.push(b.text);
      }
    });
    return o.join('\n') + '\n';
  }

  // ---------- header helpers ----------
  function getMeta(model, key) {
    const h = model.header.find(x => x.key.toLowerCase() === key.toLowerCase());
    return h ? h.value : '';
  }
  function setMeta(model, key, value, after) {
    const i = model.header.findIndex(x => x.key.toLowerCase() === key.toLowerCase());
    const v = String(value == null ? '' : value);
    if (i >= 0) { model.header[i].value = v; return; }
    if (!v.trim()) return;
    let at = model.header.length;
    if (after) {
      const j = model.header.findIndex(x => x.key.toLowerCase() === after.toLowerCase());
      if (j >= 0) at = j + 1;
    }
    model.header.splice(at, 0, { key, value: v });
  }

  const api = { parseGuideModel, serializeGuideModel, getField, setField, getLatLng, setLatLng, getMeta, setMeta, newId };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else window.GuideModel = api;
})();
