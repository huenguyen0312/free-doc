# FreeDoc (Free Documents)

Bộ khung dự án HTML/CSS mẫu, dùng **EJS** (template/component) và **SCSS** (style), build bằng script Node.js thuần (không cần gulp/webpack).

## Yêu cầu môi trường

- Node.js >= 18 (máy hiện tại: v24.4.1)
- npm >= 9 (máy hiện tại: 11.4.2)

## Cấu trúc thư mục

```
FreeDoc/
├── src/
│   ├── inc/                  # Các phần include (không tự thành 1 trang)
│   │   ├── commons/           # Block dùng chung cho mọi trang
│   │   │   ├── header.ejs
│   │   │   ├── footer.ejs
│   │   │   └── script.ejs      # Gom các thẻ <script> dùng chung, include cuối trang
│   │   ├── top/                 # Các block riêng của trang chủ (index)
│   │   │   ├── keyvisual.ejs
│   │   │   ├── target.ejs
│   │   │   ├── materials.ejs
│   │   │   ├── blog.ejs
│   │   │   └── challenge.ejs
│   │   ├── blogs/                # Các block riêng của trang blogs/
│   │   │   └── story-list.ejs
│   │   ├── visao/                # Các block riêng của trang visao/
│   │   │   └── qa-list.ejs
│   │   ├── meovat/                # Các block riêng của trang meovat/
│   │   │   └── tips-list.ejs
│   │   ├── dovui/                 # Các block riêng của trang dovui/
│   │   │   └── quiz.ejs
│   │   ├── lathinh/                # Các block riêng của trang lathinh/
│   │   │   └── memory-game.ejs
│   │   └── tailieu/
│   │       └── mamnon/              # Các block riêng của trang tailieu/mamnon/
│   │           └── list.ejs
│   ├── page/                 # Mỗi thư mục con = 1 trang, index.ejs là entry
│   │   ├── index.ejs          -> /index.html
│   │   ├── about/
│   │   │   └── index.ejs      -> /about/index.html
│   │   ├── blogs/
│   │   │   └── index.ejs      -> /blogs/index.html
│   │   ├── visao/
│   │   │   └── index.ejs      -> /visao/index.html
│   │   ├── meovat/
│   │   │   └── index.ejs      -> /meovat/index.html
│   │   ├── dovui/
│   │   │   └── index.ejs      -> /dovui/index.html
│   │   ├── lathinh/
│   │   │   └── index.ejs      -> /lathinh/index.html
│   │   └── tailieu/
│   │       └── mamnon/
│   │           └── index.ejs  -> /tailieu/mamnon/index.html
│   ├── json/                 # Data tĩnh (.json), dành cho logic đọc data sau này
│   │   └── sample.json
│   └── assets/
│       ├── scss/             # style.scss là file entry, còn lại là partials (_*.scss)
│       │   ├── style.scss
│       │   ├── _variables.scss
│       │   ├── _base.scss
│       │   ├── _header.scss
│       │   ├── _footer.scss
│       │   ├── _keyvisual.scss
│       │   ├── _target.scss
│       │   ├── _materials.scss
│       │   ├── _blog.scss
│       │   ├── _challenge.scss
│       │   ├── _story-list.scss
│       │   ├── _qa-list.scss
│       │   ├── _tips-list.scss
│       │   ├── _quiz.scss
│       │   ├── _memory-page.scss
│       │   └── _worksheet-list.scss
│       ├── js/
│       │   └── main.js
│       └── images/
│           ├── logo.svg
│           ├── target-placeholder.svg
│           └── blog-placeholder.svg
├── dist/                    # Output sau khi build (không commit, xem .gitignore)
├── server.js                 # Dev server: render EJS + compile SCSS realtime
├── build.js                   # Build production: xuất HTML/CSS/JS/ảnh ra dist/
├── preview.js                 # Chạy static server để xem thử thư mục dist/
├── package.json
└── .gitignore
```

## Cài đặt

```bash
cd FreeDoc
npm install
```

## Chạy dev (xem trực tiếp, không cần build)

```bash
npm start
```

Mở trình duyệt: http://localhost:8080

