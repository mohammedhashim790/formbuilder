import {AfterViewInit, Component, ElementRef, ViewChild,} from '@angular/core';

type Tool = 'select' | 'rect';


@Component({
  selector: 'app-drawing-board', templateUrl: './draw-board.html', styleUrls: ['./draw-board.css'],
})
export class DrawingBoard implements AfterViewInit {

  @ViewChild('canvas', {static: true}) canvasRef!: ElementRef<HTMLCanvasElement>;

  @ViewChild('textInput', {static: false}) textInputRef!: ElementRef<HTMLInputElement>;

  activeTool: Tool = 'rect';

  private ctx!: CanvasRenderingContext2D;

  private canvas!: HTMLCanvasElement;


  ngAfterViewInit(): void {
    this.canvas = this.canvasRef.nativeElement as HTMLCanvasElement;

    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

    this.draw();
  }


  private draw() {
    this.ctx.fillRect(0, 0, 100, 100);
    this.ctx.fillStyle = '#000';
  }


}
