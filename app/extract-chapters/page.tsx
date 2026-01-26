'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getAllBooks, Chapter } from '@/data/books';
import { extractChapters } from '@/lib/extractChapters';
import styles from './page.module.css';

export default function ExtractChaptersPage() {
  const books = getAllBooks();
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [extractedChapters, setExtractedChapters] = useState<Chapter[] | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedBook = books.find(book => book.id === selectedBookId);

  const handleExtract = () => {
    if (!selectedBook) {
      setError('Please select a book');
      return;
    }

    if (!selectedBook.text) {
      setError('This book does not have text to extract chapters from. It may already be using chapters.');
      return;
    }

    setIsExtracting(true);
    setError(null);
    setExtractedChapters(null);

    try {
      const chapters = extractChapters(selectedBook.text);
      setExtractedChapters(chapters);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while extracting chapters');
    } finally {
      setIsExtracting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy to clipboard');
    });
  };

  const generateChapterStructure = () => {
    if (!extractedChapters || !selectedBook) return '';

    const chaptersCode = extractedChapters.map((chapter, index) => {
      const isLast = index === extractedChapters.length - 1;
      // Escape backticks and template literal syntax for proper TypeScript template literal
      const escapedText = chapter.text
        .replace(/\\/g, '\\\\')  // Escape backslashes first
        .replace(/`/g, '\\`')     // Escape backticks
        .replace(/\${/g, '\\${'); // Escape template literal expressions
      
      return `  {
    title: ${JSON.stringify(chapter.title)},
    text: \`${escapedText}\`,
  }${isLast ? '' : ','}`;
    }).join('\n');

    return `export const ${selectedBook.id.replace(/-/g, '')}Chapters = [
${chaptersCode}
];`;
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>← Back to Library</Link>
        
        <h1 className={styles.title}>Extract Chapters</h1>
        <p className={styles.subtitle}>
          Select a book to extract chapters from its text. This is useful when adding new books.
        </p>

        <div className={styles.form}>
          <label htmlFor="book-select" className={styles.label}>
            Select a book:
          </label>
          <select
            id="book-select"
            value={selectedBookId}
            onChange={(e) => {
              setSelectedBookId(e.target.value);
              setExtractedChapters(null);
              setError(null);
            }}
            className={styles.select}
          >
            <option value="">-- Select a book --</option>
            {books
              .filter(book => book.text) // Only show books with text (not already chapter-based)
              .map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title} by {book.author}
                </option>
              ))}
          </select>

          {selectedBook && (
            <div className={styles.bookInfo}>
              <p><strong>Selected:</strong> {selectedBook.title}</p>
              <p><strong>Author:</strong> {selectedBook.author}</p>
              {selectedBook.text && (
                <p><strong>Text length:</strong> {selectedBook.text.length.toLocaleString()} characters</p>
              )}
            </div>
          )}

          <button
            onClick={handleExtract}
            disabled={!selectedBook || isExtracting}
            className={styles.extractButton}
          >
            {isExtracting ? 'Extracting...' : 'Extract Chapters'}
          </button>

          {error && (
            <div className={styles.error}>{error}</div>
          )}
        </div>

        {extractedChapters && (
          <div className={styles.results}>
            <h2 className={styles.resultsTitle}>
              Extracted {extractedChapters.length} Chapter{extractedChapters.length !== 1 ? 's' : ''}
            </h2>

            <div className={styles.chaptersList}>
              {extractedChapters.map((chapter, index) => {
                const wordCount = chapter.text.split(/\s+/).length;
                return (
                  <div key={index} className={styles.chapterItem}>
                    <div className={styles.chapterHeader}>
                      <span className={styles.chapterNumber}>{index + 1}.</span>
                      <span className={styles.chapterTitle}>{chapter.title}</span>
                      <span className={styles.chapterWordCount}>({wordCount.toLocaleString()} words)</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.codeSection}>
              <div className={styles.codeHeader}>
                <h3>Chapter Structure (for your book file)</h3>
                <button
                  onClick={() => copyToClipboard(generateChapterStructure())}
                  className={styles.copyButton}
                >
                  Copy Code
                </button>
              </div>
              <pre className={styles.codeBlock}>
                <code>{generateChapterStructure()}</code>
              </pre>
            </div>

            <div className={styles.instructions}>
              <h3>Next Steps:</h3>
              <ol>
                <li>Copy the code above</li>
                <li>Create a new file in <code>data/</code> (e.g., <code>data/your-book.ts</code>)</li>
                <li>Paste the code (it already contains the full chapter text)</li>
                <li>Update <code>books.ts</code> to use <code>chapters</code> instead of <code>text</code></li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

