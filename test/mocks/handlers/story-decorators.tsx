import { setupWorker } from 'msw/browser';
import { RequestHandler } from 'msw';
import { useEffect } from 'react';

export const getDecoratorWithWorker = (handlers: RequestHandler[]) => {
    const DecoratorWithWorker = (Story: any, context: any) => {
        const worker = setupWorker(...handlers);
        worker.start({
            onUnhandledRequest: 'bypass',
        });

        useEffect(() => {
            return () => worker.stop();
        }, []);

        return <Story {...context} />;
    };
    // Assign a display name to the component
    DecoratorWithWorker.displayName = 'DecoratorWithWorker';

    return DecoratorWithWorker;
};
