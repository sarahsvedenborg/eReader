'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Reader.module.css';

interface ReaderProps {
  pages: string[];
  bookId?: string; // Optional ID for localStorage key
}

/**
 * Reader component that displays text pages one at a time
 * - Tap left side to go to previous page
 * - Tap right side to go to next page
 * - Shows current page number and total pages
 * - Persists reading progress to localStorage
 */
export default function Reader({ pages, bookId = 'default' }: ReaderProps) {
  const storageKey = `ereader-${bookId}-page`;
  
  // Initialize with saved page or first page
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const pageNum = parseInt(saved, 10);
        // Ensure saved page is valid
        if (pageNum >= 0 && pageNum < pages.length) {
          return pageNum;
        }
      }
    }
    return 0;
  });

  // Save current page to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, currentPage.toString());
    }
  }, [currentPage, storageKey]);

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(pages.length - 1, prev + 1));
  };

  const handleScreenTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const screenWidth = e.currentTarget.clientWidth;
    const tapX = e.clientX;

    // Tap left half of screen -> previous page
    // Tap right half of screen -> next page
    if (tapX < screenWidth / 2) {
      goToPreviousPage();
    } else {
      goToNextPage();
    }
  };

  if (pages.length === 0) {
    return <div className={styles.container}>No content available</div>;
  }

  return (
    <div className={styles.container} onClick={handleScreenTap}>
      <div className={styles.content}>
        <Link href="/" className={styles.backButton} onClick={(e) => e.stopPropagation()}>
          ← Library
        </Link>
        <div className={styles.text}>
          {pages[currentPage]}
        </div>
        
        <div className={styles.footer}>
          <div className={styles.pageInfo}>
            {currentPage + 1} / {pages.length}
          </div>
          
          <div className={styles.controls}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPreviousPage();
              }}
              disabled={currentPage === 0}
              className={styles.button}
              aria-label="Previous page"
            >
              Prev
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNextPage();
              }}
              disabled={currentPage === pages.length - 1}
              className={styles.button}
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

