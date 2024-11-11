import { Meta, StoryFn } from '@storybook/react';
import { fixtureDIDKeyValuePairsDataViewModel } from '@/test/fixtures/table-fixtures';
import { DetailsDIDMetadataTable } from '@/component-library/pages/DID/details/DetailsDIDMetadataTable';

export default {
    title: 'Components/Pages/DID/Details',
    component: DetailsDIDMetadataTable,
    parameters: {
        docs: { disable: true },
    },
} as Meta<typeof DetailsDIDMetadataTable>;

const Template: StoryFn<typeof DetailsDIDMetadataTable> = args => <DetailsDIDMetadataTable {...args} />;

export const Metadata = Template.bind({});
Metadata.args = {
    viewModel: fixtureDIDKeyValuePairsDataViewModel(),
};
