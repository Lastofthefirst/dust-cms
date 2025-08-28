import { Component, createSignal, onMount } from 'solid-js';
import { IconSun, IconMoon } from './Icons';

export const ThemeToggle: Component = () => {
  const [isDark, setIsDark] = createSignal(false);

  onMount(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDark(shouldBeDark);
    updateTheme(shouldBeDark);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        setIsDark(e.matches);
        updateTheme(e.matches);
      }
    };
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  });

  const updateTheme = (dark: boolean) => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    const newIsDark = !isDark();
    setIsDark(newIsDark);
    updateTheme(newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      class="btn-ghost p-2 rounded-xl transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800"
      aria-label={isDark() ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark() ? 
        <IconSun size={20} class="text-yellow-500" /> : 
        <IconMoon size={20} class="text-slate-600 dark:text-slate-400" />
      }
    </button>
  );
};