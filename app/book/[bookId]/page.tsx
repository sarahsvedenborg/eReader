import { notFound } from 'next/navigation';
import Reader from '@/components/Reader';
import { paginateText, paginateChapters, PageInfo } from '@/lib/paginateText';
import { getBookById } from '@/data/books';

interface BookPageProps {
  params: {
    bookId: string;
  };
}

export default function BookPage({ params }: BookPageProps) {
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

