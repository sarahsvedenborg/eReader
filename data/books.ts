/**
 * Books data structure
 * Add new books here by importing their text and adding to the books array
 */

import { aRoomWithAView } from './a-room-with-a-view';
import { prideAndPrejudice } from './pride-and-prejudice';

export interface Book {
  id: string;
  title: string;
  author: string;
  text: string;
}

export const books: Book[] = [
  {
    id: 'pride-and-prejudice',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    text: prideAndPrejudice,
  },
  {
    id: 'a-room-with-a-view',
    title: 'A Room with a View',
    author: 'E.M. Forster',
    text: aRoomWithAView,
  },
  // Add more books here as you import them
  // Example:
  // {
  //   id: 'another-book',
  //   title: 'Another Book',
  //   author: 'Author Name',
  //   text: anotherBookText,
  // },
];

/**
 * Get a book by its ID
 */
export function getBookById(id: string): Book | undefined {
  return books.find((book) => book.id === id);
}

/**
 * Get all available books
 */
export function getAllBooks(): Book[] {
  return books;
}

