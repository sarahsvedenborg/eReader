# eReader - Mobile-First Reading App

A Kindle-like reading experience built with Next.js and React, with access to 76,000+ free books from Project Gutenberg.

## Features

- Mobile-first design optimized for phones
- Clean, distraction-free UI
- Text pagination (no scrolling)
- Tap navigation (left/right sides of screen)
- Reading progress persistence (localStorage)
- Serif font for comfortable reading
- **Search and read from Project Gutenberg** - Access 76,000+ free books via API
- Chapter extraction and organization
- Chapter-based reading with progress tracking

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Gutenberg API (Optional but Recommended)

To search and read books from Project Gutenberg:

1. Get your API key from [gutenbergapi.com](https://gutenbergapi.com)
2. Create a `.env.local` file in the root directory:
   ```bash
   NEXT_PUBLIC_GUTENBERG_API_KEY=your_api_key_here
   ```
3. Restart your development server

### 3. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### Reading Books

The app splits raw text into readable "pages" containing a fixed number of words. Each page is displayed one at a time, with tap navigation to move between pages. Your reading progress is automatically saved to localStorage.

### Project Gutenberg Integration

- **Search**: Click "Search Project Gutenberg" on the homepage to search from 76,000+ free books
- **Read**: Select any book from search results to start reading immediately
- **Chapters**: Books are automatically organized into chapters for better navigation
- **Progress**: Your reading progress is saved per book

### Local Books

You can still add books manually by:
1. Adding book text to `data/` directory
2. Using the "Extract Chapters" tool to organize chapters
3. Adding the book to `data/books.ts`

## Project Structure

- `app/` - Next.js App Router pages
- `components/` - React components (Reader, etc.)
- `lib/` - Utility functions (pagination, chapter extraction, API)
- `data/` - Local book data files

