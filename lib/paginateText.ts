/**
 * Splits raw text into readable pages/chunks
 * Each page contains approximately WORDS_PER_PAGE words
 * 
 * @param text - The raw text to paginate
 * @param wordsPerPage - Number of words per page (default: 250
 * @returns Array of page strings
 */
export function paginateText(text: string, wordsPerPage: number = 250): string[] {
  if (!text || text.trim().length === 0) {
    return [''];
  }

  // Split text into words while preserving spaces
  const words = text.trim().split(/\s+/);
  const pages: string[] = [];

  // Group words into pages
  for (let i = 0; i < words.length; i += wordsPerPage) {
    const pageWords = words.slice(i, i + wordsPerPage);
    pages.push(pageWords.join(' '));
  }

  return pages;
}

