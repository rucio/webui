/**
 * Font Configuration
 *
 * Next.js font optimization for Inter (UI) and JetBrains Mono (code).
 * These fonts are part of the Rucio WebUI design system.
 */

import { Inter, JetBrains_Mono } from 'next/font/google';

/**
 * Inter - Primary UI Font
 * Modern, highly legible sans-serif optimized for screen reading.
 * Used for all UI text, headings, and body content.
 */
export const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
    weight: ['400', '500', '600', '700', '800'],
});

/**
 * JetBrains Mono - Code Font
 * Monospace font designed for developers.
 * Used for code blocks, technical content, and data display.
 */
export const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-jetbrains-mono',
    weight: ['400', '500', '600', '700'],
});
