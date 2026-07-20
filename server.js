const express = require('express');
const ejs = require('ejs');
const sass = require('sass');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 8080;
const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const PAGE_DIR = path.join(SRC, 'page');
const ASSETS_DIR = path.join(SRC, 'assets');

// Render src/page/**/*.ejs -> tương ứng với request *.html
app.get(/.*\.html$/, (req, res, next) => {
  const rel = req.path.replace(/^\//, '').replace(/\.html$/, '.ejs');
  const ejsFile = path.join(PAGE_DIR, rel);

  if (!fs.existsSync(ejsFile)) return next();

  try {
    const html = ejs.render(fs.readFileSync(ejsFile, 'utf8'), {}, {
      filename: ejsFile,
      root: SRC,
    });
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    console.error('[EJS ERROR]', err.message);
    res.status(500).send(`<pre>${err.message}</pre>`);
  }
});

// Compile src/assets/scss/style.scss -> /assets/css/style.css theo từng request
app.get('/assets/css/style.css', (req, res) => {
  try {
    const result = sass.compile(path.join(ASSETS_DIR, 'scss', 'style.scss'), {
      style: 'expanded',
      sourceMap: true,
    });
    res.setHeader('Content-Type', 'text/css; charset=utf-8');
    res.send(result.css);
  } catch (err) {
    console.error('[SCSS ERROR]', err.message);
    res.status(500).send(`/* ${err.message} */`);
  }
});

app.use('/assets/js', express.static(path.join(ASSETS_DIR, 'js')));
app.use('/assets/images', express.static(path.join(ASSETS_DIR, 'images')));

app.get('/', (req, res) => res.redirect('/index.html'));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
