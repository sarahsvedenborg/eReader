/**
 * Example: How to extract chapters from a new book
 * 
 * When you add a new book, follow these steps:
 * 
 * 1. Import the extractChapters function and your book text:
 * 
 *    import { extractChapters, logExtractedChapters } from './extractChapters';
 *    import { myNewBookText } from '../data/my-new-book';
 * 
 * 2. Run the extraction function to see the chapters:
 * 
 *    const chapters = logExtractedChapters(myNewBookText, 'My New Book');
 * 
 * 3. Review the console output to see:
 *    - How many chapters were found
 *    - The title of each chapter
 *    - A suggested structure for your books.ts file
 * 
 * 4. Create a new file in data/ with the chapters:
 * 
 *    // data/my-new-book.ts
 *    export const myNewBookChapters = [
 *      {
 *        title: 'Chapter 1',
 *        text: `...chapter text...`,
 *      },
 *      {
 *        title: 'Chapter 2',
 *        text: `...chapter text...`,
 *      },
 *      // ... etc
 *    ];
 * 
 * 5. Update books.ts to use chapters:
 * 
 *    import { myNewBookChapters } from './my-new-book';
 * 
 *    {
 *      id: 'my-new-book',
 *      title: 'My New Book',
 *      author: 'Author Name',
 *      chapters: myNewBookChapters,
 *    }
 * 
 * Note: You can run this in Node.js or in the browser console during development.
 * For Node.js, you'll need to set up a simple script or use ts-node.
 */

import { extractChapters, logExtractedChapters, type Chapter } from './extractChapters';

// Example usage (uncomment and modify when adding a new book):
/*
import { prideAndPrejudice } from '../data/pride-and-prejudice';

// This will log the extracted chapters to the console
const chapters = logExtractedChapters(prideAndPrejudice, 'Pride and Prejudice');

// Or just extract without logging:
// const chapters = extractChapters(prideAndPrejudice);
*/

export { extractChapters, logExtractedChapters, Chapter };