Server sẽ tự render lại `.ejs` và compile lại `.scss` mỗi lần bạn reload trang — sửa file xong chỉ cần F5, không cần build hay restart server.

Danh sách trang mẫu:

| URL | File nguồn |
|---|---|
| http://localhost:8080/index.html | src/page/index.ejs |
| http://localhost:8080/about/index.html | src/page/about/index.ejs |
| http://localhost:8080/blogs/index.html | src/page/blogs/index.ejs |
| http://localhost:8080/visao/index.html | src/page/visao/index.ejs |
| http://localhost:8080/meovat/index.html | src/page/meovat/index.ejs |
| http://localhost:8080/dovui/index.html | src/page/dovui/index.ejs |
| http://localhost:8080/lathinh/index.html | src/page/lathinh/index.ejs |
| http://localhost:8080/tailieu/mamnon/index.html | src/page/tailieu/mamnon/index.ejs |

## Build ra file tĩnh (HTML/CSS/JS thật)

```bash
npm run build
```

Kết quả nằm trong thư mục `dist/`:

```
dist/
├── index.html
├── about/index.html
└── assets/
    ├── css/style.css   (đã minify)
    ├── js/main.js
    └── images/logo.svg
```

Xem thử kết quả build:

```bash
npm run preview
```

Mở trình duyệt: http://localhost:8081

## Cách thêm trang mới

1. Tạo thư mục mới trong `src/page/`, ví dụ `src/page/contact/`.
2. Tạo file `index.ejs` bên trong, copy cấu trúc từ `src/page/about/index.ejs` để có sẵn `<head>`, header, footer.
3. Trang sẽ tự có tại `/contact/index.html` (cả khi chạy dev lẫn sau khi build).

Block dùng chung (`header`/`footer`/`script` trong `inc/commons/`) được include bằng đường dẫn tuyệt đối tính từ `src/`, nên dùng chung một cú pháp dù trang nằm sâu bao nhiêu cấp thư mục:

```ejs
<%- include('/inc/commons/header') %>
...
<%- include('/inc/commons/footer') %>
<%- include('/inc/commons/script') %>
```

## Cách thêm block dùng chung (`inc/commons/`)

Tạo file `.ejs` trong `src/inc/commons/`, sau đó include vào trang bằng `<%- include('/inc/commons/ten-file', { ...data }) %>`. Có thể truyền biến qua object thứ 2.

### `inc/commons/script.ejs`

`src/inc/commons/script.ejs` là nơi tập trung tất cả các thẻ `<script>` mà trang cần dùng (thư viện ngoài, script trang chi tiết, v.v.). Mỗi trang chỉ cần include một dòng `<%- include('/inc/commons/script') %>` ở cuối `<body>` thay vì tự khai báo `<script>` riêng lẻ — thêm script mới chỉ cần sửa một chỗ.

## Cách tách block riêng cho từng trang (`inc/<tên-trang>/`)

Với các block chỉ dùng riêng cho 1 trang (không dùng chung), tạo thư mục `src/inc/<tên-trang>/` (ví dụ `inc/top/` cho trang chủ) và đặt mỗi block trong 1 file `.ejs` tên tương ứng (ví dụ `keyvisual.ejs`, `target.ejs`). Sau đó include vào trang:

```ejs
<%- include('/inc/top/keyvisual') %>
<%- include('/inc/top/target') %>
```

Cách này giúp file trang (`page/index.ejs`) gọn gàng, mỗi block một file dễ chỉnh sửa độc lập.

## Cách thêm style mới

Tạo file partial `_ten-block.scss` trong `src/assets/scss/`, rồi `@use 'ten-block';` trong `style.scss`. Dùng biến chung khai báo ở `_variables.scss` qua `@use 'variables' as v;` rồi gọi `v.$ten-bien`.

## Thư mục `src/json/`

Chứa các file `.json` chứa data tĩnh (ví dụ `sample.json`). Thư mục này chuẩn bị sẵn cho việc sau này đọc data từ JSON và truyền vào EJS khi render trang (ví dụ dùng `fs.readFileSync` + `JSON.parse` trong `server.js`/`build.js` rồi truyền qua object locals của `ejs.render`). Hiện tại chưa có logic đọc — chỉ là chỗ chứa file data.
