import Link from 'next/link';
import { getAllBooks } from '@/data/books';
import styles from './page.module.css';

export default function Home() {
  const books = getAllBooks();

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>My Library</h1>
        <p className={styles.subtitle}>Select a book to start reading</p>
        
        <div className={styles.actions}>
          <Link href="/search" className={styles.searchButton}>
            🔍 Search Project Gutenberg
          </Link>
          <Link href="/extract-chapters" className={styles.extractButton}>
            Extract Chapters from Book
          </Link>
        </div>
        
        <div className={styles.bookList}>
          {books.length === 0 ? (
            <p className={styles.empty}>No books available</p>
          ) : (
            books.map((book) => (
              <Link
                key={book.id}
                href={`/book/${book.id}`}
                className={styles.bookCard}
              >
                <div className={styles.bookInfo}>
                  <h2 className={styles.bookTitle}>{book.title}</h2>
                  <p className={styles.bookAuthor}>by {book.author}</p>
                </div>
                <div className={styles.arrow}>→</div>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
