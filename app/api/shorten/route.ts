import { NextRequest, NextResponse } from 'next/server';
import { db, urls, insertUrlSchema } from '@/lib/db';
import { generateShortCode, formatUrl, isValidUrl } from '@/lib/url-utils';
import { eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url: originalUrl, customCode, title, description } = body;

    if (!originalUrl) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    const formattedUrl = formatUrl(originalUrl);
    
    if (!isValidUrl(formattedUrl)) {
      return NextResponse.json(
        { error: 'Please enter a valid URL' },
        { status: 400 }
      );
    }

    // Check if URL already exists
    const existingUrl = await db.select().from(urls).where(eq(urls.originalUrl, formattedUrl)).limit(1);
    if (existingUrl.length > 0) {
      return NextResponse.json({
        shortCode: existingUrl[0].shortCode,
        shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://zmol.vercel.app'}/${existingUrl[0].shortCode}`,
        existing: true
      });
    }

    // Generate short code
    let shortCode = customCode || generateShortCode();
    
    // Validate custom code
    if (customCode) {
      const customCodeRegex = /^[a-zA-Z0-9-]+$/;
      if (!customCodeRegex.test(customCode) || customCode.length < 3 || customCode.length > 20) {
        return NextResponse.json(
          { error: 'Custom code must be 3-20 characters long and contain only letters, numbers, and hyphens' },
          { status: 400 }
        );
      }

      // Check if custom code already exists
      const existingCode = await db.select().from(urls).where(eq(urls.shortCode, customCode)).limit(1);
      if (existingCode.length > 0) {
        return NextResponse.json(
          { error: 'Custom code already exists' },
          { status: 409 }
        );
      }
    } else {
      // Ensure generated code is unique
      let attempts = 0;
      while (attempts < 10) {
        const existing = await db.select().from(urls).where(eq(urls.shortCode, shortCode)).limit(1);
        if (existing.length === 0) break;
        shortCode = generateShortCode();
        attempts++;
      }
      
      if (attempts >= 10) {
        return NextResponse.json(
          { error: 'Failed to generate unique short code' },
          { status: 500 }
        );
      }
    }

    // Get client IP for analytics (optional)
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    // Insert new URL
    const newUrl = {
      originalUrl: formattedUrl,
      shortCode,
      title: title || null,
      description: description || null,
      createdBy: clientIp, // Use IP as anonymous identifier
    };

    const validatedUrl = insertUrlSchema.parse(newUrl);
    await db.insert(urls).values(validatedUrl);

    // Revalidate cache
    revalidateTag(CACHE_TAGS.RECENT);
    revalidateTag(CACHE_TAGS.STATS);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zmol.vercel.app';
    
    return NextResponse.json({
      shortCode,
      shortUrl: `${baseUrl}/${shortCode}`,
      existing: false
    });

  } catch (error) {
    console.error('Error creating short URL:', error);
    return NextResponse.json(
      { error: 'Failed to create short URL' },
      { status: 500 }
    );
  }
}
