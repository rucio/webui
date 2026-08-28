import { getReplicationPercentage } from '@/component-library/pages/DID/details/views/DetailsDIDDatasetReplicas';
import { fixtureDIDDatasetReplicasViewModel } from '@/test/fixtures/table-fixtures';

const replica = (available_files: number, length: number) => ({ ...fixtureDIDDatasetReplicasViewModel(), available_files, length });

describe('Dataset replicas replication progress', () => {
    it('reports the share of files present on the replica', () => {
        expect(getReplicationPercentage(replica(5, 10))).toBe(50);
        expect(getReplicationPercentage(replica(10, 10))).toBe(100);
        expect(getReplicationPercentage(replica(0, 10))).toBe(0);
    });

    it('treats an empty dataset as zero rather than dividing by zero', () => {
        expect(getReplicationPercentage(replica(0, 0))).toBe(0);
        expect(getReplicationPercentage(undefined)).toBe(0);
    });

    it('orders replicas from least to most complete', () => {
        const sorted = [replica(1, 10), replica(9, 10), replica(5, 10)].sort((a, b) => getReplicationPercentage(a) - getReplicationPercentage(b));
        expect(sorted.map(getReplicationPercentage)).toEqual([10, 50, 90]);
    });
});
