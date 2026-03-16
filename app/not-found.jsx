export const metadata = {
  title: '404 — Page not found'
};

export default function NotFound() {
  return (
    <div className="notfound-page">
      <div className="cursor-dot"></div>
      <div className="cursor-ring"></div>
      <div className="notfound-particles" aria-hidden="true"></div>
      <div className="notfound-wrap">
        <div className="notfound-code fade-up">404</div>
        <h2 className="notfound-title fade-up delay-1">It seems you’re&nbsp;lost</h2>
        <p className="fade-up delay-2">Only those who wander discover what they’re&nbsp;seeking.</p>
        <a href="/" className="coming-button fade-up delay-3" aria-label="Back to home">Back to home</a>
      </div>
    </div>
  );
}
