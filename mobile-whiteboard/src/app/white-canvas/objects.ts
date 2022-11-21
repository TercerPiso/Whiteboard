/* eslint-disable @typescript-eslint/naming-convention */
export class Point {
  public x: number;
  public y: number;

  constructor(x?: number, y?: number) {
    if(x !== undefined) {
      this.x = x;
    }
    if(y !== undefined) {
      this.y = y;
    }
  }

  substract(point: Point): Point {
    const nPoint = Object.assign(new Point(), this);
    nPoint.x -= point.x;
    nPoint.y -= point.y;
    return nPoint;
  }

  division(nro: number) {
    const nPoint = Object.assign(new Point(), this);
    if(nro <= 0) {
      return nPoint;
    }
    nPoint.x = nPoint.x / nro;
    nPoint.y = nPoint.y / nro;
    return nPoint;
  }

  multiply(nro: number) {
    const nPoint = Object.assign(new Point(), this);
    nPoint.x = nPoint.x * nro;
    nPoint.y = nPoint.y * nro;
    return nPoint;
  }
}

export class Size {
  public width: number;
  public height: number;

  constructor(width?: number, height?: number) {
    if(width !== undefined) {
      this.width = width;
    }
    if(height !== undefined) {
      this.height = height;
    }
  }
}

export enum MouseActions {
  MOVE,
  OUT,
  UP,
  DOWN,
}

export enum PenModes {
  PAINT = 'PAINT',
  CLEAR = 'CLEAR'
}

export class PenRgb {
  public red: number;
  public green: number;
  public blue: number;

  constructor(r: number, g: number, b: number) {
    this.red = r;
    this.green = g;
    this.blue = b;
  }

  getRGBA(alpha: number) {
    return `rgba(${this.red}, ${this.green}, ${this.blue}, ${alpha})`;
  }

  getRGB() {
    return `rgba(${this.red}, ${this.green}, ${this.blue})`;
  }
}
