// Shared custom cursor (supports both cursor/follower and dot/ring pairs)
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function getCursorEls() {
  return {
    cursor: document.querySelector('.cursor'),
    follower: document.querySelector('.cursor-follower'),
    dot: document.querySelector('.cursor-dot'),
    ring: document.querySelector('.cursor-ring')
  };
}

function initCursor() {
  let { cursor, follower, dot, ring } = getCursorEls();

  if (prefersReducedMotion || (!cursor && !dot) || (!follower && !ring)) {
    return false;
  }

  document.documentElement.classList.add('cursor-ready');

  let mouseX = 0;
  let mouseY = 0;
  let primaryX = 0;
  let primaryY = 0;
  let secondaryX = 0;
  let secondaryY = 0;
  const primarySpeed = dot ? 0.35 : 0.25;
  const secondarySpeed = dot ? 0.18 : 0.12;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    primaryX += (mouseX - primaryX) * primarySpeed;
    primaryY += (mouseY - primaryY) * primarySpeed;
    secondaryX += (mouseX - secondaryX) * secondarySpeed;
    secondaryY += (mouseY - secondaryY) * secondarySpeed;

    // Refresh element refs if we navigated to a new page.
    if ((cursor && !cursor.isConnected) || (follower && !follower.isConnected) || (dot && !dot.isConnected) || (ring && !ring.isConnected)) {
      ({ cursor, follower, dot, ring } = getCursorEls());
      if ((!cursor && !dot) || (!follower && !ring)) {
        requestAnimationFrame(animate);
        return;
      }
    }

    if (follower) {
      follower.style.left = secondaryX + 'px';
      follower.style.top = secondaryY + 'px';
    }

    if (ring) {
      ring.style.left = secondaryX + 'px';
      ring.style.top = secondaryY + 'px';
      const ringScale = ring.classList.contains('click') ? 0.55 : 1;
      ring.style.transform = `translate(-50%, -50%) scale(${ringScale})`;
    }

    if (cursor) {
      cursor.style.left = primaryX + 'px';
      cursor.style.top = primaryY + 'px';
    }

    if (dot) {
      dot.style.left = primaryX + 'px';
      dot.style.top = primaryY + 'px';
      const dotScale = dot.classList.contains('click') ? 0.6 : 1;
      dot.style.transform = `translate(-50%, -50%) scale(${dotScale})`;
    }

    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('mousedown', () => {
    const els = getCursorEls();
    if (els.cursor) els.cursor.classList.add('click');
    if (els.follower) els.follower.classList.add('click');
    if (els.dot) els.dot.classList.add('click');
    if (els.ring) els.ring.classList.add('click');
  });

  window.addEventListener('mouseup', () => {
    const els = getCursorEls();
    if (els.cursor) els.cursor.classList.remove('click');
    if (els.follower) els.follower.classList.remove('click');
    if (els.dot) els.dot.classList.remove('click');
    if (els.ring) els.ring.classList.remove('click');
  });
  return true;
}

let attempts = 0;
function tryInit() {
  attempts += 1;
  if (initCursor()) return;
  if (attempts < 60) requestAnimationFrame(tryInit);
}

tryInit();
