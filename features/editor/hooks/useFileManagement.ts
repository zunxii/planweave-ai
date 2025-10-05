import { useIDEStore } from '@/store';
import { syncStore } from '@/services/langchain/syncStore';

export function useFileManagement() {
  const addFile = useIDEStore(state => state.addFile);
  const deleteFile = useIDEStore(state => state.deleteFile);
  const renameFile = useIDEStore(state => state.renameFile);
  const setFiles = useIDEStore(state => state.setFiles);

  const handleAddFile = async (fileName: string) => {
    const extension = fileName.split('.').pop() || 'tsx';
    const language = ['ts', 'tsx'].includes(extension)
      ? 'typescript'
      : ['js', 'jsx'].includes(extension)
      ? 'javascript'
      : extension === 'css'
      ? 'css'
      : 'typescript';

    const newFile = {
      name: fileName.split('/').pop()!,
      path: fileName,
      language,
      content: `// ${fileName}\n\n`
    };

    addFile(newFile);
    await syncStore('sync');
  };

  const handleDeleteFile = async (path: string) => {
    deleteFile(path);
    await syncStore('sync');
  };

  const handleRenameFile = async (oldPath: string, newPath: string) => {
    renameFile(oldPath, newPath);
    await syncStore('sync');
  };

  return {
    addFile: handleAddFile,
    deleteFile: handleDeleteFile,
    renameFile: handleRenameFile,
    setFiles,
  };
}