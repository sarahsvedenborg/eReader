/**
 * Gutenberg API integration
 * Documentation: https://gutenbergapi.com/#documentation
 */

const API_BASE_URL = 'https://project-gutenberg-free-books-api1.p.rapidapi.com';
const API_KEY = process.env.NEXT_PUBLIC_GUTENBERG_API_KEY || '';

export interface GutenbergBook {
  id: number;
  title: string;
  alternative_title: string | null;
  authors: Array<{
    id: number;
    name: string;
  }>;
  subjects: string[];
  bookshelves: string[];
  media_type: string;
  download_count: number;
  issued: string;
  reading_ease_score: string | null;
  cover_image: string | null;
}

export interface GutenbergBookSearchResponse {
  next: string | null;
  previous: string | null;
  results: GutenbergBook[];
}

export interface GutenbergBookTextResponse {
  book_id: number;
  title: string;
  alternative_title: string | null;
  cleaning_mode: string;
  text: string;
  metadata: {
    original_length: number;
    cleaned_length: number;
    source_format: string;
    source_url: string;
  };
}

/**
 * Search for books in Project Gutenberg
 * Uses Next.js API route to avoid CORS issues
 */
export async function searchBooks(
  query: string,
  pageSize: number = 20
): Promise<GutenbergBookSearchResponse> {
  const url = new URL('/api/gutenberg/search', window.location.origin);
  url.searchParams.set('q', query);
  url.searchParams.set('page_size', pageSize.toString());

  const response = await fetch(url.toString());

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(errorData.error || `Failed to search books: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get book text by book ID
 * Uses Next.js API route to avoid CORS issues
 */
export async function getBookText(
  bookId: number,
  cleaningMode: 'simple' | 'advanced' = 'simple'
): Promise<GutenbergBookTextResponse> {
  const url = new URL(`/api/gutenberg/book/${bookId}/text`, window.location.origin);
  url.searchParams.set('cleaning_mode', cleaningMode);

  const response = await fetch(url.toString());

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(errorData.error || `Failed to fetch book text: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get book details by ID
 * Note: This function is not currently used but kept for future use
 * If needed, create an API route similar to the search route
 */
export async function getBookById(bookId: number): Promise<GutenbergBook> {
  // This would need an API route if used
  throw new Error('getBookById not implemented via API route yet');
}

