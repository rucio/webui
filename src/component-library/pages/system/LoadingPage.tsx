'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { PageContainer } from '@/component-library/features/layout/PageContainer';
import { RucioLogo } from '@/component-library/atoms/branding/RucioLogo';
import { LoadingSpinner } from '@/component-library/atoms/loading/LoadingSpinner';
import { Heading } from '@/component-library/atoms/misc/Heading';

export interface LoadingPageProps {
    /**
     * Loading message to display
     * @default "Loading Rucio WebUI..."
     */
    message?: string;
    /**
     * Size of the logo
     * @default 146
     */
    logoSize?: number;
    /**
     * Size of the loading spinner
     * @default "xl"
     */
    spinnerSize?: 'sm' | 'md' | 'lg' | 'xl';
    /**
     * Whether to show animated orbit effects
     * @default true
     */
    showOrbitAnimation?: boolean;
    /**
     * Additional CSS classes for the container
     */
    className?: string;
}

/**
 * LoadingPage component with dynamic animations
 *
 * A full-page loading state with animated logo, orbiting elements, and smooth entrance effects.
 * Features path drawing-inspired animations and respects reduced motion preferences.
 * Used by Next.js during route transitions and can be used in Storybook for testing.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage with animations
 * <LoadingPage />
 *
 * // Custom message
 * <LoadingPage message="Loading data..." />
 *
 * // Without orbit animations
 * <LoadingPage showOrbitAnimation={false} />
 * ```
 */
export const LoadingPage = React.forwardRef<HTMLDivElement, LoadingPageProps>(
    ({ message = 'Loading Rucio WebUI...', logoSize = 146, spinnerSize = 'xl', showOrbitAnimation = true, className }, ref) => {
        const shouldReduceMotion = useReducedMotion();

        // Animation variants
        const containerVariants = {
            hidden: { opacity: 0 },
            visible: {
                opacity: 1,
                transition: {
                    staggerChildren: 0.15,
                    delayChildren: 0.1,
                },
            },
        };

        const itemVariants = {
            hidden: { opacity: 0, y: 20 },
            visible: {
                opacity: 1,
                y: 0,
                transition: {
                    duration: shouldReduceMotion ? 0 : 0.3,
                    ease: [0, 0, 0.2, 1], // easeOut
                },
            },
        };

        const logoVariants = {
            hidden: { opacity: 0, scale: 0.8 },
            visible: {
                opacity: 1,
                scale: 1,
                transition: {
                    duration: shouldReduceMotion ? 0 : 0.5,
                    ease: [0, 0, 0.2, 1],
                },
            },
        };

        // Orbit circle variants
        const orbitCircleVariants = {
            hidden: { pathLength: 0, opacity: 0 },
            visible: {
                pathLength: 1,
                opacity: 0.2,
                transition: {
                    pathLength: {
                        duration: shouldReduceMotion ? 0 : 1.5,
                        ease: 'easeInOut',
                    },
                    opacity: {
                        duration: shouldReduceMotion ? 0 : 0.5,
                    },
                },
            },
        };

        return (
            <PageContainer ref={ref} centered={true} className={`min-h-screen flex items-center justify-center ${className || ''}`}>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col items-center justify-center space-y-8 relative"
                    role="status"
                    aria-live="polite"
                    aria-label="Loading Rucio WebUI"
                >
                    {/* Animated Orbit Background */}
                    {showOrbitAnimation && !shouldReduceMotion && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <svg width={logoSize * 2} height={logoSize * 2} className="absolute">
                                {/* Outer orbit */}
                                <motion.circle
                                    cx={logoSize}
                                    cy={logoSize}
                                    r={logoSize * 0.9}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                    className="text-brand-500/20 dark:text-brand-400/20"
                                    variants={orbitCircleVariants}
                                    initial="hidden"
                                    animate="visible"
                                />
                                {/* Middle orbit */}
                                <motion.circle
                                    cx={logoSize}
                                    cy={logoSize}
                                    r={logoSize * 0.7}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                    className="text-brand-600/20 dark:text-brand-500/20"
                                    variants={orbitCircleVariants}
                                    initial="hidden"
                                    animate="visible"
                                    transition={{ delay: 0.2 }}
                                />
                            </svg>

                            {/* Orbiting dots */}
                            <motion.div
                                className="absolute"
                                style={{ width: logoSize * 2, height: logoSize * 2 }}
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 20,
                                    repeat: Infinity,
                                    ease: 'linear',
                                }}
                            >
                                <div
                                    className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-brand-500 dark:bg-brand-400"
                                    style={{ filter: 'blur(1px)' }}
                                />
                            </motion.div>

                            <motion.div
                                className="absolute"
                                style={{ width: logoSize * 1.4, height: logoSize * 1.4 }}
                                animate={{ rotate: -360 }}
                                transition={{
                                    duration: 15,
                                    repeat: Infinity,
                                    ease: 'linear',
                                }}
                            >
                                <div
                                    className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand-600 dark:bg-brand-500"
                                    style={{ filter: 'blur(1px)' }}
                                />
                            </motion.div>
                        </div>
                    )}

                    {/* Animated Logo */}
                    <motion.div variants={logoVariants} className="relative z-10">
                        <motion.div
                            animate={{
                                scale: shouldReduceMotion ? 1 : [1, 1.05, 1],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        >
                            <RucioLogo width={logoSize} height={logoSize} className="text-brand-500 dark:text-brand-400" aria-label="Rucio Logo" />
                        </motion.div>
                    </motion.div>

                    {/* Animated Spinner */}
                    <motion.div variants={itemVariants}>
                        <LoadingSpinner size={spinnerSize} variant="default" />
                    </motion.div>

                    {/* Animated Message */}
                    <motion.div variants={itemVariants}>
                        <Heading text={message} size="md" className="text-neutral-900 dark:text-neutral-100" />
                    </motion.div>
                </motion.div>
            </PageContainer>
        );
    },
);

LoadingPage.displayName = 'LoadingPage';
