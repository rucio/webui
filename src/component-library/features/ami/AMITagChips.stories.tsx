import type { Meta, StoryObj } from '@storybook/nextjs';
import { AMITagChips } from './AMITagChips';

const url = (tag: string) => `https://atlas-ami.cern.ch/?subapp=tagsShow&userdata=${tag}`;

const meta: Meta<typeof AMITagChips> = {
    title: 'Features/AMI/AMITagChips',
    component: AMITagChips,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'ATLAS only (flag `dids.ami_tags`). AMI tags parsed from a DID name. Each chip links to AMI in a new tab; hover or focus shows the tag details fetched from AMI.',
            },
        },
    },
    tags: ['autodocs'],
    decorators: [
        Story => (
            <div className="p-16 min-w-[320px]">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof AMITagChips>;

export const Found: Story = {
    args: {
        tags: ['f1723', 'm2281'],
        infos: [
            {
                tag: 'f1723',
                url: url('f1723'),
                found: true,
                productionStep: 'recon',
                baseRelease: 'Athena_24.0.146',
                transformation: 'Reco_tf.py',
                description: 'f1720 (recon) with 24.0.146',
            },
            {
                tag: 'm2281',
                url: url('m2281'),
                found: true,
                productionStep: 'merge',
                baseRelease: 'Athena_24.0.128',
                transformation: 'AODMerge_tf.py',
                description: 'm2272 with 24.0.128 for first 2026 run',
                created: '2026-02-09 18:04:58',
            },
        ],
    },
};

export const Loading: Story = {
    args: { tags: ['e8514', 's4162', 'r15540', 'p6266'], isLoading: true },
};

export const NotFound: Story = {
    args: { tags: ['f99999999'], infos: [{ tag: 'f99999999', url: url('f99999999'), found: false }] },
};

export const AMIUnavailable: Story = {
    args: {
        tags: ['f1723', 'm2281'],
        infos: [
            { tag: 'f1723', url: url('f1723'), found: null },
            { tag: 'm2281', url: url('m2281'), found: null },
        ],
    },
};
