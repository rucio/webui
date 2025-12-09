/**
 * Local storage utility for HotBar bookmarks
 * Manages CRUD operations for up to 9 bookmark cards
 */

import { HotBarCard, HotBarCardType, CreateHotBarCard, UpdateHotBarCard } from '@/lib/core/entity/hotbar';

const STORAGE_KEY = 'rucio_hotbar_cards';
const MAX_CARDS = 9;

/**
 * Infer card type from URL path
 */
export function inferCardType(url: string): HotBarCardType {
    try {
        const urlObj = new URL(url, window.location.origin);
        const pathname = urlObj.pathname;

        if (pathname.includes('/did/list')) return HotBarCardType.DID_LIST;
        if (pathname.includes('/did/page/')) return HotBarCardType.DID;
        if (pathname.includes('/rule/list')) return HotBarCardType.RULE_LIST;
        if (pathname.includes('/rule/page/')) return HotBarCardType.RULE;
        if (pathname.includes('/rse/list')) return HotBarCardType.RSE_LIST;
        if (pathname.includes('/rse/page/')) return HotBarCardType.RSE;

        // Default fallback
        return HotBarCardType.DID;
    } catch {
        return HotBarCardType.DID;
    }
}

/**
 * Validate that URL is same-host
 */
export function isSameHost(url: string): boolean {
    try {
        const urlObj = new URL(url, window.location.origin);
        return urlObj.hostname === window.location.hostname;
    } catch {
        return false;
    }
}

/**
 * Generate a simple UUID v4
 */
function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

/**
 * Get all cards from local storage
 */
export function getCards(): HotBarCard[] {
    if (typeof window === 'undefined') return [];

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];

        const cards = JSON.parse(stored) as HotBarCard[];
        return Array.isArray(cards) ? cards : [];
    } catch (error) {
        console.error('Error reading HotBar cards from storage:', error);
        return [];
    }
}

/**
 * Save cards to local storage
 */
function saveCards(cards: HotBarCard[]): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    } catch (error) {
        console.error('Error saving HotBar cards to storage:', error);
        throw new Error('Failed to save bookmarks');
    }
}

/**
 * Add a new card
 * @throws Error if max cards reached or URL validation fails
 */
export function addCard(data: CreateHotBarCard): HotBarCard {
    const cards = getCards();

    // Validate max cards
    if (cards.length >= MAX_CARDS) {
        throw new Error(`Maximum ${MAX_CARDS} bookmarks allowed`);
    }

    // Validate URL is same host
    if (!isSameHost(data.url)) {
        throw new Error('URL must be from the same host');
    }

    // Create new card
    const now = new Date().toISOString();
    const newCard: HotBarCard = {
        id: generateUUID(),
        title: data.title.trim(),
        description: data.description?.trim(),
        url: data.url,
        type: inferCardType(data.url),
        created_at: now,
        updated_at: now,
    };

    // Save
    const updatedCards = [...cards, newCard];
    saveCards(updatedCards);

    return newCard;
}

/**
 * Update an existing card
 * @throws Error if card not found or URL validation fails
 */
export function updateCard(id: string, data: UpdateHotBarCard): HotBarCard {
    const cards = getCards();
    const index = cards.findIndex(c => c.id === id);

    if (index === -1) {
        throw new Error('Bookmark not found');
    }

    const existingCard = cards[index];

    // Validate URL if being updated
    if (data.url && !isSameHost(data.url)) {
        throw new Error('URL must be from the same host');
    }

    // Update card
    const updatedCard: HotBarCard = {
        ...existingCard,
        title: data.title?.trim() ?? existingCard.title,
        description: data.description?.trim() ?? existingCard.description,
        url: data.url ?? existingCard.url,
        type: data.url ? inferCardType(data.url) : existingCard.type,
        updated_at: new Date().toISOString(),
    };

    // Save
    cards[index] = updatedCard;
    saveCards(cards);

    return updatedCard;
}

/**
 * Delete a card
 * @throws Error if card not found
 */
export function deleteCard(id: string): void {
    const cards = getCards();
    const filtered = cards.filter(c => c.id !== id);

    if (filtered.length === cards.length) {
        throw new Error('Bookmark not found');
    }

    saveCards(filtered);
}

/**
 * Get a single card by ID
 */
export function getCard(id: string): HotBarCard | null {
    const cards = getCards();
    return cards.find(c => c.id === id) || null;
}

/**
 * Check if max cards limit is reached
 */
export function isMaxCardsReached(): boolean {
    return getCards().length >= MAX_CARDS;
}

/**
 * Get current card count
 */
export function getCardCount(): number {
    return getCards().length;
}
