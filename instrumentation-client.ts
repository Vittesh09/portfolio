function isMissingCssChunk(reason: unknown) {
  const message =
    reason instanceof Error ? reason.message : typeof reason === 'string' ? reason : '';
  return message.includes('No link element found for chunk') && message.includes('.css');
}

if (process.env.NODE_ENV === 'development') {
  window.addEventListener('unhandledrejection', (event) => {
    if (!isMissingCssChunk(event.reason)) return;
    event.preventDefault();
  });
}
