'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { searchBooks, GutenbergBook } from '@/lib/gutenbergApi';
import styles from './page.module.css';

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [books, setBooks] = useState<GutenbergBook[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      return;
    }

    setIsSearching(true);
    setError(null);
    setHasSearched(true);

    try {
      const results = await searchBooks(query.trim(), 30);
      setBooks(results.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search books');
      setBooks([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleBookSelect = (book: GutenbergBook) => {
    // Navigate to reading page with book ID
    router.push(`/book/gutenberg-${book.id}`);
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>← Back to Library</Link>
        
        <h1 className={styles.title}>Search Project Gutenberg</h1>
        <p className={styles.subtitle}>
          Search from 76,000+ free books in the Project Gutenberg collection
        </p>

        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles.searchInputWrapper}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, author, or subject..."
              className={styles.searchInput}
              disabled={isSearching}
            />
            <button
              type="submit"
              disabled={isSearching || !query.trim()}
              className={styles.searchButton}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {error && (
          <div className={styles.error}>
            <p><strong>Error:</strong> {error}</p>
            {error.includes('API key') && (
              <p className={styles.apiKeyHint}>
                Please set the <code>NEXT_PUBLIC_GUTENBERG_API_KEY</code> environment variable.
                Get your API key from <a href="https://gutenbergapi.com" target="_blank" rel="noopener noreferrer">gutenbergapi.com</a>
              </p>
            )}
          </div>
        )}

        {hasSearched && !isSearching && books.length === 0 && !error && (
          <div className={styles.noResults}>
            No books found. Try a different search term.
          </div>
        )}

        {books.length > 0 && (
          <div className={styles.results}>
            <h2 className={styles.resultsTitle}>
              Found {books.length} book{books.length !== 1 ? 's' : ''}
            </h2>
            
            <div className={styles.bookList}>
              {books.map((book) => (
                <div
                  key={book.id}
                  onClick={() => handleBookSelect(book)}
                  className={styles.bookCard}
                >
                  {book.cover_image && (
                    <img
                      src={book.cover_image}
                      alt={`${book.title} cover`}
                      className={styles.bookCover}
                    />
                  )}
                  <div className={styles.bookInfo}>
                    <h3 className={styles.bookTitle}>{book.title}</h3>
                    {book.alternative_title && (
                      <p className={styles.alternativeTitle}>{book.alternative_title}</p>
                    )}
                    <p className={styles.bookAuthor}>
                      by {book.authors.map(a => a.name).join(', ')}
                    </p>
                    {book.subjects.length > 0 && (
                      <div className={styles.bookSubjects}>
                        {book.subjects.slice(0, 3).map((subject, idx) => (
                          <span key={idx} className={styles.subjectTag}>
                            {subject}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className={styles.bookMeta}>
                      <span className={styles.metaItem}>
                        {book.download_count.toLocaleString()} downloads
                      </span>
                      {book.reading_ease_score && (
                        <span className={styles.metaItem}>
                          Reading ease: {book.reading_ease_score}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={styles.bookArrow}>→</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

