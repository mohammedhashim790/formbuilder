import {AfterViewInit, Component, ElementRef, ViewChild,} from '@angular/core';

type Tool = 'select' | 'rect';

type ResizeHandle = 'tl' | 'tr' | 'bl' | 'br' | null;

interface RectShape {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text?: string;
}

@Component({
  selector: 'app-drawing-board', templateUrl: './draw-board.html', styleUrls: ['./draw-board.css'],
})
export class DrawingBoard implements AfterViewInit {

  @ViewChild('canvas', {static: true}) canvasRef!: ElementRef<HTMLCanvasElement>;

  @ViewChild('textInput', {static: false}) textInputRef!: ElementRef<HTMLInputElement>;

  activeTool: Tool = 'rect';

  private ctx!: CanvasRenderingContext2D;

  private canvas!: HTMLCanvasElement;

  private scale = 1;
  private readonly minScale = 0.25;
  private readonly maxScale = 4;
  private offsetX = 0;
  private offsetY = 0;


  ngAfterViewInit(): void {
    this.canvas = this.canvasRef.nativeElement as HTMLCanvasElement;

    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

    this.draw();
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }

  private draw() {
    this.ctx.fillRect(0, 0, 100, 100);
    this.ctx.fillStyle = '#000';
  }

  protected onWheel(event: WheelEvent) {
    event.preventDefault();

    const canvas = this.canvasRef.nativeElement as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    console.log(event.ctrlKey);
    if (event.ctrlKey || event.metaKey) {
      const zoomIntensity = 0.015;
      const delta = -event.deltaY * zoomIntensity;
      const newScale = this.clamp(this.scale * (1 + delta), this.minScale, this.maxScale);

      if (newScale === this.scale) return;

      // Cursor position in canvas pixels
      const cx = (event.clientX - rect.left) * scaleX;
      const cy = (event.clientY - rect.top) * scaleY;

      const scaleRatio = newScale / this.scale;
      this.offsetX = cx - scaleRatio * (cx - this.offsetX);
      this.offsetY = cy - scaleRatio * (cy - this.offsetY);

      this.scale = newScale;

    }

    // Otherwise: use wheel deltas to PAN (two-finger scroll / mouse wheel)
    const dxCanvas = event.deltaX * scaleX;
    const dyCanvas = event.deltaY * scaleY;

    // Adjust sign if direction feels inverted
    this.offsetX -= dxCanvas;
    this.offsetY -= dyCanvas;
    this.redraw();

  }

  private redraw(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = this.ctx;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.setTransform(this.scale, 0, 0, this.scale, this.offsetX, this.offsetY);

    ctx.lineWidth = 2 / this.scale;
    ctx.font = `${14 / this.scale}px system-ui`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    this.draw();

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
