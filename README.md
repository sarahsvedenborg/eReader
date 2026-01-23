# eReader - Mobile-First Reading App

A Kindle-like reading experience built with Next.js and React.

## Features

- Mobile-first design optimized for phones
- Clean, distraction-free UI
- Text pagination (no scrolling)
- Tap navigation (left/right sides of screen)
- Reading progress persistence (localStorage)
- Serif font for comfortable reading

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

The app splits raw text into readable "pages" containing a fixed number of words. Each page is displayed one at a time, with tap navigation to move between pages. Your reading progress is automatically saved to localStorage.

