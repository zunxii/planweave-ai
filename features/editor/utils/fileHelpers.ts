import type { FileItem } from '@/types';

export function getFileExtension(filename: string): string {
  return filename.split('.').pop() || '';
}

export function getFileLanguage(filename: string): string {
  const extension = getFileExtension(filename);
  
  const languageMap: Record<string, string> = {
    ts: 'typescript',
    tsx: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    css: 'css',
    scss: 'scss',
    json: 'json',
    md: 'markdown',
    html: 'html',
    py: 'python',
    go: 'go',
    rs: 'rust',
    java: 'java',
  };

  return languageMap[extension] || 'typescript';
}

export function createNewFile(path: string): FileItem {
  const name = path.split('/').pop() || path;
  const language = getFileLanguage(path);
  
  return {
    name,
    path,
    language,
    content: `// ${path}\n\n`,
  };
}

export function validateFileName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim() === '') {
    return { valid: false, error: 'File name cannot be empty' };
  }

  if (name.includes('..')) {
    return { valid: false, error: 'File name cannot contain ".."' };
  }

  if (!/^[a-zA-Z0-9_\-/.]+$/.test(name)) {
    return { valid: false, error: 'File name contains invalid characters' };
  }

  return { valid: true };
}
