const fs = require('fs');
let css = fs.readFileSync('styles.css', 'utf8');

const newScaleRules = `
/* Additional visual normalization */
.unified-marquee-wrapper .client-logo-card .logo-ads { transform: scale(1.4) !important; }
.unified-marquee-wrapper .client-logo-card .logo-balrakshabhaarth { transform: scale(1.4) !important; }
.unified-marquee-wrapper .client-logo-card .logo-servopro { transform: scale(1.35) !important; }
.unified-marquee-wrapper .client-logo-card .logo-ecolab { transform: scale(1.25) !important; }
.unified-marquee-wrapper .client-logo-card .logo-aribasap { transform: scale(1.2) !important; }
.unified-marquee-wrapper .client-logo-card .logo-john-deere { transform: scale(1.25) !important; }
.unified-marquee-wrapper .client-logo-card .logo-kinly { transform: scale(1.2) !important; }
.unified-marquee-wrapper .client-logo-card .logo-kpmg { transform: scale(1.15) !important; }
`;

css += '\n' + newScaleRules;
fs.writeFileSync('styles.css', css);
console.log('styles.css updated with additional logo scale normalization!');
