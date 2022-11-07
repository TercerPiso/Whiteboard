import { Injectable } from '@angular/core';
import { MouseActions, Point } from './objects';

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
  private stroke = 'black';
  private lineWidth = 2;

  constructor() { }

  public initCanvas(element: HTMLCanvasElement) {
    this.canvas = element;
    this.context = element.getContext('2d');
    this.canvas.addEventListener('mousemove', (e) => this.process(MouseActions.MOVE, e));
    this.canvas.addEventListener('mousedown', (e) => this.process(MouseActions.DOWN, e));
    this.canvas.addEventListener('mouseup', (e) => this.process(MouseActions.UP, e));
    this.canvas.addEventListener('mouseout', (e) => this.process(MouseActions.OUT, e));
    // touch events
    this.canvas.addEventListener('touchmove', (e) => this.process(MouseActions.MOVE, e));
    this.canvas.addEventListener('touchstart', (e) => this.process(MouseActions.DOWN, e));
    this.canvas.addEventListener('touchend', (e) => this.process(MouseActions.UP, e));
    this.canvas.addEventListener('touchleave', (e: TouchEvent) => this.process(MouseActions.OUT, e));
    this.canvas.addEventListener('touchcancel', (e) => this.process(MouseActions.OUT, e));
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
      client.x - this.canvas.offsetLeft,
      client.y - this.canvas.offsetTop
    );
    this.flag = true;
    this.dotFlag = true;
    if (this.dotFlag) {
        this.context.beginPath();
        this.context.fillStyle = this.fillStyle;
        this.context.fillRect(this.currentPosition.x, this.currentPosition.y, 2, 2);
        this.context.closePath();
        this.dotFlag = false;
    }
  }

  private updatePath(client: Point) {
    if (this.flag) {
      this.previousPosition = this.currentPosition;
      this.currentPosition = new Point(
        client.x - this.canvas.offsetLeft,
        client.y - this.canvas.offsetTop
      );
      this.draw();
  }
  }

  private draw() {
    console.log('Drawing in ', this.currentPosition);
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
