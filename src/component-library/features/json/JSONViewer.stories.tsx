import type { Meta, StoryObj } from '@storybook/nextjs';
import { JSONViewer } from './JSONViewer';

const meta: Meta<typeof JSONViewer> = {
    title: 'Features/JSON/JSONViewer',
    component: JSONViewer,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    decorators: [
        Story => (
            <div className="w-[800px]">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof JSONViewer>;

// Sample JSON data
const simpleJSON = JSON.stringify({ name: 'John Doe', age: 30, active: true });

const nestedJSON = JSON.stringify({
    user: {
        id: 12345,
        name: 'John Doe',
        email: 'john@example.com',
        preferences: {
            theme: 'dark',
            notifications: true,
            language: 'en',
        },
    },
    metadata: {
        created: '2024-01-15T10:30:00Z',
        updated: '2024-01-20T14:45:00Z',
    },
});

const subscriptionFilter = JSON.stringify({
    scope: ['data15_13TeV', 'data15_14TeV'],
    account: ['root'],
    datatype: 'AOD',
    excluded_pattern: 'calibration',
    asynchronous: false,
});

const replicationRules = JSON.stringify([
    {
        copies: 1,
        rse_expression: 'tier=1&disk=1',
        weight: null,
        lifetime: 604800,
        locked: false,
        subscription_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        source_replica_expression: null,
        activity: 'User Subscriptions',
        notify: 'N',
    },
    {
        copies: 2,
        rse_expression: 'cloud=US',
        weight: null,
        lifetime: null,
        locked: true,
        subscription_id: 'a67bc20c-69dd-5483-b678-1f13c3d4e580',
        source_replica_expression: 'tier=0',
        activity: 'Data Brokering',
        notify: 'Y',
    },
]);

const arrayJSON = JSON.stringify(['apple', 'banana', 'cherry', 'date', 'elderberry']);

const largeJSON = JSON.stringify({
    dataset: {
        name: 'data15_13TeV.00276262.physics_Main.merge.AOD.r7562_p2521',
        scope: 'data15_13TeV',
        type: 'DATASET',
        bytes: 3487234987,
        length: 1543,
        did_type: 'DATASET',
        is_open: false,
        monotonic: false,
        obsolete: false,
        hidden: false,
        suppressed: false,
        purge_replicas: true,
        metadata: {
            project: 'data15_13TeV',
            run_number: 276262,
            stream_name: 'physics_Main',
            prod_step: 'merge',
            datatype: 'AOD',
            provenance: 'merge',
        },
        rules: [
            { id: 'rule1', rse: 'CERN-PROD_DATADISK', state: 'OK', copies: 1 },
            { id: 'rule2', rse: 'LBNL_ATLAS_DATADISK', state: 'REPLICATING', copies: 2 },
            { id: 'rule3', rse: 'TOKYO-LCG2_DATADISK', state: 'OK', copies: 1 },
        ],
    },
});

const invalidJSON = '{ invalid json, missing quotes: true }';

// Basic examples
export const SimpleObject: Story = {
    args: {
        value: simpleJSON,
        showCopyButton: true,
        showRawToggle: true,
    },
};

export const NestedObject: Story = {
    args: {
        value: nestedJSON,
        showCopyButton: true,
        showRawToggle: true,
    },
};

export const ArrayData: Story = {
    args: {
        value: arrayJSON,
        showCopyButton: true,
        showRawToggle: true,
    },
};

export const InvalidJSON: Story = {
    args: {
        value: invalidJSON,
        showCopyButton: true,
        showRawToggle: true,
    },
};

export const EmptyObject: Story = {
    args: {
        value: JSON.stringify({}),
        showCopyButton: true,
        showRawToggle: true,
    },
};

export const EmptyArray: Story = {
    args: {
        value: JSON.stringify([]),
        showCopyButton: true,
        showRawToggle: true,
    },
};

// Feature variations
export const WithoutCopyButton: Story = {
    args: {
        value: nestedJSON,
        showCopyButton: false,
        showRawToggle: true,
    },
};

export const WithoutRawToggle: Story = {
    args: {
        value: nestedJSON,
        showCopyButton: true,
        showRawToggle: false,
    },
};

export const MinimalControls: Story = {
    args: {
        value: nestedJSON,
        showCopyButton: false,
        showRawToggle: false,
    },
};

export const WithMaxHeight: Story = {
    args: {
        value: largeJSON,
        showCopyButton: true,
        showRawToggle: true,
        maxHeight: '300px',
    },
};

// Real-world examples from Rucio
export const SubscriptionFilter: Story = {
    args: {
        value: subscriptionFilter,
        showCopyButton: true,
        showRawToggle: true,
    },
    parameters: {
        docs: {
            description: {
                story: 'Example of a subscription filter JSON used in Rucio subscriptions.',
            },
        },
    },
};

export const ReplicationRules: Story = {
    args: {
        value: replicationRules,
        showCopyButton: true,
        showRawToggle: true,
    },
    parameters: {
        docs: {
            description: {
                story: 'Example of replication rules JSON used in Rucio subscriptions.',
            },
        },
    },
};

export const DIDMetadata: Story = {
    args: {
        value: largeJSON,
        showCopyButton: true,
        showRawToggle: true,
        maxHeight: '500px',
    },
    parameters: {
        docs: {
            description: {
                story: 'Example of DID metadata with scrollable content.',
            },
        },
    },
};

// Dark mode showcase
export const DarkMode: Story = {
    args: {
        value: nestedJSON,
        showCopyButton: true,
        showRawToggle: true,
    },
    parameters: {
        backgrounds: { default: 'dark' },
    },
    decorators: [
        Story => (
            <div className="dark p-8 rounded-lg bg-neutral-900 w-[800px]">
                <Story />
            </div>
        ),
    ],
};

// Edge cases
export const VeryLongString: Story = {
    args: {
        value: JSON.stringify({
            longString:
                'This is a very long string that should wrap properly within the JSON viewer component without breaking the layout or causing horizontal scroll issues when the content is too wide for the container',
            anotherProperty: 'normal value',
        }),
        showCopyButton: true,
        showRawToggle: true,
    },
};

export const SpecialCharacters: Story = {
    args: {
        value: JSON.stringify({
            unicode: '你好世界',
            emoji: '🚀 🎉 ⚡',
            quotes: 'She said "Hello"',
            backslash: 'C:\\Users\\Documents',
            newlines: 'Line 1\nLine 2\nLine 3',
            tabs: 'Column1\tColumn2\tColumn3',
        }),
        showCopyButton: true,
        showRawToggle: true,
    },
};

export const BooleanAndNull: Story = {
    args: {
        value: JSON.stringify({
            trueValue: true,
            falseValue: false,
            nullValue: null,
            undefinedBehavior: undefined, // Will be omitted in JSON
            zeroValue: 0,
            emptyString: '',
        }),
        showCopyButton: true,
        showRawToggle: true,
    },
};

export const MixedDataTypes: Story = {
    args: {
        value: JSON.stringify({
            string: 'text',
            number: 42,
            float: 3.14159,
            boolean: true,
            null: null,
            array: [1, 2, 3],
            object: { nested: 'value' },
            largeNumber: 9007199254740991,
            negativeNumber: -273.15,
            scientificNotation: 6.022e23,
        }),
        showCopyButton: true,
        showRawToggle: true,
    },
};

// Comparison showcase
export const ComparisonAllVariations: Story = {
    render: () => (
        <div className="space-y-6 w-[800px]">
            <div>
                <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100">All Features Enabled</h3>
                <JSONViewer value={nestedJSON} showCopyButton showRawToggle />
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100">Copy Only</h3>
                <JSONViewer value={nestedJSON} showCopyButton showRawToggle={false} />
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100">Toggle Only</h3>
                <JSONViewer value={nestedJSON} showCopyButton={false} showRawToggle />
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100">Minimal (No Controls)</h3>
                <JSONViewer value={nestedJSON} showCopyButton={false} showRawToggle={false} />
            </div>
        </div>
    ),
};

// ============================================================================
// INTERACTIVE MODE STORIES
// ============================================================================

// Sample data for interactive mode
const deeplyNestedJSON = JSON.stringify({
    level1: {
        level2: {
            level3: {
                level4: {
                    level5: {
                        deepValue: 'You found me!',
                        moreData: [1, 2, 3, 4, 5],
                    },
                    anotherBranch: {
                        data: 'Additional content',
                    },
                },
            },
        },
    },
    topLevel: 'Easy to see',
});

const largeArrayJSON = JSON.stringify(
    Array.from({ length: 50 }, (_, i) => ({
        id: `item-${i}`,
        name: `Item ${i}`,
        status: i % 3 === 0 ? 'active' : i % 3 === 1 ? 'pending' : 'inactive',
        metadata: {
            created: new Date(2024, 0, i + 1).toISOString(),
            score: Math.random() * 100,
        },
    })),
);

const complexSubscriptionJSON = JSON.stringify({
    subscription: {
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        account: 'root',
        name: 'data15_13TeV_subscription',
        filter: {
            scope: ['data15_13TeV', 'data15_14TeV', 'data16_13TeV'],
            account: ['root', 'dataprep'],
            datatype: 'AOD',
            excluded_pattern: 'calibration.*',
            project: ['data15_13TeV'],
            asynchronous: false,
            split_rule: true,
        },
        replication_rules: [
            {
                copies: 1,
                rse_expression: 'tier=1&disk=1',
                weight: null,
                lifetime: 604800,
                locked: false,
                subscription_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
                source_replica_expression: null,
                activity: 'User Subscriptions',
                notify: 'N',
                comments: 'Primary copy for T1 sites',
                grouping: 'DATASET',
                purge_replicas: false,
            },
            {
                copies: 2,
                rse_expression: 'cloud=US&type=DATADISK',
                weight: null,
                lifetime: null,
                locked: true,
                subscription_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
                source_replica_expression: 'tier=0',
                activity: 'Data Brokering',
                notify: 'Y',
                comments: 'US cloud distribution',
                grouping: 'ALL',
                purge_replicas: true,
            },
            {
                copies: 1,
                rse_expression: 'cloud=CERN&tape=1',
                weight: 10,
                lifetime: null,
                locked: true,
                subscription_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
                source_replica_expression: null,
                activity: 'Data Consolidation',
                notify: 'N',
                comments: 'Long-term tape storage',
                grouping: 'DATASET',
                purge_replicas: false,
            },
        ],
        state: 'ACTIVE',
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-20T14:45:00Z',
        lifetime: null,
        comments: 'Automatic subscription for data15 datasets',
        retroactive: false,
        priority: 3,
    },
});

// Interactive mode - explicit usage
export const InteractiveModeExplicit: Story = {
    args: {
        value: replicationRules,
        mode: 'interactive',
        expandDepth: 2,
        showCopyButton: true,
    },
    parameters: {
        docs: {
            description: {
                story: 'Explicitly using interactive mode with expandable tree structure. Click on chevrons to expand/collapse nested objects.',
            },
        },
    },
};

export const InteractiveDeepNesting: Story = {
    args: {
        value: deeplyNestedJSON,
        mode: 'interactive',
        expandDepth: 3,
        showCopyButton: true,
    },
    parameters: {
        docs: {
            description: {
                story: 'Interactive mode with deeply nested objects (5 levels). Initial expand depth is 3 levels.',
            },
        },
    },
};

export const InteractiveLargeArray: Story = {
    args: {
        value: largeArrayJSON,
        mode: 'interactive',
        expandDepth: 1,
        showCopyButton: true,
        maxHeight: '400px',
    },
    parameters: {
        docs: {
            description: {
                story: 'Interactive mode with large array (50 items). Scrollable content with expand/collapse for each item.',
            },
        },
    },
};

export const InteractiveComplexSubscription: Story = {
    args: {
        value: complexSubscriptionJSON,
        mode: 'interactive',
        expandDepth: 2,
        showCopyButton: true,
        maxHeight: '500px',
    },
    parameters: {
        docs: {
            description: {
                story: 'Real-world example: Complex subscription with filter and multiple replication rules.',
            },
        },
    },
};

// Auto-detection mode stories
export const AutoModeSimpleObject: Story = {
    args: {
        value: simpleJSON,
        mode: 'auto',
        showCopyButton: true,
    },
    parameters: {
        docs: {
            description: {
                story: 'Auto mode detects simple JSON and uses static syntax highlighting view.',
            },
        },
    },
};

export const AutoModeComplexObject: Story = {
    args: {
        value: replicationRules,
        mode: 'auto',
        showCopyButton: true,
    },
    parameters: {
        docs: {
            description: {
                story: 'Auto mode detects complex JSON (array with 2+ items) and uses interactive tree view.',
            },
        },
    },
};

export const AutoModeSubscriptionFilter: Story = {
    args: {
        value: subscriptionFilter,
        mode: 'auto',
        showCopyButton: true,
    },
    parameters: {
        docs: {
            description: {
                story: 'Auto mode with subscription filter - likely uses static view due to flat structure.',
            },
        },
    },
};

export const AutoModeNestedData: Story = {
    args: {
        value: largeJSON,
        mode: 'auto',
        showCopyButton: true,
        maxHeight: '400px',
    },
    parameters: {
        docs: {
            description: {
                story: 'Auto mode with nested DID metadata - uses interactive view due to depth and complexity.',
            },
        },
    },
};

// Interactive dark mode
export const InteractiveDarkMode: Story = {
    args: {
        value: complexSubscriptionJSON,
        mode: 'interactive',
        expandDepth: 2,
        showCopyButton: true,
        maxHeight: '500px',
    },
    parameters: {
        backgrounds: { default: 'dark' },
    },
    decorators: [
        Story => (
            <div className="dark p-8 rounded-lg bg-neutral-900 w-[800px]">
                <Story />
            </div>
        ),
    ],
};

// Side-by-side comparison
export const ComparisonStaticVsInteractive: Story = {
    render: () => (
        <div className="space-y-6 w-[800px]">
            <div>
                <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100">Static Mode (Syntax Highlighting)</h3>
                <JSONViewer value={replicationRules} mode="static" showCopyButton showRawToggle />
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100">Interactive Mode (Expandable Tree)</h3>
                <JSONViewer value={replicationRules} mode="interactive" expandDepth={2} showCopyButton />
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100">Auto Mode (Detects Best View)</h3>
                <JSONViewer value={replicationRules} mode="auto" showCopyButton />
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Side-by-side comparison of static, interactive, and auto modes with the same JSON data.',
            },
        },
    },
};

// Expand depth variations
export const InteractiveExpandDepthVariations: Story = {
    render: () => (
        <div className="space-y-6 w-[800px]">
            <div>
                <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100">Expand Depth: 1</h3>
                <JSONViewer value={complexSubscriptionJSON} mode="interactive" expandDepth={1} showCopyButton maxHeight="300px" />
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100">Expand Depth: 2</h3>
                <JSONViewer value={complexSubscriptionJSON} mode="interactive" expandDepth={2} showCopyButton maxHeight="300px" />
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100">Expand Depth: 3</h3>
                <JSONViewer value={complexSubscriptionJSON} mode="interactive" expandDepth={3} showCopyButton maxHeight="300px" />
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates different initial expand depths for interactive tree view.',
            },
        },
    },
};
