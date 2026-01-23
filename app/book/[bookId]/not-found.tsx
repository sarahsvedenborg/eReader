import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Book Not Found</h1>
      <p className={styles.message}>The book you're looking for doesn't exist.</p>
      <Link href="/" className={styles.link}>
        ← Back to Library
      </Link>
    </div>
  );
}

