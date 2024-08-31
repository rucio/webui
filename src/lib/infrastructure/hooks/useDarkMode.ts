import { useEffect, useState } from 'react';

/**
 * A hook that observes the color mode of the page.
 * It is intended for use inside components that cannot be styled with Tailwind.
 */
const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    document.body.classList.contains('dark')
  );

  useEffect(() => {
    const className = 'dark';
    const element = document.body;

    const toggleDarkMode = () => {
      setIsDarkMode(element.classList.contains(className));
    };

    const observer = new MutationObserver(toggleDarkMode);
    observer.observe(element, {
      attributes: true,
      attributeFilter: ['class'],
    });

    toggleDarkMode();

    return () => observer.disconnect();
  }, []);

  return isDarkMode;
};

export default useDarkMode;
