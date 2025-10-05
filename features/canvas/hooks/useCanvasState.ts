import { useIDEStore } from '@/store';

export function useCanvasState() {
  const canvas = useIDEStore(state => state.canvas);
  const setCanvasOpen = useIDEStore(state => state.setCanvasOpen);
  const setCanvasView = useIDEStore(state => state.setCanvasView);
  const toggleCanvas = useIDEStore(state => state.toggleCanvas);

  return {
    canvas,
    setCanvasOpen,
    setCanvasView,
    toggleCanvas,
  };
}