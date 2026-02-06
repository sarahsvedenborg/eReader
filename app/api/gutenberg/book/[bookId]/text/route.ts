import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://project-gutenberg-free-books-api1.p.rapidapi.com';
const API_KEY = process.env.NEXT_PUBLIC_GUTENBERG_API_KEY || '';

export async function GET(
  request: NextRequest,
  { params }: { params: { bookId: string } }
) {
  const bookId = params.bookId;
  const searchParams = request.nextUrl.searchParams;
  const cleaningMode = searchParams.get('cleaning_mode') || 'simple';

  if (!bookId) {
    return NextResponse.json(
      { error: 'Book ID is required' },
      { status: 400 }
    );
  }

  if (!API_KEY) {
    return NextResponse.json(
      { error: 'Gutenberg API key not configured. Please set NEXT_PUBLIC_GUTENBERG_API_KEY environment variable.' },
      { status: 500 }
    );
  }

  try {
    const url = new URL(`${API_BASE_URL}/books/${bookId}/text`);
    url.searchParams.set('cleaning_mode', cleaningMode);

    console.log('Fetching book text from:', url.toString());
    console.log('Book ID:', bookId);

    const response = await fetch(url.toString(), {
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'project-gutenberg-free-books-api1.p.rapidapi.com',
      },
    });

    console.log('Book text response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Failed to fetch book text: ${response.statusText}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      console.error('Gutenberg API error:', response.status, errorText);
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching book text from Gutenberg API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch book text' },
      { status: 500 }
    );
  }
}

