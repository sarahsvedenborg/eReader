# Chapter Extraction Guide

This guide explains how to extract chapters from raw book text when adding new books to the library.

## Overview

The app now supports chapter-based book structure, which allows:
- Better organization of book content
- Display of pages remaining in the current chapter
- More accurate reading progress tracking

## How to Extract Chapters

### Step 1: Import the extraction function

In your development environment (browser console or a temporary script), import the function:

```typescript
import { logExtractedChapters } from '@/lib/extractChapters';
import { yourBookText } from '@/data/your-book';
```

### Step 2: Run the extraction

```typescript
const chapters = logExtractedChapters(yourBookText, 'Your Book Title');
```

This will:
- Extract chapters from the text (looking for "Chapter X" patterns)
- Log the results to the console
- Show you the suggested structure for your book file

### Step 3: Create the chapter file

Create a new file in `data/` with the extracted chapters:

```typescript
// data/your-book.ts
export const yourBookChapters = [
  {
    title: 'Chapter 1',
    text: `...full chapter text...`,
  },
  {
    title: 'Chapter 2',
    text: `...full chapter text...`,
  },
  // ... etc
];
```

### Step 4: Update books.ts

Add your book to the books array using the chapters:

```typescript
import { yourBookChapters } from './your-book';

export const books: Book[] = [
  // ... existing books
  {
    id: 'your-book',
    title: 'Your Book',
    author: 'Author Name',
    chapters: yourBookChapters, // Use chapters instead of text
  },
];
```

## Chapter Detection

The extraction function looks for these patterns:
- `Chapter 1`, `Chapter 2`, etc.
- `CHAPTER I`, `CHAPTER II` (Roman numerals)
- `Chapter One`, `Chapter Two` (written numbers)
- With or without colons/periods: `Chapter 1:`, `Chapter 1.`

## Manual Adjustment

If the automatic extraction doesn't work perfectly:
1. Review the extracted chapters in the console
2. Manually adjust the chapter boundaries in your book file
3. Ensure each chapter has a `title` and `text` field

## Legacy Support

Books without chapters (using the `text` field) will still work, but won't show chapter-specific page counts. The app automatically handles both formats.

