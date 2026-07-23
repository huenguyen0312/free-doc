// Viewer PDF (pdf.js) cho trang chi tiết tài liệu. Tách riêng khỏi main.js vì cần load dưới dạng ES module.
import * as pdfjsLib from '/assets/js/vendor/pdfjs/pdf.min.mjs';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/assets/js/vendor/pdfjs/pdf.worker.min.mjs';

const MIN_SCALE = 0.6;
const MAX_SCALE = 2.4;
const SCALE_STEP = 0.2;

async function initDocPdfViewer() {
  const wrap = document.querySelector('[data-doc-viewer]');
  if (!wrap) return;

  const id = new URLSearchParams(window.location.search).get('id');
  const docs = await fetch('/assets/json/documents.json').then((res) => res.json());
  const doc = docs.find((d) => d.id === id) || docs[0];
  if (!doc) return;

  const canvas = wrap.querySelector('[data-doc-viewer-canvas]');
  const ctx = canvas.getContext('2d');
  const canvasWrap = wrap.querySelector('[data-doc-viewer-canvas-wrap]');
  const pageLabel = wrap.querySelector('[data-doc-viewer-page]');
  const watermark = wrap.querySelector('[data-doc-viewer-watermark]');
  const lockOverlay = wrap.querySelector('[data-doc-viewer-lock]');
  const zoomInBtn = wrap.querySelector('[data-doc-viewer-zoom-in]');
  const zoomOutBtn = wrap.querySelector('[data-doc-viewer-zoom-out]');
  const prevBtn = wrap.querySelector('[data-doc-viewer-prev]');
  const nextBtn = wrap.querySelector('[data-doc-viewer-next]');
  const fullscreenBtn = wrap.querySelector('[data-doc-viewer-fullscreen]');

  const pdf = await pdfjsLib.getDocument(doc.file).promise;
  const previewLimit = Math.min(doc.previewPageLimit || pdf.numPages, pdf.numPages);
  const isLimited = pdf.numPages > previewLimit;

  let currentPage = 1;
  let scale = 1.1;

  async function renderPage(num) {
    const page = await pdf.getPage(num);
    const viewport = page.getViewport({ scale });
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: ctx, viewport }).promise;

    pageLabel.textContent = `Trang ${num} / ${pdf.numPages}`;
    prevBtn.disabled = num <= 1;
    nextBtn.disabled = num >= previewLimit;
    watermark.hidden = !isLimited;
    lockOverlay.hidden = !(isLimited && num >= previewLimit);
  }

  await renderPage(currentPage);

  prevBtn.addEventListener('click', () => {
    if (currentPage <= 1) return;
    currentPage--;
    renderPage(currentPage);
  });

  nextBtn.addEventListener('click', () => {
    if (currentPage >= previewLimit) return;
    currentPage++;
    renderPage(currentPage);
  });

  zoomInBtn.addEventListener('click', () => {
    scale = Math.min(scale + SCALE_STEP, MAX_SCALE);
    renderPage(currentPage);
  });

  zoomOutBtn.addEventListener('click', () => {
    scale = Math.max(scale - SCALE_STEP, MIN_SCALE);
    renderPage(currentPage);
  });

  fullscreenBtn.addEventListener('click', () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      canvasWrap.requestFullscreen();
    }
  });
}

initDocPdfViewer();
