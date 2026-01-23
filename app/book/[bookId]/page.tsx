import { notFound } from 'next/navigation';
import Reader from '@/components/Reader';
import { paginateText } from '@/lib/paginateText';
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

  // Paginate the book text
  // 250 words per page provides a comfortable reading experience
  const pages = paginateText(book.text, 130);

  return (
    <main>
      <Reader pages={pages} bookId={book.id} />
    </main>
  );
}

