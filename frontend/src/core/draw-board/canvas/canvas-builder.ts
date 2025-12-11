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

  protected onPointerDown(event: MouseEvent): void {
    console.log(event);

    // Mac cmd / Windows Ctrl + left pointer click to move
    if (event.ctrlKey && event.button == 0) {
    //   activate pan action
    }
  }

  protected onPointerUp(event: MouseEvent): void {
    console.log(event);

    // if pan enabled -> disable
  }

  protected onPointerMove(event: MouseEvent): void {
    console.log(event);
    // if pan move around
  }


  // private drawHandles(shape: RectShape): void {
  //   const ctx = this.ctx;
  //   const size = 8;
  //
  //   const corners = [{x: shape.x, y: shape.y}, {x: shape.x + shape.width, y: shape.y}, {
  //     x: shape.x, y: shape.y + shape.height
  //   }, {x: shape.x + shape.width, y: shape.y + shape.height},];
  //
  //   ctx.fillStyle = '#ffffff';
  //   ctx.strokeStyle = '#2563eb';
  //
  //   for (const c of corners) {
  //     ctx.beginPath();
  //     ctx.rect(c.x - size / 2, c.y - size / 2, size, size);
  //     ctx.fill();
  //     ctx.stroke();
  //   }
  // }

  // protected getShapeById(id: string | null): RectShape | null {
  //   if (!id) return null;
  //   return this.shapes.find((s) => s.id === id) ?? null;
  // }

  // protected hitTestHandle(shape: RectShape, x: number, y: number): ResizeHandle {
  //   const handleSize = 10;
  //
  //   const corners: { key: ResizeHandle; cx: number; cy: number }[] = [{key: 'tl', cx: shape.x, cy: shape.y}, {
  //     key: 'tr', cx: shape.x + shape.width, cy: shape.y
  //   }, {key: 'bl', cx: shape.x, cy: shape.y + shape.height}, {
  //     key: 'br', cx: shape.x + shape.width, cy: shape.y + shape.height
  //   },];
  //
  //   for (const c of corners) {
  //     if (x >= c.cx - handleSize && x <= c.cx + handleSize && y >= c.cy - handleSize && y <= c.cy + handleSize) {
  //       return c.key;
  //     }
  //   }
  //   return null;
  // }


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



