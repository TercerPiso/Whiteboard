import { Injectable } from '@angular/core';
import { MouseActions, PenModes, Point } from './objects';

// an adaptation of this answer: https://stackoverflow.com/questions/2368784/draw-on-html5-canvas-using-a-mouse

@Injectable({
  providedIn: 'root'
})
export class WhitecanvasService {

  private context: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;

  private currentPosition: Point = new Point();
  private previousPosition: Point = new Point();

  private flag = false;
  private dotFlag = false;

  private fillStyle = 'black';
  private stroke = '#000000';
  private lineWidth = 2;

  private mode = PenModes.PAINT;

  constructor() { }

  public initCanvas(element: HTMLCanvasElement) {
    this.canvas = element;
    this.context = element.getContext('2d');
    // this.canvas.addEventListener('mousemove', (e) => this.process(MouseActions.MOVE, e));
    // this.canvas.addEventListener('mousedown', (e) => this.process(MouseActions.DOWN, e));
    // this.canvas.addEventListener('mouseup', (e) => this.process(MouseActions.UP, e));
    // this.canvas.addEventListener('mouseout', (e) => this.process(MouseActions.OUT, e));
    // touch events
    this.canvas.addEventListener('touchmove', (e) => this.process(MouseActions.MOVE, e));
    this.canvas.addEventListener('touchstart', (e) => this.process(MouseActions.DOWN, e));
    this.canvas.addEventListener('touchend', (e) => this.process(MouseActions.UP, e));
    this.canvas.addEventListener('touchleave', (e: TouchEvent) => this.process(MouseActions.OUT, e));
    this.canvas.addEventListener('touchcancel', (e) => this.process(MouseActions.OUT, e));
  }

  public changeMode(mode: PenModes) {
    this.mode = mode;
  }

  public erease() {
    if (confirm('Do you really want to clear all?')) {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  private process(action: MouseActions, event: MouseEvent | TouchEvent) {
    if (action === MouseActions.DOWN) {
      this.startPath({
        x: event instanceof MouseEvent ? event.clientX : event.touches[0].clientX,
        y: event instanceof MouseEvent ? event.clientY : event.touches[0].clientY
      });
    } else if (action === MouseActions.MOVE) {
      this.updatePath({
        x: event instanceof MouseEvent ? event.clientX : event.touches[0].clientX,
        y: event instanceof MouseEvent ? event.clientY : event.touches[0].clientY
      });
    } else if (action === MouseActions.UP || action === MouseActions.OUT) {
      this.flag = false;
    }
  }

  private startPath(client: Point) {
    this.previousPosition = this.currentPosition;
    this.currentPosition = new Point(
      client.x - this.canvas.getBoundingClientRect().left,
      client.y - this.canvas.getBoundingClientRect().top
    );
    this.flag = true;
    this.dotFlag = true;
    if (this.dotFlag) {
      if(this.mode === PenModes.PAINT) {
        this.startDraw();
      } else {
        this.clear();
      }
      this.dotFlag = false;
    }
  }

  private updatePath(client: Point) {
    if (this.flag) {
      this.previousPosition = this.currentPosition;
      this.currentPosition = new Point(
        client.x - this.canvas.getBoundingClientRect().left,
        client.y - this.canvas.getBoundingClientRect().top
      );
      if(this.mode === PenModes.PAINT) {
        this.draw();
      } else {
        this.clear();
      }
    }
  }

  private clear() {
    this.context.beginPath();
    this.fillStyle = 'white';
    this.context.arc(this.currentPosition.x, this.currentPosition.y, (this.lineWidth * 2), 0, 2 * Math.PI, false);
    this.context.fill();
  }

  private startDraw() {
    this.context.beginPath();
    this.context.fillStyle = this.fillStyle;
    this.context.fillRect(this.currentPosition.x, this.currentPosition.y, 2, 2);
    this.context.closePath();
  }

  private draw() {
    this.context.beginPath();
    this.context.moveTo(this.previousPosition.x, this.previousPosition.y);
    this.context.lineTo(this.currentPosition.x, this.currentPosition.y);
    this.context.strokeStyle = this.stroke;
    this.context.lineWidth = this.lineWidth;
    this.context.stroke();
    this.context.closePath();
  }

  // public save() {
  //   const image = this.canvas.toDataURL();
  // }

}
