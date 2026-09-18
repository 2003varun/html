const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
let css = fs.readFileSync('styles.css', 'utf8');

// 1. Extract ALL unique logos from index.html (from wherever they are)
const imgRegex = /<img src="([^"]+)"([^>]*)>/g;
const uniqueSet = new Set();
const allLogos = [];

// Look inside the specific section to avoid grabbing header logos, etc.
const sectionMatch = html.match(/<section aria-label="Client logos"[\s\S]*?<\/section>/);
if (!sectionMatch) {
  console.log("Section not found!");
  process.exit(1);
}

let m;
while ((m = imgRegex.exec(sectionMatch[0])) !== null) {
  if (!uniqueSet.has(m[1])) {
    uniqueSet.add(m[1]);
    allLogos.push({ src: m[1], attrs: m[2] });
  }
}

console.log("Total unique logos found:", allLogos.length);

if (allLogos.length !== 32) {
  console.log("Warning: Expected 32 logos, got", allLogos.length);
}

// 2. Build the new Unified Marquee HTML
const row1 = allLogos.slice(0, 16);
const row2 = allLogos.slice(16, 32);

const buildTrack = (logos) => {
  const cards = logos.map(l => `              <div class="client-logo-card"><img src="${l.src}"${l.attrs}></div>`);
  // Duplicate exactly once for seamless scroll
  return [...cards, ...cards].join('\n');
};

const unifiedMarqueeHtml = `          <div class="unified-marquee-wrapper" style="container-type: inline-size; display: flex; flex-direction: column; gap: 12px; overflow: hidden;">
            <div class="marquee-track">
${buildTrack(row1)}
            </div>
            <div class="marquee-track">
${buildTrack(row2)}
            </div>
          </div>`;

// Replace everything between the heading and the end of the section with the unified marquee
const headingRegex = /(Trusted by teams at\s*<\/div>)([\s\S]*?)(<\/section>)/;
html = html.replace(headingRegex, `$1\n${unifiedMarqueeHtml}\n        $3`);
fs.writeFileSync('index.html', html);
console.log("index.html updated successfully!");

// 3. Update CSS
// Remove any old .client-logos-grid block or marquee block that conflicts
// Instead of complex regex replacing, we will append our highly specific unified styles.
// Since the HTML class is now `unified-marquee-wrapper`, we can target it safely.

const unifiedCss = `
.unified-marquee-wrapper {
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: hidden;
  width: 100%;
}

.unified-marquee-wrapper .marquee-track {
  display: flex;
  gap: 12px;
  width: max-content;
  animation: unified-scroll 40s linear infinite;
}

@keyframes unified-scroll {
  0% { transform: translateX(0); }
  /* Translate by exactly 50% minus half the gap (12px / 2 = 6px) to align the duplicated seam perfectly */
  100% { transform: translateX(calc(-50% - 6px)); }
}

.unified-marquee-wrapper .client-logo-card {
  flex-shrink: 0;
  width: calc((100cqw - (7 * 12px)) / 8); /* Exactly 8 visible per row on desktop */
  aspect-ratio: 3 / 2;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface, #fff);
  border: 1px solid var(--color-divider, #eaeaea);
  border-radius: 6px;
  padding: 10px;
}

.unified-marquee-wrapper .client-logo-card .client-logo-img {
  width: 100% !important;
  height: 100% !important;
  max-width: 100% !important;
  max-height: 100% !important;
  object-fit: contain !important;
}

@media (max-width: 1024px) {
  .unified-marquee-wrapper .client-logo-card {
    width: calc((100cqw - (4 * 12px)) / 5); /* 5 visible */
  }
}

@media (max-width: 768px) {
  .unified-marquee-wrapper .client-logo-card {
    width: calc((100cqw - (2 * 12px)) / 3); /* 3 visible */
  }
}
`;

css += '\n\n' + unifiedCss;
fs.writeFileSync('styles.css', css);
console.log("styles.css updated successfully!");
