/**
 * Zone Based Irrigation System - Academic Poster Interactions & PDF Export
 * REACT 2026 - IEEE Southeast University Student Branch
 */

document.addEventListener('DOMContentLoaded', () => {
  const posterCanvas = document.getElementById('posterCanvas');
  const viewport = document.getElementById('viewport');
  const printBtn = document.getElementById('printBtn');
  const downloadPdfBtn = document.getElementById('downloadPdfBtn');
  const zoomInBtn = document.getElementById('zoomInBtn');
  const zoomOutBtn = document.getElementById('zoomOutBtn');
  const zoomFitBtn = document.getElementById('zoomFitBtn');
  const zoomLevelDisplay = document.getElementById('zoomLevelDisplay');

  let currentScale = 1;
  let isFitMode = true;

  // Auto-fit function to scale poster nicely within user viewport
  function fitPosterToScreen() {
    if (!posterCanvas || !viewport) return;
    
    // Available viewport space (accounting for toolbar and padding)
    const availableWidth = viewport.clientWidth - 40;
    const availableHeight = window.innerHeight - 110;
    
    const posterWidth = 1400;
    const posterHeight = 1400;
    
    const scaleX = availableWidth / posterWidth;
    const scaleY = availableHeight / posterHeight;
    
    // Choose the smaller ratio to fit entirely on screen
    let fitScale = Math.min(scaleX, scaleY);
    // Clamp to practical bounds
    fitScale = Math.max(0.35, Math.min(fitScale, 1.2));
    
    currentScale = fitScale;
    applyScale(currentScale);
    zoomLevelDisplay.textContent = `${Math.round(currentScale * 100)}%`;
    isFitMode = true;
  }

  function applyScale(scale) {
    if (!posterCanvas) return;
    posterCanvas.style.transform = `scale(${scale})`;
    
    // Adjust wrapper height to prevent excessive overflow space
    const scaledHeight = 1400 * scale;
    viewport.style.minHeight = `${Math.max(window.innerHeight - 70, scaledHeight + 60)}px`;
  }

  // Zoom In
  zoomInBtn.addEventListener('click', () => {
    isFitMode = false;
    currentScale = Math.min(currentScale + 0.1, 2.0);
    applyScale(currentScale);
    zoomLevelDisplay.textContent = `${Math.round(currentScale * 100)}%`;
  });

  // Zoom Out
  zoomOutBtn.addEventListener('click', () => {
    isFitMode = false;
    currentScale = Math.max(currentScale - 0.1, 0.3);
    applyScale(currentScale);
    zoomLevelDisplay.textContent = `${Math.round(currentScale * 100)}%`;
  });

  // Fit to Screen button
  zoomFitBtn.addEventListener('click', () => {
    fitPosterToScreen();
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    if (isFitMode) {
      fitPosterToScreen();
    }
  });

  // Initial fit
  fitPosterToScreen();

  // Print / Save as PDF via native browser vector engine
  printBtn.addEventListener('click', () => {
    // Temporarily reset transform for clean print
    const originalTransform = posterCanvas.style.transform;
    posterCanvas.style.transform = 'none';
    
    window.print();
    
    // Restore transform after print dialog closes
    setTimeout(() => {
      posterCanvas.style.transform = originalTransform;
    }, 500);
  });

  // Direct PDF Download using html2pdf
  downloadPdfBtn.addEventListener('click', async () => {
    const originalText = downloadPdfBtn.innerHTML;
    downloadPdfBtn.disabled = true;
    downloadPdfBtn.innerHTML = `
      <svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
      </svg>
      Rendering PDF...
    `;

    try {
      // Temporarily remove transform so html2canvas captures at full 1400x1400 resolution
      const originalTransform = posterCanvas.style.transform;
      posterCanvas.style.transform = 'none';

      // Check if html2pdf is available
      if (typeof html2pdf !== 'undefined') {
        const opt = {
          margin: 0,
          filename: 'Zone_Based_Irrigation_System_REACT2026_Poster.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 2, // High DPI capture for crisp text & visuals
            useCORS: true,
            logging: false,
            letterRendering: true,
            scrollX: 0,
            scrollY: 0
          },
          jsPDF: {
            unit: 'px',
            format: [1400, 1400],
            orientation: 'portrait'
          }
        };

        await html2pdf().set(opt).from(posterCanvas).save();
      } else {
        // Fallback to browser print if CDN is unreachable
        window.print();
      }

      // Restore transform
      posterCanvas.style.transform = originalTransform;
    } catch (err) {
      console.error('PDF Generation Error:', err);
      // Fallback
      window.print();
    } finally {
      downloadPdfBtn.disabled = false;
      downloadPdfBtn.innerHTML = originalText;
    }
  });
});

