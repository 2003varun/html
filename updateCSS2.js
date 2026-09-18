const fs = require('fs');
let css = fs.readFileSync('styles.css', 'utf8');

css = css.replace('.client-logo-card .client-logo-img {', '.client-logos-grid .client-logo-card .client-logo-img {');

fs.writeFileSync('styles.css', css);
console.log('CSS specificity updated!');
