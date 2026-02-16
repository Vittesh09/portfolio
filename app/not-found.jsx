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
        <div className="notfound-code">404</div>
        <h2 className="notfound-title">It seems you’re&nbsp;lost</h2>
        <p>Only those who wander discover what they’re&nbsp;seeking.</p>
        <a href="/" className="coming-button" aria-label="Back to home">Back to home</a>
      </div>
    </div>
  );
}
