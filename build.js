const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const sass = require('sass');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const PAGE_DIR = path.join(SRC, 'page');
const ASSETS_DIR = path.join(SRC, 'assets');
const DIST = path.join(ROOT, 'dist');

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    const s = path.join(src, name);
    const d = path.join(dest, name);
    if (fs.statSync(s).isDirectory()) {
      copyDir(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

function walkEjs(dir) {
  const entries = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) {
      entries.push(...walkEjs(full));
    } else if (name.endsWith('.ejs')) {
      entries.push(full);
    }
  }
  return entries;
}

// Clean dist
if (fs.existsSync(DIST)) fs.rmSync(DIST, { recursive: true });
fs.mkdirSync(DIST, { recursive: true });

// 1. Render các trang trong src/page/**/*.ejs -> dist/**/*.html
let compiled = 0;
let errors = 0;

for (const file of walkEjs(PAGE_DIR)) {
  const rel = path.relative(PAGE_DIR, file).replace(/\.ejs$/, '.html');
  const dest = path.join(DIST, rel);
  ensureDir(dest);

  try {
    const html = ejs.render(fs.readFileSync(file, 'utf8'), {}, {
      filename: file,
      root: SRC,
    });
    fs.writeFileSync(dest, html, 'utf8');
    console.log(`[EJS] ${rel}`);
    compiled++;
  } catch (err) {
    console.error(`[ERR] ${rel}: ${err.message}`);
    errors++;
  }
}

// 2. Compile SCSS -> dist/assets/css/style.css
const cssDest = path.join(DIST, 'assets', 'css', 'style.css');
ensureDir(cssDest);
const result = sass.compile(path.join(ASSETS_DIR, 'scss', 'style.scss'), { style: 'compressed' });
fs.writeFileSync(cssDest, result.css, 'utf8');
console.log('[SCSS] assets/css/style.css');

// 3. Copy JS & images nguyên trạng
copyDir(path.join(ASSETS_DIR, 'js'), path.join(DIST, 'assets', 'js'));
copyDir(path.join(ASSETS_DIR, 'images'), path.join(DIST, 'assets', 'images'));
console.log('[CPY] assets/js, assets/images');

console.log(`\nBuild complete → dist/`);
console.log(`  Pages compiled : ${compiled}`);
if (errors) console.log(`  Errors         : ${errors}`);
