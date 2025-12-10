import {clamp} from '../utils/utils';

export class CanvasBuilder {

  protected canvas: HTMLCanvasElement;

  protected ctx: CanvasRenderingContext2D;

  protected scale = 1;
  protected readonly minScale = 0.25;
  protected readonly maxScale = 4;
  protected offsetX = 0;
  protected offsetY = 0;


  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
  }


  // TODO build a factory pattern builder
  // dynamic callback handler for different actions
  //  1. on pointerdown
  //  2. on move
  // protected


  protected onWheel(event: WheelEvent) {
    event.preventDefault();

    const rect = this.canvas.getBoundingClientRect();

    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    console.log(event.ctrlKey);
    if (event.ctrlKey || event.metaKey) {
      const zoomIntensity = 0.015;
      const delta = -event.deltaY * zoomIntensity;
      const newScale = clamp(this.scale * (1 + delta), this.minScale, this.maxScale);

      if (newScale === this.scale) return;

      const cx = (event.clientX - rect.left) * scaleX;
      const cy = (event.clientY - rect.top) * scaleY;

      const scaleRatio = newScale / this.scale;
      this.offsetX = cx - scaleRatio * (cx - this.offsetX);
      this.offsetY = cy - scaleRatio * (cy - this.offsetY);

      this.scale = newScale;

    }
    const dxCanvas = event.deltaX * scaleX;
    const dyCanvas = event.deltaY * scaleY;

    this.offsetX -= dxCanvas;
    this.offsetY -= dyCanvas;
  }

  private testShape() {
    this.ctx.fillRect(0, 0, 100, 100);
    this.ctx.fillStyle = '#000';
  }

  private redraw(): void {
    const ctx = this.ctx;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.setTransform(this.scale, 0, 0, this.scale, this.offsetX, this.offsetY);

    ctx.lineWidth = 2 / this.scale;
    ctx.font = `${14 / this.scale}px system-ui`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    this.testShape();

    // for (const shape of this.shapes) {
    //   const isSelected = shape.id === this.selectedId;
    //
    //   ctx.strokeStyle = isSelected ? '#2563eb' : '#111827';
    //   ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    //
    //   if (shape.text) {
    //     const centerX = shape.x + shape.width / 2;
    //     const centerY = shape.y + shape.height / 2;
    //     ctx.fillStyle = '#111827';
    //     ctx.fillText(shape.text, centerX, centerY, shape.width - 8 / this.scale);
    //   }
    //
    //   if (isSelected) {
    //     this.drawHandles(shape);
    //   }
    // }
  }


}



