const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Find the marquee wrapper block
const wrapperRegex = /<div class=\"marquee-wrapper\">([\s\S]*?)<\/div>\s*<\/section>/;
const match = html.match(wrapperRegex);
if (!match) { console.log('marquee-wrapper not found'); process.exit(1); }

// 2. Extract unique images
const imgsRegex = /<div class=\"logo-marquee-item\">\s*<img src=\"([^\"]+)\"([^>]*)>\s*<\/div>/g;
const uniqueSet = new Set();
const uniqueCards = [];

let m;
while ((m = imgsRegex.exec(match[1])) !== null) {
  const src = m[1];
  const attrs = m[2];
  if (!uniqueSet.has(src)) {
    uniqueSet.add(src);
    uniqueCards.push(`              <div class="client-logo-card">
                <img src="${src}"${attrs}>
              </div>`);
  }
}

console.log('Unique logos extracted:', uniqueCards.length);

// 3. Build new grid HTML
const gridHtml = `<div class="client-logos-grid">
${uniqueCards.join('\n')}
            </div>
          </div>
        </section>`;

// Replace the old marquee block with the new grid block
html = html.replace(wrapperRegex, gridHtml);

fs.writeFileSync('index.html', html);
console.log('index.html updated successfully!');
