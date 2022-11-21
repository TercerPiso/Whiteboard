import { Injectable } from '@angular/core';
import { MouseActions, PenModes, PenRgb, Point, Size } from './objects';

// an adaptation of this answer: https://stackoverflow.com/questions/2368784/draw-on-html5-canvas-using-a-mouse

@Injectable({
  providedIn: 'root'
})
export class WhitecanvasService {

  private context: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private windowContext?: CanvasRenderingContext2D;
  private window?: HTMLCanvasElement;

  private currentPosition: Point = new Point();
  private previousPosition: Point = new Point();

  private flag = false;
  private dotFlag = false;

  private fillStyle = 'black';
  private stroke = new PenRgb(0,0,0);
  private lineWidth = 2;

  private mode = PenModes.PAINT;
  private forceEnabled = false;

  private canvasPosition: Point = new Point();
  private prevMovement: Point = new Point();

  private zoom = 1;

  constructor() { }

  public initCanvas(canvas: HTMLCanvasElement, window?: HTMLCanvasElement, zoom?: number) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    // touch events
    this.window = window ? window : canvas;
    this.window.addEventListener('touchmove', (e) => this.process(MouseActions.MOVE, e));
    this.window.addEventListener('touchstart', (e) => this.process(MouseActions.DOWN, e));
    this.window.addEventListener('touchend', (e) => this.process(MouseActions.UP, e));
    this.window.addEventListener('touchleave', (e: TouchEvent) => this.process(MouseActions.OUT, e));
    this.window.addEventListener('touchcancel', (e) => this.process(MouseActions.OUT, e));
    this.erease(true);
    if(zoom) {
      this.zoom = zoom;
    }
    if(this.window) {
      this.windowContext = window.getContext('2d');
      this.centerWindow();
    }
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

  public erease(initialization?: boolean) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = 'white';
    this.context.fillRect(0,0, this.canvas.width, this.canvas.height);
    if(!initialization) {
      this.drawOnWindow();
    }
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

  public centerWindow() {
    this.canvasPosition = new Point(
      this.canvas.width / 2,
      this.canvas.height / 2
    );
    this.drawOnWindow();
  }

  private process(action: MouseActions, event: TouchEvent) {
    event.preventDefault();
    // Movements
    if (action === MouseActions.DOWN) {
      // movement
      if (event.touches.length > 1 || event.shiftKey) {
        console.log('Start movement');
        this.prevMovement = new Point(
          event.touches[event.touches.length - 1].clientX,
          event.touches[event.touches.length - 1].clientY
        );
      } else { // draw
        console.log('start draw');
        this.startPath(new Point(
          event.touches[0].clientX,
          event.touches[0].clientY
        ),
        this.forceEnabled ? event.touches[0].force : 1);
      }
    } else if (action === MouseActions.MOVE) {
      // movement
      if (event.touches.length > 1 || event.shiftKey) {
        const current = new Point(
          event.touches[event.touches.length - 1].clientX,
          event.touches[event.touches.length - 1].clientY
        );
        const deltaX = this.prevMovement.x - current.x;
        const deltaY = this.prevMovement.y - current.y;
        this.canvasPosition.x += deltaX;
        this.canvasPosition.y += deltaY;
        this.prevMovement = current;
      } else {
        // draw
        this.updatePath(new Point(
          event.touches[0].clientX,
          event.touches[0].clientY
        ),
        this.forceEnabled ? event.touches[0].force : 1);
      }
    } else if (action === MouseActions.UP || action === MouseActions.OUT) {
      this.flag = false;
    }
    this.drawOnWindow();
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
    const drawPoint = this.getDrawPoint();
    this.context.arc(
      this.currentPosition.division(this.zoom).x + drawPoint.x,
      this.currentPosition.division(this.zoom).y + drawPoint.y,
      (this.lineWidth * 12),
      0,
      2 * Math.PI,
      false
    );
    this.context.fill();
  }

  private startDraw() {
    this.context.beginPath();
    this.context.fillStyle = this.fillStyle;
    const drawPoint = this.getDrawPoint();
    this.context.fillRect(
      this.currentPosition.division(this.zoom).x + drawPoint.x,
      this.currentPosition.division(this.zoom).y + drawPoint.y,
      2,
      2
    );
    this.context.closePath();
  }

  private draw(force: number) {
    this.context.beginPath();
    const drawPoint = this.getDrawPoint();
    this.context.moveTo(
      this.previousPosition.division(this.zoom).x + drawPoint.x,
      this.previousPosition.division(this.zoom).y + drawPoint.y
    );
    this.context.lineTo(
      this.currentPosition.division(this.zoom).x + drawPoint.x,
      this.currentPosition.division(this.zoom).y + drawPoint.y
    );
    this.context.strokeStyle = this.stroke.getRGBA(0.75);
    this.context.lineWidth = this.lineWidth * force;
    this.context.stroke();
    this.context.closePath();
  }

  private drawOnWindow() {
    if(!this.window) {
      return;
    }
    const drawPoint = this.getDrawPoint();
    const imageData = this.context.getImageData(drawPoint.x, drawPoint.y, this.window.width, this.window.height);
    this.windowContext.putImageData(imageData, 0, 0);
  }

  private getDrawPoint() {
    const halfWindow = new Point(
      this.window.width / 2,
      this.window.height / 2
    );
    return this.canvasPosition.substract(halfWindow);
  }

}
