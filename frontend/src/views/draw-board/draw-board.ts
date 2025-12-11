import {AfterViewInit, Component, ElementRef, ViewChild,} from '@angular/core';
import {CanvasBuilder} from '../../core/draw-board/canvas/canvas-builder';

type Tool = 'select' | 'rect';


@Component({
  selector: 'app-drawing-board', templateUrl: './draw-board.html', styleUrls: ['./draw-board.css'],
})
export class DrawingBoard implements AfterViewInit {

  @ViewChild('canvas', {static: true}) canvasRef!: ElementRef<HTMLCanvasElement>;

  @ViewChild('textInput', {static: false}) textInputRef!: ElementRef<HTMLInputElement>;

  private ctx!: CanvasRenderingContext2D;

  private canvas!: HTMLCanvasElement;

  private canvasBuilder!: CanvasBuilder;


  ngAfterViewInit(): void {
    this.canvas = this.canvasRef.nativeElement as HTMLCanvasElement;

    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

    this.canvasBuilder = new CanvasBuilder(this.canvas, this.ctx);
    this.draw();
  }


  private draw() {
    this.ctx.fillRect(0, 0, 100, 100);
    this.ctx.fillStyle = '#000';
  }


}
