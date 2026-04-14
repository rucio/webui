import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { TipBadge } from './TipBadge';
import { TipCard } from './TipCard';
import { TipPopover } from './TipPopover';
import { TipsPanel } from './TipsPanel';
import { Tip, TipCategory } from '@/lib/infrastructure/tips/tip-registry';
import { getAllTips } from '@/lib/infrastructure/tips/tips-data';

// Sample tips for stories
const sampleTip: Tip = {
    id: 'sample-tip',
    title: 'Sample Tip',
    content: 'This is a sample tip content that explains a feature or provides helpful guidance to users.',
    category: TipCategory.GETTING_STARTED,
    priority: 'essential',
    variant: 'info',
    learnMoreUrl: 'https://rucio.readthedocs.io/',
};

const sampleTipSuccess: Tip = {
    id: 'sample-tip-success',
    title: 'Great Progress!',
    content: 'You have successfully completed the onboarding. Check out more features in the tips panel.',
    category: TipCategory.GETTING_STARTED,
    priority: 'helpful',
    variant: 'success',
};

const sampleTipWarning: Tip = {
    id: 'sample-tip-warning',
    title: 'Important Notice',
    content: 'Rules with expiration dates will automatically delete associated replicas when they expire.',
    category: TipCategory.RULES,
    priority: 'essential',
    variant: 'warning',
    learnMoreUrl: 'https://rucio.readthedocs.io/',
};

// ========================================
// TipBadge Stories
// ========================================

const badgeMeta: Meta<typeof TipBadge> = {
    title: 'Features/Tips/TipBadge',
    component: TipBadge,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
        variant: {
            control: 'select',
            options: ['default', 'subtle', 'highlighted', 'pulse'],
        },
    },
};

export default badgeMeta;
type BadgeStory = StoryObj<typeof TipBadge>;

export const Default: BadgeStory = {
    args: {
        tipId: 'sample-tip',
    },
};

export const Sizes: BadgeStory = {
    render: () => (
        <div className="flex items-center gap-4">
            <TipBadge size="sm" tipId="small" />
            <TipBadge size="md" tipId="medium" />
            <TipBadge size="lg" tipId="large" />
        </div>
    ),
};

export const Variants: BadgeStory = {
    render: () => (
        <div className="flex items-center gap-4">
            <TipBadge variant="default" tipId="default" />
            <TipBadge variant="subtle" tipId="subtle" />
            <TipBadge variant="highlighted" tipId="highlighted" />
            <TipBadge variant="pulse" tipId="pulse" />
        </div>
    ),
};

export const WithLightbulb: BadgeStory = {
    args: {
        tipId: 'sample-tip',
        useLightbulb: true,
    },
};

// ========================================
// TipCard Stories
// ========================================

