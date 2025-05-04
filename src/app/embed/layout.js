export default function EmbedLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, height: '100vh', overflow: 'hidden' }}>
        {children}
      </body>
    </html>
  );
}