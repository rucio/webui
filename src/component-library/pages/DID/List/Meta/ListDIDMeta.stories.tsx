import { Meta, StoryFn } from '@storybook/react';
import { ListDIDMeta } from '@/component-library/pages/DID/List/Meta/ListDIDMeta';
import { fixtureDIDMetaViewModel } from '@/test/fixtures/table-fixtures';
import { DIDType } from '@/lib/core/entity/rucio';
import { ToastedTemplate } from '@/component-library/templates/ToastedTemplate/ToastedTemplate';

export default {
    title: 'Components/Pages/DID/List/Meta',
    component: ListDIDMeta,
} as Meta<typeof ListDIDMeta>;

const Template: StoryFn<typeof ListDIDMeta> = args => (
    <ToastedTemplate>
        <ListDIDMeta {...args} />
    </ToastedTemplate>
);

export const Empty = Template.bind({});

export const File = Template.bind({});
File.args = {
    meta: fixtureDIDMetaViewModel(DIDType.FILE),
};

export const Dataset = Template.bind({});
Dataset.args = {
    meta: fixtureDIDMetaViewModel(DIDType.DATASET),
};

export const Container = Template.bind({});
Container.args = {
    meta: fixtureDIDMetaViewModel(DIDType.CONTAINER),
};
