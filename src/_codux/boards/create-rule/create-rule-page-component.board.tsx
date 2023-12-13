import React from 'react';
import { createBoard } from '@wixc3/react-board';
import { CreateRule } from '../../../component-library/Pages/Rule/CreateRule';

export default createBoard({
    name: 'CreateRule Page Component',
    Board: () => <CreateRule />,
    isSnippet: true,
    environmentProps: {
        windowWidth: 1010,
        canvasWidth: 655
    }
});
