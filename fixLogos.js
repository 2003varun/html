const fs = require('fs');
let css = fs.readFileSync('styles.css', 'utf8');

// 1. Add overflow: hidden to cards to ensure scaled images do not spill out
css = css.replace('.unified-marquee-wrapper .client-logo-card {', '.unified-marquee-wrapper .client-logo-card {\n  overflow: hidden;');

// 2. Append scale rules for the 5 logos
const scaleRules = `
.unified-marquee-wrapper .client-logo-card .logo-esko { transform: scale(1.5) !important; }
.unified-marquee-wrapper .client-logo-card .logo-vedantu { transform: scale(1.4) !important; }
.unified-marquee-wrapper .client-logo-card .logo-tricon-infotech { transform: scale(1.35) !important; }
.unified-marquee-wrapper .client-logo-card .logo-ola { transform: scale(1.5) !important; }
.unified-marquee-wrapper .client-logo-card .logo-iprocure { transform: scale(1.4) !important; }
`;

css += '\n' + scaleRules;
fs.writeFileSync('styles.css', css);
console.log('styles.css updated with logo scale normalization!');
