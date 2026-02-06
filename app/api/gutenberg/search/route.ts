import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://project-gutenberg-free-books-api1.p.rapidapi.com';
const API_KEY = process.env.NEXT_PUBLIC_GUTENBERG_API_KEY || '';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const pageSize = searchParams.get('page_size') || '20';

    if (!query) {
        return NextResponse.json(
            { error: 'Query parameter is required' },
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
        const url = new URL(`${API_BASE_URL}/books`);
        url.searchParams.set('q', query);
        url.searchParams.set('page_size', pageSize);

        console.log('Fetching from:', url.toString());
        console.log('API Key present:', !!API_KEY);

        const response = await fetch(url.toString(), {
            headers: {
                'X-RapidAPI-Key': API_KEY,
                'X-RapidAPI-Host': 'project-gutenberg-free-books-api1.p.rapidapi.com',
            },
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = `Failed to search books: ${response.statusText}`;
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.message || errorMessage;
            } catch {
                // If not JSON, use the text as-is
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
        console.error('Error fetching from Gutenberg API:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to search books' },
            { status: 500 }
        );
    }
}

