/**
 * Command Registry
 * Defines static navigation, action, and help commands for the command palette
 */

import {
    HomeIcon,
    DocumentDuplicateIcon,
    ShieldCheckIcon,
    ServerIcon,
    BellIcon,
    MagnifyingGlassIcon,
    PlusIcon,
    QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';
import { CommandItem } from '@/lib/core/entity/command-palette';
import { buildDIDSearchUrl, buildRSESearchUrl, buildRuleDetailUrl, detectSearchType } from '@/lib/infrastructure/utils/navigation';

/**
 * Get static navigation commands
 * These provide quick access to main app sections
 */
export function getNavigationCommands(): CommandItem[] {
    return [
        {
            id: 'nav-dashboard',
            type: 'navigation',
            title: 'Dashboard',
            description: 'View your dashboard',
            icon: HomeIcon,
            url: '/dashboard',
            keywords: ['dashboard', 'home', 'overview'],
        },
        {
            id: 'nav-dids',
            type: 'navigation',
            title: 'DIDs',
            description: 'Browse Data Identifiers',
            icon: DocumentDuplicateIcon,
            url: '/did/list',
            keywords: ['did', 'data', 'identifier', 'dataset', 'file', 'container'],
        },
        {
            id: 'nav-rules',
            type: 'navigation',
            title: 'Rules',
            description: 'Browse replication rules',
            icon: ShieldCheckIcon,
            url: '/rule/list',
            keywords: ['rule', 'replication', 'policy'],
        },
        {
            id: 'nav-rses',
            type: 'navigation',
            title: 'RSEs',
            description: 'Browse Rucio Storage Elements',
            icon: ServerIcon,
            url: '/rse/list',
            keywords: ['rse', 'storage', 'element', 'endpoint'],
        },
        {
            id: 'nav-subscriptions',
            type: 'navigation',
            title: 'Subscriptions',
            description: 'Browse data subscriptions',
            icon: BellIcon,
            url: '/subscription/list',
            keywords: ['subscription', 'subscribe', 'data'],
        },
    ];
}

/**
 * Get action commands
 * These are contextual actions that may adapt based on search query
 */
export function getActionCommands(searchQuery: string = ''): CommandItem[] {
    const actions: CommandItem[] = [];

    const searchType = detectSearchType(searchQuery);

    // Smart search actions based on query
    if (searchQuery && searchQuery.length > 0) {
        if (searchType === 'did' || searchType === 'generic') {
            actions.push({
                id: 'action-search-dids',
                type: 'action',
                title: `Search DIDs for "${searchQuery}"`,
                description: 'Search Data Identifiers',
                icon: MagnifyingGlassIcon,
                url: buildDIDSearchUrl({ pattern: searchQuery }),
                keywords: ['search', 'did', 'find'],
            });
        }

        if (searchType === 'rse' || searchType === 'generic') {
            actions.push({
                id: 'action-search-rses',
                type: 'action',
                title: `Search RSEs for "${searchQuery}"`,
                description: 'Search Rucio Storage Elements',
                icon: MagnifyingGlassIcon,
                url: buildRSESearchUrl(searchQuery),
                keywords: ['search', 'rse', 'find'],
            });
        }

        if (searchType === 'rule') {
            actions.push({
                id: 'action-goto-rule',
                type: 'action',
                title: `Go to Rule "${searchQuery}"`,
                description: 'Navigate to rule details',
                icon: ShieldCheckIcon,
                url: buildRuleDetailUrl(searchQuery),
                keywords: ['rule', 'goto', 'view'],
            });
        }
    } else {
        // Default actions when no search query
        actions.push(
            {
                id: 'action-search-dids-generic',
                type: 'action',
                title: 'Search DIDs',
                description: 'Search for Data Identifiers',
                icon: MagnifyingGlassIcon,
                url: '/did/list',
                keywords: ['search', 'did', 'find'],
            },
            {
                id: 'action-search-rses-generic',
                type: 'action',
                title: 'Search RSEs',
                description: 'Search for Rucio Storage Elements',
                icon: MagnifyingGlassIcon,
                url: '/rse/list',
                keywords: ['search', 'rse', 'find'],
            },
        );
    }

    // Always show create rule action
    actions.push({
        id: 'action-create-rule',
        type: 'action',
        title: 'Create Rule',
        description: 'Create a new replication rule',
        icon: PlusIcon,
        url: '/rule/create',
        keywords: ['create', 'new', 'rule', 'replicate'],
    });

    return actions;
}

/**
 * Get help commands
 * These provide links to external documentation and resources
 */
export function getHelpCommands(): CommandItem[] {
    return [
        {
            id: 'help-user-guide',
            type: 'help',
            title: 'Rucio User Guide',
            description: 'Official Rucio documentation',
            icon: QuestionMarkCircleIcon,
            url: 'https://rucio.cern.ch/documentation/',
            badge: 'External',
            keywords: ['help', 'docs', 'documentation', 'guide', 'manual'],
            onSelect: () => {
                window.open('https://rucio.cern.ch/documentation/', '_blank', 'noopener,noreferrer');
            },
        },
    ];
}
