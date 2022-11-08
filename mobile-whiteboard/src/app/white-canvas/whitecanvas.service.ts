import { Injectable } from '@angular/core';
import { MouseActions, PenModes, PenRgb, Point } from './objects';

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
  private stroke = new PenRgb(0,0,0);
  private lineWidth = 2;

  private mode = PenModes.PAINT;

  constructor() { }

  public initCanvas(element: HTMLCanvasElement) {
    this.canvas = element;
    this.context = element.getContext('2d');
    // touch events
    this.canvas.addEventListener('touchmove', (e) => this.process(MouseActions.MOVE, e));
    this.canvas.addEventListener('touchstart', (e) => this.process(MouseActions.DOWN, e));
    this.canvas.addEventListener('touchend', (e) => this.process(MouseActions.UP, e));
    this.canvas.addEventListener('touchleave', (e: TouchEvent) => this.process(MouseActions.OUT, e));
    this.canvas.addEventListener('touchcancel', (e) => this.process(MouseActions.OUT, e));
  }

  public format(fmt: { lineWidth?: number; stroke?: PenRgb }) {
    if(fmt.lineWidth !== undefined) {
      this.lineWidth = fmt.lineWidth;
    }
    if(fmt.stroke !== undefined) {
      this.stroke = fmt.stroke;
    }
  }

  public changeMode(mode: PenModes) {
    this.mode = mode;
  }

  public erease() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public save() {
    return this.canvas.toDataURL();
  }

  public load(dataURL: string) {
    const img = new Image();
    img.onload = () => {
      this.context.drawImage(img,0,0); // Or at whatever offset you like
    };
    img.src = dataURL;
  }

  private process(action: MouseActions, event: TouchEvent) {
    if (action === MouseActions.DOWN) {
      this.startPath({
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      },
      event.touches[0].force);
    } else if (action === MouseActions.MOVE) {
      this.updatePath({
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      },
      event.touches[0].force);
    } else if (action === MouseActions.UP || action === MouseActions.OUT) {
      this.flag = false;
    }
  }

  private startPath(client: Point, force: number) {
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

  private updatePath(client: Point, force: number) {
    if (this.flag) {
      this.previousPosition = this.currentPosition;
      this.currentPosition = new Point(
        client.x - this.canvas.getBoundingClientRect().left,
        client.y - this.canvas.getBoundingClientRect().top
      );
      if(this.mode === PenModes.PAINT) {
        this.draw(force > 0 ? force : 1);
      } else {
        this.clear();
      }
    }
  }

  private clear() {
    this.context.beginPath();
    this.context.fillStyle = 'rgba(255, 255, 255, 0.4)';
    this.context.arc(this.currentPosition.x, this.currentPosition.y, (this.lineWidth * 12), 0, 2 * Math.PI, false);
    this.context.fill();
  }

  private startDraw() {
    this.context.beginPath();
    this.context.fillStyle = this.fillStyle;
    this.context.fillRect(this.currentPosition.x, this.currentPosition.y, 2, 2);
    this.context.closePath();
  }

  private draw(force: number) {
    this.context.beginPath();
    this.context.moveTo(this.previousPosition.x, this.previousPosition.y);
    this.context.lineTo(this.currentPosition.x, this.currentPosition.y);
    this.context.strokeStyle = this.stroke.getRGBA(0.75);
    this.context.lineWidth = this.lineWidth * force;
    this.context.stroke();
    this.context.closePath();
  }

  private getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
