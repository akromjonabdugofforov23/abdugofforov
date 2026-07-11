const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../style.css');
const cssDir = path.join(__dirname, '../css');

if (!fs.existsSync(cssDir)) {
    fs.mkdirSync(cssDir);
}

const lines = fs.readFileSync(cssPath, 'utf-8').split('\n');

function getChunk(start, end) {
    return lines.slice(start, end).join('\n');
}

fs.writeFileSync(path.join(cssDir, 'variables.css'), getChunk(0, 132));
fs.writeFileSync(path.join(cssDir, 'base.css'), getChunk(132, 307));
fs.writeFileSync(path.join(cssDir, 'layout.css'), getChunk(307, 1398));
fs.writeFileSync(path.join(cssDir, 'components.css'), getChunk(1398, 1842));
fs.writeFileSync(path.join(cssDir, 'pages.css'), getChunk(1842, 2895));
fs.writeFileSync(path.join(cssDir, 'animations.css'), getChunk(2895, lines.length));

fs.writeFileSync(cssPath, @import url("css/variables.css");
@import url("css/base.css");
@import url("css/layout.css");
@import url("css/components.css");
@import url("css/pages.css");
@import url("css/animations.css");
);

console.log("CSS split successful!");
