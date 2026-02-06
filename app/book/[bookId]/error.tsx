'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Book loading error:', error);
  }, [error]);

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F0F0F0',
      padding: '2rem',
    }}>
      <div style={{
        maxWidth: '600px',
        textAlign: 'center',
        fontFamily: 'Georgia, serif',
      }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1a1a1a' }}>
          Failed to Load Book
        </h1>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          {error.message || 'An error occurred while loading the book.'}
        </p>
        {error.message.includes('API key') && (
          <div style={{
            backgroundColor: '#fff',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            textAlign: 'left',
            fontSize: '0.875rem',
          }}>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>Setup Required:</strong>
            </p>
            <ol style={{ marginLeft: '1.5rem', lineHeight: '1.6' }}>
              <li>Get your API key from <a href="https://gutenbergapi.com" target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc' }}>gutenbergapi.com</a></li>
              <li>Create a <code style={{ background: '#f0f0f0', padding: '0.125rem 0.25rem', borderRadius: '3px' }}>.env.local</code> file</li>
              <li>Add: <code style={{ background: '#f0f0f0', padding: '0.125rem 0.25rem', borderRadius: '3px' }}>NEXT_PUBLIC_GUTENBERG_API_KEY=your_key</code></li>
              <li>Restart the development server</li>
            </ol>
          </div>
        )}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={reset}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#1a1a1a',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
          >
            Try Again
          </button>
          <Link
            href="/"
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#fff',
              color: '#1a1a1a',
              border: '1px solid #d0d0d0',
              borderRadius: '4px',
              textDecoration: 'none',
              display: 'inline-block',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
          >
            Back to Library
          </Link>
        </div>
      </div>
    </div>
  );
}

