'use client';

import React from 'react';
import { HotBarCard as HotBarCardType, HotBarCardType as CardTypeEnum } from '@/lib/core/entity/hotbar';
import { PencilIcon, TrashIcon, ShareIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface HotBarCardProps {
    card: HotBarCardType;
    onEdit: (card: HotBarCardType) => void;
    onDelete: (id: string) => void;
    onCopyLink: (url: string) => void;
}

/**
 * Get badge color based on card type (semantic colors from design system)
 */
function getTypeBadgeStyles(type: CardTypeEnum): string {
    switch (type) {
        case CardTypeEnum.DID:
        case CardTypeEnum.DID_LIST:
            return 'bg-base-info-100 text-base-info-900 dark:bg-base-info-900/20 dark:text-base-info-100';
        case CardTypeEnum.RULE:
        case CardTypeEnum.RULE_LIST:
            return 'bg-base-success-100 text-base-success-900 dark:bg-base-success-900/20 dark:text-base-success-100';
        case CardTypeEnum.RSE:
        case CardTypeEnum.RSE_LIST:
            return 'bg-base-warning-100 text-base-warning-900 dark:bg-base-warning-900/20 dark:text-base-warning-100';
        default:
            return 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';
    }
}

/**
 * Format card type for display
 */
function formatCardType(type: CardTypeEnum): string {
    return type.replace(/_/g, ' ');
}

/**
 * Format timestamp for display
 */
function formatTimestamp(isoString: string): string {
    try {
        const date = new Date(isoString);
        return date.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    } catch {
        return '';
    }
}

export const HotBarCard: React.FC<HotBarCardProps> = ({ card, onEdit, onDelete, onCopyLink }) => {
    const router = useRouter();

    const handleCardClick = () => {
        router.push(card.url);
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(card);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(card.id);
    };

    const handleCopyLink = (e: React.MouseEvent) => {
        e.stopPropagation();
        const fullUrl = `${window.location.origin}${card.url}`;
        onCopyLink(fullUrl);
    };

    return (
        <div
            onClick={handleCardClick}
            className="
                relative
                bg-neutral-100 dark:bg-neutral-800
                border border-neutral-200 dark:border-neutral-700
                rounded-lg
                p-4
                shadow-sm hover:shadow-md
                transition-all duration-150
                cursor-pointer
                hover:bg-neutral-200 dark:hover:bg-neutral-700
                focus-within:ring-2 focus-within:ring-brand-500
                group
            "
            role="button"
            tabIndex={0}
            onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick();
                }
            }}
        >
            {/* Action buttons */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <button
                    onClick={handleCopyLink}
                    className="
                        p-1.5
                        bg-neutral-0 dark:bg-neutral-900
                        border border-neutral-200 dark:border-neutral-700
                        rounded
                        hover:bg-base-info-50 dark:hover:bg-base-info-900/20
                        hover:border-base-info-500
                        focus:outline-none focus:ring-2 focus:ring-base-info-500
                        transition-colors duration-150
                    "
                    aria-label="Copy link to clipboard"
                >
                    <ShareIcon className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                </button>
                <button
                    onClick={handleEdit}
                    className="
                        p-1.5
                        bg-neutral-0 dark:bg-neutral-900
                        border border-neutral-200 dark:border-neutral-700
                        rounded
                        hover:bg-brand-50 dark:hover:bg-brand-900/20
                        hover:border-brand-500
                        focus:outline-none focus:ring-2 focus:ring-brand-500
                        transition-colors duration-150
                    "
                    aria-label="Edit bookmark"
                >
                    <PencilIcon className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                </button>
                <button
                    onClick={handleDelete}
                    className="
                        p-1.5
                        bg-neutral-0 dark:bg-neutral-900
                        border border-neutral-200 dark:border-neutral-700
                        rounded
                        hover:bg-base-error-50 dark:hover:bg-base-error-900/20
                        hover:border-base-error-500
                        focus:outline-none focus:ring-2 focus:ring-base-error-500
                        transition-colors duration-150
                    "
                    aria-label="Delete bookmark"
                >
                    <TrashIcon className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                </button>
            </div>

            {/* Type badge */}
            <div className="mb-3">
                <span
                    className={`
                    inline-block
                    px-2 py-1
                    rounded
                    text-xs font-medium
                    ${getTypeBadgeStyles(card.type)}
                `}
                >
                    {formatCardType(card.type)}
                </span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2 pr-16">{card.title}</h3>

            {/* Description (if present) */}
            {card.description && <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">{card.description}</p>}

            {/* Footer with timestamps */}
            <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-500 mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-700">
                <span>Created: {formatTimestamp(card.created_at)}</span>
                {card.created_at !== card.updated_at && <span>Updated: {formatTimestamp(card.updated_at)}</span>}
            </div>
        </div>
    );
};
