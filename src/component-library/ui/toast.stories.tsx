import React, { useEffect } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Toaster } from '@/component-library/ui/toaster';
import { useToast } from '@/component-library/hooks/use-toast';

export default {
    title: 'Components/Toast',
    component: Toaster,
    argTypes: {
        title: { control: 'text' },
        description: { control: 'text' },
        variant: { control: 'text' },
    },
    parameters: {
        docs: { disable: true },
    },
} as Meta;

type ToastProps = {
    title: string;
    description: string;
    action?: JSX.Element;
    variant?: 'error' | 'warning' | 'info';
};

const Template: StoryFn<ToastProps> = args => {
    const { toast, dismiss } = useToast();

    useEffect(() => {
        return () => dismiss();
    }, []);

    return (
        <div>
            <button
                onClick={() => {
                    toast({
                        title: args.title,
                        description: args.description,
                        variant: args.variant,
                    });
                }}
            >
                Show toast
            </button>
            <Toaster />
        </div>
    );
};

export const Info = Template.bind({});
Info.args = {
    title: 'Hi!',
    description: 'I am subtle.',
    variant: 'info',
};

export const Warning = Template.bind({});
Warning.args = {
    title: 'Hm...',
    description: 'What has gone wrong?',
    variant: 'warning',
};

export const Error = Template.bind({});
Error.args = {
    title: 'Oops!',
    description: 'There has been an error.',
    variant: 'error',
};

export const LongDescription = Template.bind({});
LongDescription.args = {
    title: 'Boring...',
    description: 'SWW$8eJY,Ud5=HB%VjD6dkS.p[1MQ[w9kbgj.#3C-X*Pyamz,.V#@:af(wNE[F0cNj8AU8=F()RqZyy$e9+w!&QZwCFkd-!]G?TG',
    variant: 'info',
};
