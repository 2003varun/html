const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const images = [...html.matchAll(/src="\.\/bg%20removed\/([^"]+)"/g)].map(m => m[1]);
const gitFiles = require('child_process').execSync('git ls-files "bg removed"').toString().split('\n').filter(Boolean).map(f => f.replace('bg removed/', ''));

const missing = images.filter(img => !gitFiles.includes(img));
console.log('Mismatched or missing in git:', missing.length ? [...new Set(missing)] : 'None');
