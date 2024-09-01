import { StoryFn, Meta } from '@storybook/react';
import { ListDID as LD } from './ListDID';
import { fixtureDIDMetaViewModel, fixtureDIDViewModel, mockUseChunkedStream } from 'test/fixtures/table-fixtures';
import { DIDMetaViewModel } from '@/lib/infrastructure/data/view-model/did';

export default {
    title: 'Components/Pages/DID',
    component: LD,
} as Meta<typeof LD>;

const Template: StoryFn<typeof LD> = args => {
    return (
        <div className="flex flex-col h-screen bg-neutral-900">
            <LD {...args} />
        </div>
    );
};

export const ListDID = Template.bind({});
ListDID.args = {
    streamingHook: mockUseChunkedStream(Array.from({ length: 100 }, () => fixtureDIDViewModel())),
    queryMeta: async (): Promise<DIDMetaViewModel> => {
        return Promise.resolve(fixtureDIDMetaViewModel());
    },
};
