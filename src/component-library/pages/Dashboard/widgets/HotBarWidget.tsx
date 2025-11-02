'use client';

import React, { useState, useEffect } from 'react';
import { KeyValueWrapper } from '@/component-library/features/key-value/KeyValueWrapper';
import { Heading } from '@/component-library/atoms/misc/Heading';
import { Button } from '@/component-library/atoms/form/button';
import { PlusIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { HotBarCard as HotBarCardComponent } from './HotBarCard';
import { AddEditCardDialog } from './AddEditCardDialog';
import { useToast } from '@/lib/infrastructure/hooks/useToast';
import { getCards, addCard, updateCard, deleteCard, isMaxCardsReached, getCardCount } from '@/lib/utils/hotbar-storage';
import { HotBarCard } from '@/lib/core/entity/hotbar';

const MAX_CARDS = 9;

export const HotBarWidget: React.FC = () => {
    const [cards, setCards] = useState<HotBarCard[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingCard, setEditingCard] = useState<HotBarCard | null>(null);
    const [isClient, setIsClient] = useState(false);
    const { toast } = useToast();

    // Load cards from storage
    useEffect(() => {
        setIsClient(true);
        loadCards();
    }, []);

    const loadCards = () => {
        const storedCards = getCards();
        setCards(storedCards);
    };

    const handleAddClick = () => {
        if (isMaxCardsReached()) {
            toast({
                variant: 'error',
                title: 'Maximum bookmarks reached',
                description: `You can only save up to ${MAX_CARDS} bookmarks. Please delete one to add more.`,
            });
            return;
        }
        setEditingCard(null);
        setDialogOpen(true);
    };

    const handleEditClick = (card: HotBarCard) => {
        setEditingCard(card);
        setDialogOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        try {
            deleteCard(id);
            loadCards();
            toast({
                variant: 'success',
                title: 'Bookmark deleted',
                description: 'Your bookmark has been removed.',
            });
        } catch (error) {
            toast({
                variant: 'error',
                title: 'Delete failed',
                description: error instanceof Error ? error.message : 'Failed to delete bookmark',
            });
        }
    };

    const handleSave = (data: { title: string; description?: string; url: string }) => {
        try {
            if (editingCard) {
                // Update existing card
                updateCard(editingCard.id, data);
                toast({
                    variant: 'success',
                    title: 'Bookmark updated',
                    description: 'Your changes have been saved.',
                });
            } else {
                // Add new card
                addCard(data);
                toast({
                    variant: 'success',
                    title: 'Bookmark added',
                    description: 'Your bookmark has been saved.',
                });
            }
            loadCards();
        } catch (error) {
            toast({
                variant: 'error',
                title: editingCard ? 'Update failed' : 'Add failed',
                description: error instanceof Error ? error.message : 'An error occurred',
            });
        }
    };

    const handleCopyLink = async (url: string) => {
        try {
            await navigator.clipboard.writeText(url);
            toast({
                variant: 'success',
                title: 'Link copied',
                description: 'The bookmark link has been copied to your clipboard.',
            });
        } catch {
            toast({
                variant: 'error',
                title: 'Copy failed',
                description: 'Failed to copy link to clipboard. Please try again.',
            });
        }
    };

    // Don't render until client-side to avoid hydration mismatch
    if (!isClient) {
        return (
            <KeyValueWrapper className="w-full p-5">
                <div className="flex items-center justify-between mb-6">
                    <Heading text="HotBar" size="md" />
                </div>
                <div className="flex items-center justify-center py-12">
                    <p className="text-neutral-500 dark:text-neutral-500">Loading...</p>
                </div>
            </KeyValueWrapper>
        );
    }

    const cardCount = getCardCount();
    const maxReached = isMaxCardsReached();

    return (
        <>
            <KeyValueWrapper className="w-full p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <Heading text="HotBar" size="md" />
                    <Button variant="default" onClick={handleAddClick} disabled={maxReached} className="flex items-center gap-2">
                        <PlusIcon className="w-4 h-4" />
                        Add Card ({cardCount}/{MAX_CARDS})
                    </Button>
                </div>

                {/* Empty State */}
                {cards.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4">
                        <BookmarkIcon className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mb-4" />
                        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">No bookmarks yet</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center mb-6 max-w-md">
                            Add your frequently accessed pages for quick navigation. You can save up to {MAX_CARDS} bookmarks.
                        </p>
                        <Button variant="default" onClick={handleAddClick} className="flex items-center gap-2">
                            <PlusIcon className="w-4 h-4" />
                            Add Your First Bookmark
                        </Button>
                    </div>
                ) : (
                    /* Cards Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {cards.map(card => (
                            <HotBarCardComponent
                                key={card.id}
                                card={card}
                                onEdit={handleEditClick}
                                onDelete={handleDeleteClick}
                                onCopyLink={handleCopyLink}
                            />
                        ))}
                    </div>
                )}
            </KeyValueWrapper>

            {/* Add/Edit Dialog */}
            <AddEditCardDialog open={dialogOpen} onOpenChange={setDialogOpen} card={editingCard} onSave={handleSave} />
        </>
    );
};
