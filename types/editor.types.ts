export interface FileItem {
  name: string;
  path: string;
  content: string;
  language: string;
}

export interface CodeBlock {
  id: string;
  language: string;
  code: string;
  filename?: string;
  description?: string;
  highlighted?: boolean;
}

export interface EditorConfig {
  theme: string;
  fontSize: number;
  minimap: boolean;
}