import { useIDEStore } from '@/store';

export function useEditorState() {
  const files = useIDEStore(state => state.files);
  const currentFilePath = useIDEStore(state => state.currentFilePath);
  const setCurrentFilePath = useIDEStore(state => state.setCurrentFilePath);
  const updateFileContent = useIDEStore(state => state.updateFileContent);

  const currentFile = files.find(f => f.path === currentFilePath);

  return {
    files,
    currentFilePath,
    currentFile,
    setCurrentFilePath,
    updateFileContent,
  };
}