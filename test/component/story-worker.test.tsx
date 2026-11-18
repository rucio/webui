import { render } from '@testing-library/react';
import { setupWorker } from 'msw/browser';
import { getDecoratorWithWorker } from '../mocks/handlers/story-decorators';

jest.mock('msw/browser', () => ({
    setupWorker: jest.fn(() => ({ start: jest.fn(), stop: jest.fn() })),
}));

test('loads the mock service worker next to the Storybook preview', () => {
    const decorate = getDecoratorWithWorker([]);
    const Preview = () => decorate(() => null, {});

    render(<Preview />);

    const [{ value: worker }] = jest.mocked(setupWorker).mock.results;
    expect(worker.start).toHaveBeenCalledWith(expect.objectContaining({ serviceWorker: { url: './mockServiceWorker.js' } }));
});
