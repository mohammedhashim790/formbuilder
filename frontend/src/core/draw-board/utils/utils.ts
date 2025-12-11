export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}


export function getCanvasCoords(canvas: HTMLCanvasElement, event: MouseEvent): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (event.clientX - rect.left) * scaleX, y: (event.clientY - rect.top) * scaleY,
  };
}




