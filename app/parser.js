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
        else if (key === 'color' && /^#[0-9a-fA-F]{3,8}$/.test(val)) place.color = val;
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
