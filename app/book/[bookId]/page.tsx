import { notFound } from 'next/navigation';
import Reader from '@/components/Reader';
import { paginateText, paginateChapters, PageInfo } from '@/lib/paginateText';
import { getBookById } from '@/data/books';
import { GutenbergBookTextResponse } from '@/lib/gutenbergApi';
import { extractChapters } from '@/lib/extractChapters';

interface BookPageProps {
  params: {
    bookId: string;
  };
}

async function getGutenbergBook(bookId: string): Promise<GutenbergBookTextResponse | null> {
  // Extract Gutenberg book ID from format "gutenberg-123"
  const gutenbergId = parseInt(bookId.replace('gutenberg-', ''), 10);

  if (isNaN(gutenbergId)) {
    return null;
  }

  try {
    // Use our API route which handles the RapidAPI call
    // Construct the URL - in server components we need to use absolute URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const url = new URL(`/api/gutenberg/book/${gutenbergId}/text`, baseUrl);
    url.searchParams.set('cleaning_mode', 'simple');

    console.log('Fetching Gutenberg book via API route:', url.toString());
    console.log('Gutenberg ID:', gutenbergId);

    const response = await fetch(url.toString(), {
      // Disable caching for dynamic content
      cache: 'no-store',
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      console.error('Failed to fetch Gutenberg book:', response.status, errorData);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching Gutenberg book:', error);
    return null;
  }
}

export default async function BookPage({ params }: BookPageProps) {
  // Check if this is a Gutenberg API book
  const isGutenbergBook = params.bookId.startsWith('gutenberg-');

  if (isGutenbergBook) {
    // Fetch book from Gutenberg API
    const gutenbergBook = await getGutenbergBook(params.bookId);

    if (!gutenbergBook) {
      notFound();
    }

    // Extract chapters from the text
    const chapters = extractChapters(gutenbergBook.text);

    // Paginate chapters
    const pages = paginateChapters(chapters, 130);

    return (
      <main>
        <Reader
          pages={pages}
          bookId={params.bookId}
          bookTitle={gutenbergBook.title}
        />
      </main>
    );
  }

  // Handle local books (existing functionality)
  const book = getBookById(params.bookId);

  if (!book) {
    notFound();
  }

  // Use chapter-based structure if available, otherwise fall back to full text
  let pages: PageInfo[];

  if (book.chapters && book.chapters.length > 0) {
    // Paginate chapters (130 words per page)
    pages = paginateChapters(book.chapters, 130);
  } else if (book.text) {
    // Legacy: paginate full text and create page info without chapter data
    const textPages = paginateText(book.text, 130);
    pages = textPages.map((text, index) => ({
      text,
      chapterIndex: 0,
      chapterTitle: 'Chapter 1',
      pageInChapter: index + 1,
      totalPagesInChapter: textPages.length,
    }));
  } else {
    notFound();
  }

  return (
    <main>
      <Reader pages={pages} bookId={book.id} />
    </main>
  );
}

