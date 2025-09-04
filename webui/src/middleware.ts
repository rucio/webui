import { type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // This empty middleware prevents Next.js from looking up the directory tree
  return;
}

export const config = {
  matcher: [],
};