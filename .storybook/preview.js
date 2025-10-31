import {ThemeProvider, useTheme} from "next-themes";

export const ThemedStory = ({ children }) => {
  const { theme, setTheme } = useTheme();
  return <div>
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="mb-2"
    >Toggle Theme</button>
    {children}
  </div>;
}

export const decorators = [
  (Story) => {
    return (
      <ThemeProvider attribute="class" defaultTheme="light">
        <ThemedStory><Story/></ThemedStory>
      </ThemeProvider>
    );
  },
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  }
}
import '../src/component-library/outputtailwind.css'
export const tags = ["autodocs"];
