import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  if (request.headers.get('x-forwarded-proto') === 'http') {
    const url = request.nextUrl.clone()
    url.protocol = 'https:'
    return NextResponse.redirect(url, 301)
  }
}
