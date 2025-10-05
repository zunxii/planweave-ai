export const APP_CONFIG = {
  name: 'PlanWeave',
  version: '1.0.0',
  description: 'AI Planning Assistant for IDEs',
};

export const EDITOR_CONFIG = {
  defaultLanguage: 'typescript',
  theme: 'vs-dark',
  fontSize: 16,
  minimap: { enabled: false },
  automaticLayout: true,
};

export const NOTIFICATION_DURATION = {
  short: 3000,
  medium: 5000,
  long: 7000,
  persistent: 0,
};

export const SYNC_DEBOUNCE_MS = 1000;

export const FILE_EXTENSIONS = {
  typescript: ['.ts', '.tsx'],
  javascript: ['.js', '.jsx'],
  css: ['.css', '.scss'],
  json: ['.json'],
  markdown: ['.md'],
};
