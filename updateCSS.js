const fs = require('fs');
let css = fs.readFileSync('styles.css', 'utf8');

const startStr = '.marquee-wrapper {';
const endStr = '.client-logo-img {';

const startIndex = css.indexOf(startStr);
const endIndex = css.indexOf(endStr);

if (startIndex === -1 || endIndex === -1) {
  console.log('CSS markers not found');
  process.exit(1);
}

const newCssBlock = `.client-logos-grid {
  display: grid;
  grid-template-columns: repeat(16, 1fr);
  gap: 12px;
  width: 100%;
}

@media (max-width: 1024px) {
  .client-logos-grid {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  }
}

.client-logo-card {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface, #fff);
  border: 1px solid var(--color-divider, #eaeaea);
  border-radius: 6px;
  padding: 10px;
  aspect-ratio: 3 / 2;
  width: 100%;
}

.client-logo-card .client-logo-img {
  width: 100% !important;
  height: 100% !important;
  max-width: 100% !important;
  max-height: 100% !important;
  object-fit: contain !important;
}

`;

const before = css.substring(0, startIndex);
const after = css.substring(endIndex);

fs.writeFileSync('styles.css', before + newCssBlock + after);
console.log('styles.css updated successfully!');
