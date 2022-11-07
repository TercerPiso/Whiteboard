import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { WhitecanvasService } from '../white-canvas/whitecanvas.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit{

  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('content') content: ElementRef<HTMLImageElement>;

  constructor(private readonly whiteCanvasSrv: WhitecanvasService) {}

  ngAfterViewInit(): void {
    this.canvas.nativeElement.width = window.innerWidth;
    this.canvas.nativeElement.height = window.innerHeight - 50;
    this.whiteCanvasSrv.initCanvas(this.canvas.nativeElement);
  }

}
