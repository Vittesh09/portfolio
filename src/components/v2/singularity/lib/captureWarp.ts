/**
 * Capture size must match placeTextPlane.
 * Clone is forced fully visible — live DOM is never flashed for capture.
 */

let embeddedFonts: string | undefined;

export function measureWarpBox(node: HTMLElement) {
  const rect = node.getBoundingClientRect();
  return {
    left: rect.left,
    top: rect.top,
    width: Math.max(1, rect.width),
    height: Math.max(1, rect.height)
  };
}

function canvasHasInk(canvas: HTMLCanvasElement) {
  try {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return false;
    const { width, height } = canvas;
    if (width < 2 || height < 2) return false;
    const step = Math.max(1, Math.floor(Math.min(width, height) / 48));
    const { data } = ctx.getImageData(0, 0, width, height);
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        if (data[(y * width + x) * 4 + 3] > 12) return true;
      }
    }
    return false;
  } catch {
    return true;
  }
}

async function waitForPageReveal() {
  if (document.fonts?.status === 'loading') {
    await document.fonts.ready;
  }
  const root = document.querySelector('.v2-root');
  if (!root?.classList.contains('v2-media-pending')) return;
  await new Promise<void>((resolve) => {
    const finish = () => {
      observer.disconnect();
      window.clearTimeout(failSafe);
      resolve();
    };
    const observer = new MutationObserver(() => {
      if (!root.classList.contains('v2-media-pending')) finish();
    });
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    const failSafe = window.setTimeout(finish, 4000);
  });
}

export async function captureWarpSource(node: HTMLElement): Promise<HTMLCanvasElement | null> {
  try {
    await waitForPageReveal();

    const images = [...node.querySelectorAll('img')];
    await Promise.all(
      images.map((image) =>
        image.complete ? Promise.resolve() : new Promise<void>((resolve) => {
          image.addEventListener('load', () => resolve(), { once: true });
          image.addEventListener('error', () => resolve(), { once: true });
        })
      )
    );

    const box = measureWarpBox(node);
    const width = Math.round(box.width);
    const height = Math.round(box.height);
    const ratio = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
    const { toCanvas, getFontEmbedCSS } = await import('html-to-image');
    if (embeddedFonts === undefined) {
      try {
        embeddedFonts = await getFontEmbedCSS(node);
      } catch {
        embeddedFonts = '';
      }
    }

    const root = document.querySelector('.v2-root');
    const rootStyle = root ? getComputedStyle(root) : null;
    const fontVars = ['--font-geist', '--font-space', '--font-bricolage'] as const;
    const fontStyle = Object.fromEntries(
      fontVars.map((name) => [name, rootStyle?.getPropertyValue(name).trim() || ''])
    );

    const canvas = await toCanvas(node, {
      pixelRatio: ratio,
      cacheBust: false,
      fontEmbedCSS: embeddedFonts,
      preferredFontFormat: 'woff2',
      width,
      height,
      style: {
        opacity: '1',
        visibility: 'visible',
        overflow: 'visible',
        transform: 'none',
        filter: 'none',
        textShadow: 'none',
        color: '#f2efe6',
        backgroundColor: 'transparent',
        ['--v2-text-primary' as string]: '#f2efe6',
        ['--v2-text-secondary' as string]: 'rgba(242,239,230,0.82)',
        ['--v2-text-muted' as string]: 'rgba(242,239,230,0.55)',
        ['--v2-accent-pop' as string]: '#f23828',
        ...fontStyle
      },
      filter: (domNode) => {
        if (!(domNode instanceof HTMLElement)) return true;
        return !domNode.classList.contains('bh-cta');
      }
    });
    if (!canvasHasInk(canvas)) {
      console.warn('[singularity] text capture was empty');
      return null;
    }
    return canvas;
  } catch (error) {
    console.warn('[singularity] text capture failed', error);
    return null;
  }
}
