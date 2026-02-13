export const metadata = {
  title: '404 — Page not found'
};

export default function NotFound() {
  return (
    <div className="notfound-page">
      <div className="notfound-wrap">
        <h1>404</h1>
        <p>
          This page doesn’t exist — or it moved quietly.
          <br />
          Either way, nothing’s broken.
        </p>
        <a href="/">← Go home</a>
      </div>
    </div>
  );
}
