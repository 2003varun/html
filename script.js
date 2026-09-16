const fs = require('fs');

const raw = fs.readFileSync('index.html', 'utf8');
let html = raw;

// If bundled in __bundler/template, extract the template string
const match = raw.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/i);
if (match) {
  try {
    html = JSON.parse(match[1]);
  } catch (e) {
    // fallback to raw
  }
}

const m = html.match(/class="marquee-content-rtl"[\s\S]*?<\/div>\s*<\/div>/);
console.log('RTL:', m ? (m[0].match(/<img/g) || []).length : 0);

const m2 = html.match(/class="marquee-content-ltr"[\s\S]*?<\/div>\s*<\/div>/);
console.log('LTR:', m2 ? (m2[0].match(/<img/g) || []).length : 0);
