import { toCanvas } from 'html-to-image';

/**
 * Capture size must match getBoundingClientRect used by placeTextPlane.
 * Clone is forced fully visible — live DOM is never flashed for capture.
 */
export async function captureWarpSource(node: HTMLElement): Promise<HTMLCanvasElement | null> {
  try {
    if (document.fonts?.status === 'loading') {
      await document.fonts.ready;
    }

    const rect = node.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    const ratio = Math.min(3, Math.max(2, (window.devicePixelRatio || 1) * 1.5));

    return await toCanvas(node, {
      pixelRatio: ratio,
      cacheBust: true,
      preferredFontFormat: 'woff2',
      width,
      height,
      style: {
        opacity: '1',
        visibility: 'visible',
        transform: 'none',
        filter: 'none',
        textShadow: 'none',
        WebkitFontSmoothing: 'antialiased',
        color: '#f2efe6',
        backgroundColor: 'transparent',
        ['--v2-text-primary' as string]: '#f2efe6',
        ['--v2-text-secondary' as string]: 'rgba(242,239,230,0.82)',
        ['--v2-text-muted' as string]: 'rgba(242,239,230,0.55)',
        ['--v2-accent-pop' as string]: '#f23828'
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