const cardMeta: Meta<typeof TipCard> = {
    title: 'Features/Tips/TipCard',
    component: TipCard,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

type CardStory = StoryObj<typeof TipCard>;

export const InfoCard: CardStory = {
    render: () => (
        <div className="w-80">
            <TipCard tip={sampleTip} onDismiss={() => console.log('Dismissed')} />
        </div>
    ),
};

export const SuccessCard: CardStory = {
    render: () => (
        <div className="w-80">
            <TipCard tip={sampleTipSuccess} onDismiss={() => console.log('Dismissed')} />
        </div>
    ),
};

export const WarningCard: CardStory = {
    render: () => (
        <div className="w-80">
            <TipCard tip={sampleTipWarning} onDismiss={() => console.log('Dismissed')} />
        </div>
    ),
};

export const CompactCard: CardStory = {
    render: () => (
        <div className="w-80">
            <TipCard tip={sampleTip} compact onDismiss={() => console.log('Dismissed')} />
        </div>
    ),
};

export const WithoutDismiss: CardStory = {
    render: () => (
        <div className="w-80">
            <TipCard tip={sampleTip} showDismissButton={false} />
        </div>
    ),
};

export const DismissedState: CardStory = {
    render: () => (
        <div className="w-80">
            <TipCard tip={sampleTip} isDismissed showDismissButton={false} />
        </div>
    ),
};

export const AllVariants: CardStory = {
    render: () => (
        <div className="flex flex-col gap-4 w-80">
            <TipCard tip={sampleTip} onDismiss={() => {}} />
            <TipCard tip={sampleTipSuccess} onDismiss={() => {}} />
            <TipCard tip={sampleTipWarning} onDismiss={() => {}} />
        </div>
    ),
};

// ========================================
// TipPopover Stories
// ========================================

const popoverMeta: Meta<typeof TipPopover> = {
    title: 'Features/Tips/TipPopover',
    component: TipPopover,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

type PopoverStory = StoryObj<typeof TipPopover>;

export const PopoverDefault: PopoverStory = {
    render: () => <TipPopover tip={sampleTip} onDismiss={() => console.log('Dismissed')} />,
};

export const PopoverPositions: PopoverStory = {
    render: () => (
        <div className="flex items-center gap-8 p-20">
            <TipPopover tip={sampleTip} side="top" onDismiss={() => {}} />
            <TipPopover tip={sampleTip} side="right" onDismiss={() => {}} />
            <TipPopover tip={sampleTip} side="bottom" onDismiss={() => {}} />
            <TipPopover tip={sampleTip} side="left" onDismiss={() => {}} />
        </div>
    ),
};

export const PopoverWithWarning: PopoverStory = {
    render: () => <TipPopover tip={sampleTipWarning} onDismiss={() => console.log('Dismissed')} />,
};

// ========================================
// TipsPanel Stories
// ========================================

const panelMeta: Meta<typeof TipsPanel> = {
    title: 'Features/Tips/TipsPanel',
    component: TipsPanel,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

type PanelStory = StoryObj<typeof TipsPanel>;

const TipsPanelDemo = () => {
    const [open, setOpen] = useState(true);
    const [dismissedTips, setDismissedTips] = useState<Set<string>>(new Set());
    const allTips = getAllTips();

    const handleDismiss = (tipId: string) => {
        setDismissedTips(prev => {
            const next = new Set(prev);
            next.add(tipId);
            return next;
        });
    };

    const handleReset = () => {
        setDismissedTips(new Set());
    };

    return (
        <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 p-8">
            <button onClick={() => setOpen(true)} className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600">
                Open Tips Panel
            </button>
            <TipsPanel
                open={open}
                onOpenChange={setOpen}
                tips={allTips}
                dismissedTips={dismissedTips}
                onDismissTip={handleDismiss}
                onResetAllTips={handleReset}
            />
        </div>
    );
};

export const Panel: PanelStory = {
    render: () => <TipsPanelDemo />,
};

const TipsPanelWithSomeDismissed = () => {
    const [open, setOpen] = useState(true);
    const allTips = getAllTips();
    const [dismissedTips, setDismissedTips] = useState<Set<string>>(new Set(allTips.slice(0, 5).map(t => t.id)));

    const handleDismiss = (tipId: string) => {
        setDismissedTips(prev => {
            const next = new Set(prev);
            next.add(tipId);
            return next;
        });
    };

    const handleReset = () => {
        setDismissedTips(new Set());
    };

    return (
        <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 p-8">
            <button onClick={() => setOpen(true)} className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600">
                Open Tips Panel (5 dismissed)
            </button>
            <TipsPanel
                open={open}
                onOpenChange={setOpen}
                tips={allTips}
                dismissedTips={dismissedTips}
                onDismissTip={handleDismiss}
                onResetAllTips={handleReset}
            />
        </div>
    );
};

export const PanelWithDismissed: PanelStory = {
    render: () => <TipsPanelWithSomeDismissed />,
};

// ========================================
// Integration Example
// ========================================

const IntegrationExample = () => {
    const [dismissedTips, setDismissedTips] = useState<Set<string>>(new Set());

    const handleDismiss = (tipId: string) => {
        setDismissedTips(prev => {
            const next = new Set(prev);
            next.add(tipId);
            return next;
        });
    };

    return (
        <div className="p-8 space-y-8">
            <h2 className="text-xl font-semibold">Contextual Tips Example</h2>
            <p className="text-neutral-600 dark:text-neutral-400">Click the help icons below to see contextual tips:</p>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                    <span>Search DIDs</span>
                    <TipPopover tip={sampleTip} isDismissed={dismissedTips.has(sampleTip.id)} onDismiss={() => handleDismiss(sampleTip.id)} />
                </div>

                <div className="flex items-center gap-2 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                    <span>Rule Lifetime</span>
                    <TipPopover
                        tip={sampleTipWarning}
                        isDismissed={dismissedTips.has(sampleTipWarning.id)}
                        onDismiss={() => handleDismiss(sampleTipWarning.id)}
                    />
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Standalone Cards</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <TipCard tip={sampleTip} onDismiss={() => handleDismiss(sampleTip.id)} />
                    <TipCard tip={sampleTipSuccess} onDismiss={() => handleDismiss(sampleTipSuccess.id)} />
                    <TipCard tip={sampleTipWarning} onDismiss={() => handleDismiss(sampleTipWarning.id)} />
                </div>
            </div>
        </div>
    );
};

export const Integration: PanelStory = {
    render: () => <IntegrationExample />,
};
