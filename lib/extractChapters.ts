/**
 * Utility function to extract chapters from raw book text
 * 
 * This function looks for common chapter patterns:
 * - "Chapter X" or "Chapter X:" (with or without colon)
 * - "CHAPTER X" (uppercase)
 * - "Chapter X." (with period)
 * - Roman numerals: "Chapter I", "Chapter II", etc.
 * 
 * @param text - The raw book text
 * @returns Array of chapter objects with title and text
 */
export interface Chapter {
  title: string;
  text: string;
}

export function extractChapters(text: string): Chapter[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  // Normalize line breaks
  const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Pattern to match chapter headings
  // Matches: "Chapter 1", "Chapter 1:", "CHAPTER I", "Chapter One", etc.
  const chapterPattern = /^(?:Chapter|CHAPTER)\s+([IVXLC0-9]+|[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)[:.]?\s*$/im;

  // Split by lines and find chapter boundaries
  const lines = normalizedText.split('\n');
  const chapters: Chapter[] = [];
  let currentChapter: { title: string; lines: string[] } | null = null;
  let chapterNumber = 0;

  // First, try to find where the actual book content starts
  // (skip Project Gutenberg header, etc.)
  let contentStartIndex = 0;
  const startMarkers = [
    /^\*\*\* START OF/,
    /^Chapter\s+1/i,
    /^CHAPTER\s+1/i,
  ];

  for (let i = 0; i < lines.length; i++) {
    if (startMarkers.some(marker => marker.test(lines[i]))) {
      contentStartIndex = i;
      break;
    }
  }

  // Process lines starting from content
  for (let i = contentStartIndex; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check if this line is a chapter heading
    if (chapterPattern.test(line)) {
      // Save previous chapter if exists
      if (currentChapter) {
        chapters.push({
          title: currentChapter.title,
          text: currentChapter.lines.join('\n').trim(),
        });
      }

      // Start new chapter
      chapterNumber++;
      let chapterTitle = line;
      let skipToLine = i; // Track which line to continue from

      // Look ahead for a chapter subtitle/name (first non-empty line after the heading)
      // Skip empty lines and check the next few lines
      let subtitleLineIndex = i + 1;
      while (subtitleLineIndex < lines.length && lines[subtitleLineIndex].trim().length === 0) {
        subtitleLineIndex++;
      }

      // If we found a potential subtitle line, check if it looks like a chapter name
      if (subtitleLineIndex < lines.length) {
        const potentialSubtitle = lines[subtitleLineIndex].trim();

        // Consider it a subtitle if:
        // - It's relatively short (less than 100 characters)
        // - It's not obviously the start of a paragraph (doesn't start with common paragraph starters)
        // - It's followed by a blank line or the next line looks like paragraph text
        const isShort = potentialSubtitle.length < 100;
        const isNotParagraphStart = !/^["'\(]/.test(potentialSubtitle); // Doesn't start with quote or parenthesis
        const hasBlankLineAfter = subtitleLineIndex + 1 < lines.length &&
          lines[subtitleLineIndex + 1].trim().length === 0;
        const nextLineIsParagraph = subtitleLineIndex + 1 < lines.length &&
          lines[subtitleLineIndex + 1].trim().length > 0 &&
          /^["'\(A-Z]/.test(lines[subtitleLineIndex + 1].trim()); // Next line starts with quote or capital

        if (isShort && (hasBlankLineAfter || (isNotParagraphStart && nextLineIsParagraph))) {
          // Include subtitle in chapter title
          chapterTitle = `${line}: ${potentialSubtitle}`;
          // Skip the subtitle line - find the next non-empty line after it (or the line after if blank)
          skipToLine = subtitleLineIndex;
          // Skip blank lines after subtitle
          while (skipToLine + 1 < lines.length && lines[skipToLine + 1].trim().length === 0) {
            skipToLine++;
          }
        }
      }

      currentChapter = {
        title: chapterTitle,
        lines: [],
      };

      // Skip to the appropriate line (after subtitle if found)
      i = skipToLine;
    } else if (currentChapter) {
      // Add line to current chapter
      currentChapter.lines.push(lines[i]);
    } else if (line.length > 0) {
      // Content before first chapter - create a "Prologue" or "Introduction" chapter
      if (chapters.length === 0 && !currentChapter) {
        currentChapter = {
          title: 'Introduction',
          lines: [lines[i]],
        };
      } /* else if (currentChapter && currentChapter.lines) {
        currentChapter.lines.push(lines[i]);
      } */
    }
  }

  // Don't forget the last chapter
  if (currentChapter && currentChapter.lines.length > 0) {
    chapters.push({
      title: currentChapter.title,
      text: currentChapter.lines.join('\n').trim(),
    });
  }

  // If no chapters found, treat entire text as one chapter
  if (chapters.length === 0) {
    chapters.push({
      title: 'Chapter 1',
      text: normalizedText.trim(),
    });
  }

  return chapters;
}

/**
 * Helper function to manually extract chapters and log the result
 * Use this when adding new books to see the extracted chapters
 * 
 * @param text - The raw book text
 * @param bookTitle - Optional book title for logging
 */
export function logExtractedChapters(text: string, bookTitle?: string): Chapter[] {
  const chapters = extractChapters(text);

  console.log(`\n=== Extracted Chapters${bookTitle ? ` for ${bookTitle}` : ''} ===`);
  console.log(`Total chapters: ${chapters.length}\n`);

  chapters.forEach((chapter, index) => {
    const wordCount = chapter.text.split(/\s+/).length;
    console.log(`${index + 1}. ${chapter.title} (${wordCount} words)`);
  });

  console.log('\n=== Chapter Structure (for books.ts) ===\n');
  console.log('Copy this structure to your book data file:\n');
  console.log('export const bookChapters = [');
  chapters.forEach((chapter, index) => {
    const isLast = index === chapters.length - 1;
    console.log(`  {`);
    console.log(`    title: ${JSON.stringify(chapter.title)},`);
    console.log(`    text: ${JSON.stringify(chapter.text.substring(0, 100))}...`);
    console.log(`  }${isLast ? '' : ','}`);
  });
  console.log('];\n');

  return chapters;
}

