// ============================================================
// GUIIDES MARKDOWN — a small, safe Markdown renderer
// Used by the FAQ page (/faq/) and the editor's live preview.
// Supports: # headings, paragraphs, **bold**, *italic*, `code`,
// [links](https://…) and bare https:// links (open in a new tab),
// - bullet lists, 1. numbered lists, > quotes, and --- rules.
// Raw HTML is shown as text, never run.
// ============================================================
(function () {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const link = (href, text) => '<a href="' + href + '" target="_blank" rel="noopener">' + text + '</a>';

  function inline(s) {
    s = esc(s);
    const codes = [];
    s = s.replace(/`([^`]+)`/g, (m, c) => { codes.push('<code>' + c + '</code>'); return '\u0000' + (codes.length - 1) + '\u0000'; });
    const links = [];
    s = s.replace(/\[([^\]\n]+)\]\(((?:https?:\/\/|mailto:)[^\s)]+)\)/g, (m, t, u) => { links.push(link(u, t)); return '\u0001' + (links.length - 1) + '\u0001'; });
    s = s.replace(/(^|[\s(])(https?:\/\/[^\s<]+?)([.,;:!?)]*)(?=\s|$)/g, (m, a, u, z) => { links.push(link(u, u)); return a + '\u0001' + (links.length - 1) + '\u0001' + z; });
    s = s.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
         .replace(/(^|[^*\w])\*([^*\n]+)\*(?!\w)/g, '$1<em>$2</em>')
         .replace(/(^|[^_\w])_([^_\n]+)_(?!\w)/g, '$1<em>$2</em>');
    s = s.replace(/\u0001(\d+)\u0001/g, (m, i) => links[+i]).replace(/\u0000(\d+)\u0000/g, (m, i) => codes[+i]);
    return s;
  }

  function blocks(md) {
    const lines = String(md || '').replace(/\r\n?/g, '\n').split('\n');
    const out = [];
    let i = 0;
    const isBlockStart = l => /^(#{1,6})\s|^\s*([-*])\s+|^\s*\d+[.)]\s+|^>\s?|^(-{3,}|\*{3,})\s*$/.test(l);
    while (i < lines.length) {
      const l = lines[i];
      if (!l.trim()) { i++; continue; }
      let m;
      if ((m = l.match(/^(#{1,6})\s+(.*)$/))) { const n = m[1].length; out.push('<h' + n + '>' + inline(m[2].trim()) + '</h' + n + '>'); i++; continue; }
      if (/^(-{3,}|\*{3,})\s*$/.test(l)) { out.push('<hr>'); i++; continue; }
      if (/^>\s?/.test(l)) {
        const q = [];
        while (i < lines.length && /^>\s?/.test(lines[i])) q.push(lines[i++].replace(/^>\s?/, ''));
        out.push('<blockquote>' + blocks(q.join('\n')) + '</blockquote>'); continue;
      }
      if (/^\s*[-*]\s+/.test(l) || /^\s*\d+[.)]\s+/.test(l)) {
        const ordered = /^\s*\d+[.)]\s+/.test(l);
        const re = ordered ? /^\s*\d+[.)]\s+/ : /^\s*[-*]\s+/;
        const items = [];
        while (i < lines.length && re.test(lines[i])) {
          let item = lines[i++].replace(re, '');
          while (i < lines.length && lines[i].trim() && !isBlockStart(lines[i])) item += ' ' + lines[i++].trim();
          items.push('<li>' + inline(item) + '</li>');
        }
        out.push((ordered ? '<ol>' : '<ul>') + items.join('') + (ordered ? '</ol>' : '</ul>')); continue;
      }
      const para = [];
      while (i < lines.length && lines[i].trim() && !isBlockStart(lines[i])) para.push(lines[i++].trim());
      out.push('<p>' + inline(para.join(' ')) + '</p>');
    }
    return out.join('\n');
  }

  // FAQ layout: "# Title", an optional intro, then each "## Question" with its answer below
  function renderFaq(md) {
    const text = String(md || '').replace(/\r\n?/g, '\n');
    let title = '';
    const body = text.replace(/^#\s+(.+)\n?/m, (m, t) => { title = t.trim(); return ''; });
    const parts = body.split(/^##\s+(.+)$/m);
    let html = title ? '<h1>' + inline(title) + '</h1>' : '';
    if (parts[0].trim()) html += '<div class="faq-intro">' + blocks(parts[0]) + '</div>';
    for (let k = 1; k < parts.length; k += 2) {
      html += '<section class="faq-item"><h2>' + inline(parts[k].trim()) + '</h2><div class="faq-answer">' + blocks(parts[k + 1] || '') + '</div></section>';
    }
    return { title, html };
  }

  const api = { renderMarkdown: blocks, renderInline: inline, renderFaq };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else window.GuiidesMarkdown = api;
})();
