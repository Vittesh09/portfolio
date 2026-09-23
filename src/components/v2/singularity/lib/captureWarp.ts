/**
 * Capture size must match placeTextPlane.
 * Extra pad keeps descenders / the second headline line out of the crop.
 * Clone is forced fully visible — live DOM is never flashed for capture.
 */

export const WARP_CAPTURE_PAD_X = 16;
export const WARP_CAPTURE_PAD_Y = 36;

export function measureWarpBox(node: HTMLElement) {
  const rect = node.getBoundingClientRect();
  const width = Math.max(1, Math.max(rect.width, node.scrollWidth) + WARP_CAPTURE_PAD_X);
  const height = Math.max(1, Math.max(rect.height, node.scrollHeight) + WARP_CAPTURE_PAD_Y);
  return { left: rect.left, top: rect.top, width, height };
}

export async function captureWarpSource(node: HTMLElement): Promise<HTMLCanvasElement | null> {
  try {
    if (document.fonts?.status === 'loading') {
      await document.fonts.ready;
    }

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
    const { toCanvas } = await import('html-to-image');

    const root = document.querySelector('.v2-root');
    const rootStyle = root ? getComputedStyle(root) : null;
    const fontVars = ['--font-jakarta', '--font-bricolage'] as const;
    const fontStyle = Object.fromEntries(
      fontVars.map((name) => [name, rootStyle?.getPropertyValue(name).trim() || ''])
    );

    return await toCanvas(node, {
      pixelRatio: ratio,
      cacheBust: true,
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
  } catch (error) {
    console.warn('[singularity] text capture failed', error);
    return null;
  }
}
