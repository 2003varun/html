const html = require('fs').readFileSync('index.html', 'utf8');
const imgs = html.match(/<img src="\.\/bg%20removed\/[^"]+"[^>]*>/g);
const unique = [...new Set(imgs)];
console.log('Unique logos:', unique.length);
