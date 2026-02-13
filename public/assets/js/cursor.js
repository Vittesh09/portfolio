// Shared custom cursor (supports both cursor/follower and dot/ring pairs)
document.documentElement.classList.add('cursor-ready');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');

if (!prefersReducedMotion && (cursor || dot) && (follower || ring)) {
  let mouseX = 0;
  let mouseY = 0;
  let primaryX = 0;
  let primaryY = 0;
  let secondaryX = 0;
  let secondaryY = 0;
  let parallaxY = window.scrollY || 0;

  const primarySpeed = dot ? 0.35 : 0.15;
  const secondarySpeed = dot ? 0.15 : 0.15;
  const parallaxStrength = 0.04;

  window.addEventListener('scroll', () => {
    parallaxY = window.scrollY || 0;
  });

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (cursor) {
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    }

    if (dot) {
      dot.style.transform =
        `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    }
  });

  function animate() {
    primaryX += (mouseX - primaryX) * primarySpeed;
    primaryY += (mouseY - primaryY) * primarySpeed;
    secondaryX += (mouseX - secondaryX) * secondarySpeed;
    secondaryY += (mouseY - secondaryY) * secondarySpeed;

    const parallaxOffset = parallaxY * parallaxStrength;

    if (follower) {
      follower.style.left = secondaryX + 'px';
      follower.style.top = (secondaryY + parallaxOffset) + 'px';
    }

    if (ring) {
      ring.style.transform =
        `translate(${secondaryX}px, ${secondaryY + parallaxOffset}px) translate(-50%, -50%)`;
    }

    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('mousedown', () => {
    if (cursor) cursor.classList.add('click');
    if (follower) follower.classList.add('click');
    if (dot) dot.classList.add('click');
    if (ring) ring.classList.add('click');
  });

  window.addEventListener('mouseup', () => {
    if (cursor) cursor.classList.remove('click');
    if (follower) follower.classList.remove('click');
    if (dot) dot.classList.remove('click');
    if (ring) ring.classList.remove('click');
  });
}
