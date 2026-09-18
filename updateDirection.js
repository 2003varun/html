const fs = require('fs');
let css = fs.readFileSync('styles.css', 'utf8');

// The current CSS has:
/*
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
*/

const oldCss = `.unified-marquee-wrapper .marquee-track {
  display: flex;
  gap: 12px;
  width: max-content;
  animation: unified-scroll 40s linear infinite;
}

@keyframes unified-scroll {
  0% { transform: translateX(0); }
  /* Translate by exactly 50% minus half the gap (12px / 2 = 6px) to align the duplicated seam perfectly */
  100% { transform: translateX(calc(-50% - 6px)); }
}`;

const newCss = `.unified-marquee-wrapper .marquee-track {
  display: flex;
  gap: 12px;
  width: max-content;
}

.unified-marquee-wrapper .marquee-track:nth-child(1) {
  animation: unified-scroll-ltr 40s linear infinite;
}

.unified-marquee-wrapper .marquee-track:nth-child(2) {
  animation: unified-scroll-rtl 40s linear infinite;
}

@keyframes unified-scroll-rtl {
  0% { transform: translateX(0); }
  100% { transform: translateX(calc(-50% - 6px)); }
}

@keyframes unified-scroll-ltr {
  0% { transform: translateX(calc(-50% - 6px)); }
  100% { transform: translateX(0); }
}`;

css = css.replace(oldCss, newCss);

fs.writeFileSync('styles.css', css);
console.log('styles.css updated with opposing marquee directions!');
