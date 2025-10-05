export function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function extractCodeBlocks(content: string) {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const blocks = [];
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    blocks.push({
      id: `code-${Date.now()}-${blocks.length}`,
      language: match[1] || 'text',
      code: match[2].trim(),
    });
  }

  return blocks;
}

export function removeCodeBlocks(content: string): string {
  return content.replace(/```[\s\S]*?```/g, '').trim();
}