import '@testing-library/jest-dom/extend-expect';
import 'reflect-metadata';
import fetchMock from 'jest-fetch-mock';
import '@inrupt/jest-jsdom-polyfills';
import { toHaveNoViolations } from 'jest-axe';

fetchMock.enableMocks();

// Mock window.matchMedia for all component tests
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Mock framer-motion to skip animations in tests
jest.mock('motion/react', () => {
    const React = require('react');

    // Filter out framer-motion specific props that aren't valid HTML attributes
    const filterMotionProps = (props: any) => {
        const {
            initial,
            animate,
            exit,
            transition,
            variants,
            whileHover,
            whileTap,
            whileFocus,
            whileDrag,
            whileInView,
            drag,
            dragConstraints,
            dragElastic,
            dragMomentum,
            dragTransition,
            dragPropagation,
            dragControls,
            dragListener,
            onDragStart,
            onDragEnd,
            onDrag,
            onAnimationStart,
            onAnimationComplete,
            layout,
            layoutId,
            custom,
            ...rest
        } = props;
        return rest;
    };

    return {
        __esModule: true,
        motion: {
            div: React.forwardRef(({ children, ...props }: any, ref: any) =>
                React.createElement('div', { ...filterMotionProps(props), ref }, children),
            ),
            button: React.forwardRef(({ children, ...props }: any, ref: any) =>
                React.createElement('button', { ...filterMotionProps(props), ref }, children),
            ),
            span: React.forwardRef(({ children, ...props }: any, ref: any) =>
                React.createElement('span', { ...filterMotionProps(props), ref }, children),
            ),
            form: React.forwardRef(({ children, ...props }: any, ref: any) =>
                React.createElement('form', { ...filterMotionProps(props), ref }, children),
            ),
        },
        AnimatePresence: ({ children }: any) => children,
        useReducedMotion: () => true,
    };
});

// Extend Jest matchers with jest-axe custom matchers
expect.extend(toHaveNoViolations);

import { loadEnvConfig } from '@next/env';

const noop = () => {};
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true });

// Mock next-auth to avoid ESM import issues
jest.mock('next-auth', () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock('next-auth/react', () => ({
    __esModule: true,
    useSession: jest.fn(() => ({
        data: null,
        status: 'unauthenticated',
    })),
    signIn: jest.fn(),
    signOut: jest.fn(),
    SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const setupTests = async () => {
    const projectDir = process.cwd();
    loadEnvConfig(projectDir);
};

export default setupTests;
