'use client';

import { motion, useReducedMotion } from 'motion/react';

/**
 * Animated background with floating orbs, path drawing effects, and orbiting particles
 * Features subtle motion that enhances without distracting
 * Respects prefers-reduced-motion accessibility preference
 */
export function AnimatedBackground() {
    const shouldReduceMotion = useReducedMotion();

    // Orb configuration for subtle floating effect - spread across viewport
    const orbs = [
        {
            size: 500,
            initialX: '5%',
            initialY: '10%',
            color: 'from-brand-500/10 to-brand-600/5',
            duration: 20,
            movement: { x: [0, 50, -50, 0], y: [0, -40, 40, 0] },
        },
        {
            size: 400,
            initialX: '85%',
            initialY: '15%',
            color: 'from-brand-400/10 to-brand-500/5',
            duration: 25,
            movement: { x: [0, -40, 40, 0], y: [0, 50, -50, 0] },
        },
        {
            size: 450,
            initialX: '10%',
            initialY: '75%',
            color: 'from-brand-600/10 to-brand-700/5',
            duration: 22,
            movement: { x: [0, 40, -40, 0], y: [0, -50, 50, 0] },
        },
        {
            size: 350,
            initialX: '80%',
            initialY: '80%',
            color: 'from-brand-500/8 to-brand-600/4',
            duration: 28,
            movement: { x: [0, -50, 50, 0], y: [0, -40, 40, 0] },
        },
        {
            size: 300,
            initialX: '50%',
            initialY: '5%',
            color: 'from-brand-400/8 to-brand-500/4',
            duration: 24,
            movement: { x: [0, 30, -30, 0], y: [0, 40, -40, 0] },
        },
    ];

    // Orbiting particles configuration - spread across different positions
    const particles = [
        { size: 4, duration: 40, delay: 0, orbitRadius: 200, blur: 2, posX: '15%', posY: '25%' },
        { size: 3, duration: 35, delay: 5, orbitRadius: 300, blur: 1.5, posX: '80%', posY: '30%' },
        { size: 5, duration: 45, delay: 10, orbitRadius: 250, blur: 2.5, posX: '20%', posY: '70%' },
        { size: 4, duration: 50, delay: 15, orbitRadius: 280, blur: 2, posX: '75%', posY: '65%' },
        { size: 3, duration: 38, delay: 8, orbitRadius: 220, blur: 1.5, posX: '50%', posY: '15%' },
    ];

    // Path drawing SVG paths - spread across viewport using viewBox percentages
    const paths = [
        {
            d: 'M 50 100 Q 300 50, 600 150 T 1200 200',
            strokeWidth: 0.4,
            duration: 3,
            delay: 0,
        },
        {
            d: 'M 1400 150 Q 1100 300, 800 250 T 200 500',
            strokeWidth: 0.4,
            duration: 3.5,
            delay: 0.5,
        },
        {
            d: 'M 100 700 Q 500 600, 900 700 T 1500 650',
            strokeWidth: 0.4,
            duration: 4,
            delay: 1,
        },
        {
            d: 'M 1500 800 Q 1000 750, 600 850 T 100 900',
            strokeWidth: 0.4,
            duration: 3.8,
            delay: 1.5,
        },
        {
            d: 'M 750 50 Q 600 250, 850 400 T 750 700',
            strokeWidth: 0.3,
            duration: 4.2,
            delay: 0.8,
        },
    ];

    if (shouldReduceMotion) {
        // Static gradient background when reduced motion is preferred
        return (
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-neutral-50 via-brand-50/30 to-neutral-100 dark:from-neutral-950 dark:via-brand-950/20 dark:to-neutral-950" />
        );
    }

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-50 dark:from-black dark:via-neutral-950 dark:to-neutral-900">
            {/* Animated Grid Pattern */}
            <motion.div
                className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.03 }}
                transition={{ duration: 2 }}
            >
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                            <path
                                d="M 80 0 L 0 0 0 80"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="0.5"
                                className="text-brand-500 dark:text-brand-400"
                            />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </motion.div>

            {/* SVG Path Drawing Effects */}
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1600 1000"
                preserveAspectRatio="xMidYMid slice"
            >
                {paths.map((path, index) => (
                    <motion.path
                        key={index}
                        d={path.d}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={path.strokeWidth}
                        className="text-brand-500/5 dark:text-brand-400/20"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{
                            pathLength: {
                                duration: path.duration,
                                delay: path.delay,
                                ease: 'easeInOut',
                            },
                            opacity: {
                                duration: 1,
                                delay: path.delay,
                            },
                        }}
                    />
                ))}
            </svg>

            {/* Floating Orbs */}
            {orbs.map((orb, index) => (
                <motion.div
                    key={`orb-${index}`}
                    className={`absolute rounded-full blur-3xl bg-gradient-to-br ${orb.color}`}
                    style={{
                        width: orb.size,
                        height: orb.size,
                        left: orb.initialX,
                        top: orb.initialY,
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        x: orb.movement.x,
                        y: orb.movement.y,
                    }}
                    transition={{
                        opacity: { duration: 1, delay: index * 0.2 },
                        scale: { duration: 1, delay: index * 0.2 },
                        x: {
                            duration: orb.duration,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: index * 0.5,
                        },
                        y: {
                            duration: orb.duration,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: index * 0.5,
                        },
                    }}
                />
            ))}

            {/* Orbiting Particles */}
            {particles.map((particle, index) => (
                <motion.div
                    key={`particle-${index}`}
                    className="absolute"
                    style={{
                        left: particle.posX,
                        top: particle.posY,
                        width: particle.orbitRadius * 2,
                        height: particle.orbitRadius * 2,
                        marginLeft: -particle.orbitRadius,
                        marginTop: -particle.orbitRadius,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: [0, 1, 1, 0],
                        rotate: 360,
                    }}
                    transition={{
                        opacity: {
                            duration: 2,
                            times: [0, 0.1, 0.9, 1],
                            delay: particle.delay,
                        },
                        rotate: {
                            duration: particle.duration,
                            repeat: Infinity,
                            ease: 'linear',
                            delay: particle.delay,
                        },
                    }}
                >
                    <div
                        className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full bg-brand-500/40 dark:bg-brand-400/40"
                        style={{
                            width: particle.size,
                            height: particle.size,
                            filter: `blur(${particle.blur}px)`,
                        }}
                    />
                </motion.div>
            ))}

            {/* Connecting Lines (subtle) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                {/* Top left to top right */}
                <motion.line
                    x1="5%"
                    y1="10%"
                    x2="85%"
                    y2="15%"
                    stroke="currentColor"
                    strokeWidth="0.25"
                    className="text-brand-500/3 dark:text-brand-400/8"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.2 }}
                    transition={{
                        pathLength: { duration: 2, delay: 1.5, ease: 'easeInOut' },
                        opacity: { duration: 1, delay: 1.5 },
                    }}
                />
                {/* Top right to bottom right */}
                <motion.line
                    x1="85%"
                    y1="15%"
                    x2="80%"
                    y2="80%"
                    stroke="currentColor"
                    strokeWidth="0.25"
                    className="text-brand-500/3 dark:text-brand-400/8"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.2 }}
                    transition={{
                        pathLength: { duration: 2, delay: 2, ease: 'easeInOut' },
                        opacity: { duration: 1, delay: 2 },
                    }}
                />
                {/* Bottom right to bottom left */}
                <motion.line
                    x1="80%"
                    y1="80%"
                    x2="10%"
                    y2="75%"
                    stroke="currentColor"
                    strokeWidth="0.25"
                    className="text-brand-500/3 dark:text-brand-400/8"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.2 }}
                    transition={{
                        pathLength: { duration: 2, delay: 2.5, ease: 'easeInOut' },
                        opacity: { duration: 1, delay: 2.5 },
                    }}
                />
                {/* Bottom left to top left */}
                <motion.line
                    x1="10%"
                    y1="75%"
                    x2="5%"
                    y2="10%"
                    stroke="currentColor"
                    strokeWidth="0.25"
                    className="text-brand-500/3 dark:text-brand-400/8"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.2 }}
                    transition={{
                        pathLength: { duration: 2, delay: 3, ease: 'easeInOut' },
                        opacity: { duration: 1, delay: 3 },
                    }}
                />
                {/* Diagonal cross from top to bottom */}
                <motion.line
                    x1="50%"
                    y1="5%"
                    x2="10%"
                    y2="75%"
                    stroke="currentColor"
                    strokeWidth="0.25"
                    className="text-brand-500/3 dark:text-brand-400/8"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.2 }}
                    transition={{
                        pathLength: { duration: 2.5, delay: 3.5, ease: 'easeInOut' },
                        opacity: { duration: 1, delay: 3.5 },
                    }}
                />
            </svg>
        </div>
    );
}
