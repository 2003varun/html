const fs = require('fs');
const execSync = require('child_process').execSync;

// 1. Get current files
let html = fs.readFileSync('index.html', 'utf8');
let css = fs.readFileSync('styles.css', 'utf8');

// 2. Remove cache buster
html = html.replace(/\?v=[0-9]+/, '');

// 3. Extract all 32 unique logos from current HTML grid
const gridRegex = /<div class="client-logos-grid">([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/;
const gridMatch = html.match(gridRegex);
if (!gridMatch) { console.log("Current grid not found!"); process.exit(1); }

const imgRegex = /<img src="([^"]+)"([^>]*)>/g;
const uniqueSet = new Set();
const allLogos = [];
let m;
while ((m = imgRegex.exec(gridMatch[1])) !== null) {
  if (!uniqueSet.has(m[1])) {
    uniqueSet.add(m[1]);
    allLogos.push({ src: m[1], attrs: m[2] });
  }
}

if (allLogos.length !== 32) console.log("Warning: Did not find exactly 32 logos. Found", allLogos.length);

const gridLogos = allLogos.slice(0, 16);
const marqueeLogos = allLogos.slice(16);

// 4. Build Grid HTML (16 items)
const newGridHtml = `          <div class="client-logos-grid">
${gridLogos.map(l => `            <div class="client-logo-card"><img src="${l.src}"${l.attrs}></div>`).join('\n')}
          </div>`;

// 5. Build Marquee HTML (16 items)
// We split the remaining 16 into two tracks: 8 in left-to-right, 8 in right-to-left
const ltrLogos = marqueeLogos.slice(0, 8);
const rtlLogos = marqueeLogos.slice(8, 16);

// For the infinite scroll to work seamlessly, the original code duplicated the logos inside each track.
// So we duplicate them to ensure smooth wrapping.
const buildTrack = (logos) => [...logos, ...logos].map(l => `              <div class="logo-marquee-item"><img src="${l.src}"${l.attrs}></div>`).join('\n');

const newMarqueeHtml = `          <div class="marquee-wrapper" style="margin-top: 40px;">
            <div class="marquee-track left-to-right">
${buildTrack(ltrLogos)}
            </div>
            <div class="marquee-track right-to-left">
${buildTrack(rtlLogos)}
            </div>
          </div>`;

// 6. Replace HTML
const finalSectionHtml = `${newGridHtml}\n${newMarqueeHtml}\n        </div>\n      </section>`;
html = html.replace(gridRegex, finalSectionHtml);
fs.writeFileSync('index.html', html);
console.log("index.html updated successfully!");

// 7. Extract original CSS from Git HEAD
const headCss = execSync('git show HEAD:styles.css').toString();
const marqueeCssMatch = headCss.match(/\.marquee-wrapper \{[\s\S]*?\.logo-marquee-item \{[\s\S]*?\}/);

if (!css.includes('.marquee-wrapper {')) {
  // If the marquee CSS is missing (because we deleted it), append it
  // But wait, in the headCss, there is:
  // .marquee-wrapper { ... }
  // .marquee-track { ... }
  // @keyframes ...
  // .logo-marquee-item { ... }
  // Let's just extract the exact block we need.
  const marqueeStart = headCss.indexOf('.marquee-wrapper {');
  const marqueeEnd = headCss.indexOf('.client-logo-img {');
  const originalMarqueeCss = headCss.substring(marqueeStart, marqueeEnd);
  
  // Also, update grid CSS to 8 columns
  css = css.replace(/grid-template-columns: repeat\(16, 1fr\);/, 'grid-template-columns: repeat(8, 1fr);');
  
  // Inject marquee CSS
  css = css + '\n\n' + originalMarqueeCss;
  fs.writeFileSync('styles.css', css);
  console.log("styles.css updated successfully!");
} else {
  // If it's still there, just ensure grid is 8 cols
  css = css.replace(/grid-template-columns: repeat\(16, 1fr\);/, 'grid-template-columns: repeat(8, 1fr);');
  fs.writeFileSync('styles.css', css);
  console.log("styles.css grid columns updated!");
}
