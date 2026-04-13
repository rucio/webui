import { Meta, StoryFn } from '@storybook/nextjs';
import { DetailsDIDMeta } from '@/component-library/pages/DID/details/DetailsDIDMeta';
import { fixtureDIDMetaViewModel } from '@/test/fixtures/table-fixtures';
import { DIDType } from '@/lib/core/entity/rucio';
import { ToastedTemplate } from '@/component-library/templates/ToastedTemplate/ToastedTemplate';

export default {
    title: 'Components/Pages/DID/Details/Meta',
    component: DetailsDIDMeta,
} as Meta<typeof DetailsDIDMeta>;

const Template: StoryFn<typeof DetailsDIDMeta> = args => (
    <ToastedTemplate>
        <DetailsDIDMeta {...args} />
    </ToastedTemplate>
);

export const FileWithDates = Template.bind({});
FileWithDates.args = {
    meta: fixtureDIDMetaViewModel(DIDType.FILE),
};

export const DatasetWithDates = Template.bind({});
DatasetWithDates.args = {
    meta: fixtureDIDMetaViewModel(DIDType.DATASET),
};

export const ContainerWithDates = Template.bind({});
ContainerWithDates.args = {
    meta: fixtureDIDMetaViewModel(DIDType.CONTAINER),
};

export const NullDates = Template.bind({});
NullDates.args = {
    meta: {
        ...fixtureDIDMetaViewModel(DIDType.FILE),
        created_at: undefined as unknown as string,
        updated_at: undefined as unknown as string,
    },
};
