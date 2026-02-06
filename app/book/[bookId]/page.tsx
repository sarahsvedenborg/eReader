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
    // Call the Gutenberg API directly from server-side
    const API_BASE_URL = 'https://project-gutenberg-free-books-api1.p.rapidapi.com';
    const API_KEY = process.env.NEXT_PUBLIC_GUTENBERG_API_KEY;

    if (!API_KEY) {
      console.error('Gutenberg API key not configured');
      return null;
    }

    const url = new URL(`${API_BASE_URL}/api/books/${gutenbergId}/text`);
    url.searchParams.set('cleaning_mode', 'simple');

    const response = await fetch(url.toString(), {
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'project-gutenberg-free-books-api1.p.rapidapi.com',
      },
      // Disable caching for dynamic content
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch Gutenberg book:', response.status, response.statusText);
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

