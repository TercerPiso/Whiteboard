import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PenModes, Point } from '../white-canvas/objects';
import { WhitecanvasService } from '../white-canvas/whitecanvas.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit{

  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('content') content: ElementRef<HTMLImageElement>;

  public mode: PenModes = PenModes.PAINT;
  public stroke = '#000000';
  public lineWidth = 6;
  public mousePosition: Point = new Point();

  constructor(private readonly whiteCanvasSrv: WhitecanvasService) {}

  ngAfterViewInit(): void {
    this.canvas.nativeElement.width = window.innerWidth;
    this.canvas.nativeElement.height = window.innerHeight - 50;
    addEventListener('touchmove', (e) => {
      this.mousePosition = new Point(
        e.touches[0].clientX - this.canvas.nativeElement.getBoundingClientRect().left,
        e.touches[0].clientY - this.canvas.nativeElement.getBoundingClientRect().top
      );
    });
    addEventListener('mousemove', (e) => {
      this.mousePosition = new Point(
        e.clientX,
        e.clientY
      );
    });
    this.whiteCanvasSrv.initCanvas(this.canvas.nativeElement);
    this.whiteCanvasSrv.format({
      lineWidth: this.lineWidth,
      stroke: this.stroke
    });
  }

  changeMode(mode: any) {
    console.log('Changing mode to ', mode);
    this.whiteCanvasSrv.changeMode(mode);
    this.mode = mode;
  }

}
