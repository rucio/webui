import type { Meta, StoryObj } from '@storybook/nextjs';
import { DetailsDIDDatasetReplicas } from './DetailsDIDDatasetReplicas';
import { fixtureDIDDatasetReplicasViewModel } from '@/test/fixtures/table-fixtures';
import { getDecoratorWithWorker } from '@/test/mocks/handlers/story-decorators';
import { getMockStreamEndpoint } from '@/test/mocks/handlers/streaming-handlers';
import { DIDDatasetReplicasViewModel } from '@/lib/infrastructure/data/view-model/did';

const meta = {
    title: 'Components/Pages/DID/Details/DatasetReplicas',
    component: DetailsDIDDatasetReplicas,
    parameters: {
        docs: { disable: true },
    },
} satisfies Meta<typeof DetailsDIDDatasetReplicas>;

export default meta;
type Story = StoryObj<typeof meta>;

const endpointUrl = '/api/feature/list-dataset-replicas';

const withProgress = (available_files: number, length: number): DIDDatasetReplicasViewModel => ({
    ...fixtureDIDDatasetReplicasViewModel(),
    available_files,
    length,
});

const storyFor = (data: DIDDatasetReplicasViewModel[]): Story => ({
    args: { scope: 'test', name: 'dataset', isActive: true },
    decorators: [getDecoratorWithWorker([getMockStreamEndpoint(endpointUrl, { data, delay: 1 })])],
});

export const Default: Story = storyFor(Array.from({ length: 12 }, fixtureDIDDatasetReplicasViewModel));

/**
 * Replicas at a spread of completeness, so the progress column can be sorted from least to most
 * complete. An empty dataset reports 0% rather than dividing by zero.
 */
export const VaryingProgress: Story = storyFor([
    withProgress(1, 10),
    withProgress(10, 10),
    withProgress(5, 10),
    withProgress(0, 10),
    withProgress(9, 10),
    withProgress(0, 0),
]);
