const fs = require('fs');

fs.mkdirSync('dist/lib/api/contents', { force: true, recursive: true });
fs.writeFileSync(`dist/lib/api/contents/all.json`, JSON.stringify({ content: [] }));
