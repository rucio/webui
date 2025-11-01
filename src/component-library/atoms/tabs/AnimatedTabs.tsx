'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/component-library/utils';

export interface AnimatedTabsProps {
  tabs: string[];
  activeIndex: number;
  onTabChange: (index: number) => void;
  className?: string;
  ariaLabel?: string;
}

/**
 * Modern tabs component with animated sliding indicator
 * Respects prefers-reduced-motion accessibility preference
 */
export function AnimatedTabs({ tabs, activeIndex, onTabChange, className, ariaLabel }: AnimatedTabsProps) {
  const shouldReduceMotion = useReducedMotion();
  const [indicatorStyle, setIndicatorStyle] = React.useState({ left: 0, width: 0 });
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  // Update indicator position when active tab changes
  React.useEffect(() => {
    const activeTab = tabRefs.current[activeIndex];
    if (activeTab) {
      const { offsetLeft, offsetWidth } = activeTab;
      setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [activeIndex]);

  return (
    <div
      className={cn('w-full', className)}
      role="tablist"
      aria-label={ariaLabel || 'Select Virtual Organisation'}
    >
      <div className="relative flex items-center gap-2 p-1 bg-neutral-200/50 dark:bg-neutral-800/50 rounded-lg backdrop-blur-sm">
        {/* Animated indicator */}
        <motion.div
          className="absolute h-[calc(100%-8px)] bg-neutral-0 dark:bg-neutral-700 rounded-md shadow-sm"
          initial={false}
          animate={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
          }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                }
          }
        />

        {/* Tab buttons */}
        {tabs.map((tab, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={tab}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${index}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onTabChange(index)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') {
                  e.preventDefault();
                  const nextIndex = (index + 1) % tabs.length;
                  onTabChange(nextIndex);
                  tabRefs.current[nextIndex]?.focus();
                } else if (e.key === 'ArrowLeft') {
                  e.preventDefault();
                  const prevIndex = (index - 1 + tabs.length) % tabs.length;
                  onTabChange(prevIndex);
                  tabRefs.current[prevIndex]?.focus();
                }
              }}
              className={cn(
                'relative z-10 flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
                'dark:focus-visible:ring-offset-neutral-900',
                isActive
                  ? 'text-neutral-900 dark:text-neutral-100'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
              )}
            >
              <motion.span
                initial={false}
                animate={{
                  scale: isActive && !shouldReduceMotion ? [1, 1.05, 1] : 1,
                }}
                transition={{
                  duration: 0.2,
                }}
              >
                {tab}
              </motion.span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
