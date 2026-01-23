/**
 * Splits raw text into readable pages/chunks
 * Each page contains approximately WORDS_PER_PAGE words
 * Preserves paragraph breaks (double newlines) for better readability
 * 
 * @param text - The raw text to paginate
 * @param wordsPerPage - Number of words per page (default: 250)
 * @returns Array of page strings with preserved paragraph breaks
 */
export function paginateText(text: string, wordsPerPage: number = 250): string[] {
  if (!text || text.trim().length === 0) {
    return [''];
  }

  // Split text into paragraphs (preserve double newlines)
  // First normalize line breaks, then split by double newlines
  const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const paragraphs = normalizedText.split(/\n\s*\n/).filter(p => p.trim().length > 0);

  const pages: string[] = [];
  let currentPage: string[] = [];
  let currentWordCount = 0;

  for (const paragraph of paragraphs) {
    const paragraphWords = paragraph.trim().split(/\s+/);
    const paragraphWordCount = paragraphWords.length;
    const paragraphText = paragraph.trim();

    // If a single paragraph exceeds the word limit, split it
    if (paragraphWordCount > wordsPerPage) {
      // First, save current page if it has content
      if (currentPage.length > 0) {
        pages.push(currentPage.join('\n\n'));
        currentPage = [];
        currentWordCount = 0;
      }

      // Split the large paragraph into chunks
      for (let i = 0; i < paragraphWords.length; i += wordsPerPage) {
        const chunk = paragraphWords.slice(i, i + wordsPerPage).join(' ');
        pages.push(chunk);
      }
      continue;
    }

    // Check if adding this paragraph would exceed the word limit
    if (currentWordCount + paragraphWordCount > wordsPerPage && currentPage.length > 0) {
      // Save current page and start a new one
      pages.push(currentPage.join('\n\n'));
      currentPage = [paragraphText];
      currentWordCount = paragraphWordCount;
    } else {
      // Add paragraph to current page
      currentPage.push(paragraphText);
      currentWordCount += paragraphWordCount;
    }
  }

  // Don't forget the last page
  if (currentPage.length > 0) {
    pages.push(currentPage.join('\n\n'));
  }

  // Ensure we have at least one page
  if (pages.length === 0) {
    return [''];
  }

  return pages;
}

