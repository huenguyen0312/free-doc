const express = require('express');
const path = require('path');
const fs = require('fs');

const DIST = path.join(__dirname, 'dist');
const PORT = process.env.PORT || 8081;

if (!fs.existsSync(DIST)) {
  console.error('Chưa có thư mục dist/. Hãy chạy "npm run build" trước.');
  process.exit(1);
}

const app = express();
app.use(express.static(DIST));
app.listen(PORT, () => {
  console.log(`Preview dist/ tại http://localhost:${PORT}`);
});
