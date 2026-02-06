export default function Loading() {
  return (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F0F0F0',
      fontFamily: 'Georgia, serif',
      color: '#666',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Loading book...</div>
        <div style={{ fontSize: '0.875rem' }}>Fetching from Project Gutenberg</div>
      </div>
    </div>
  );
}

