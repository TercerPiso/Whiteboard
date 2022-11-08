import { PenRgb } from './../white-canvas/objects';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { PenModes, Point } from '../white-canvas/objects';
import { WhitecanvasService } from '../white-canvas/whitecanvas.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit{

  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('content') content: ElementRef<HTMLImageElement>;

  public mode: PenModes = PenModes.PAINT;
  public stroke = new PenRgb(0,0,0);
  public lineWidth = 6;
  public mousePosition: Point = new Point();

  constructor(private readonly whiteCanvasSrv: WhitecanvasService,
              private readonly alertController: AlertController) {}

  ngAfterViewInit(): void {
    this.canvas.nativeElement.width = window.innerWidth;
    this.canvas.nativeElement.height = window.innerHeight - 5;
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

  paint(red: number, green: number, blue: number) {
    this.changeMode('PAINT');
    this.whiteCanvasSrv.format({
      stroke: new PenRgb(red, green, blue)
    });
  }

  async save() {
    const alert = await this.alertController.create({
      header: 'Please enter the name',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Save',
          role: 'confirm',
          handler: (evt) => {
            if(evt.name) {
              if(localStorage.getItem(evt.name)) {
                // ya existe
                this.alertController.create({
                  header: 'Are you sure to replace a previos document?',
                  buttons: [
                    {
                      text: 'Cancel',
                      role: 'cancel',
                    },
                    {
                      text: 'OK',
                      role: 'confirm',
                      handler: () => {
                        localStorage.setItem(evt.name, this.whiteCanvasSrv.save());
                      },
                    },
                  ],
                }).then(d => d.present());
              } else {
                localStorage.setItem(evt.name, this.whiteCanvasSrv.save());
              }
            }
          },
        },
      ],
      inputs: [
        {
          placeholder: 'Name',
          name: 'name'
        },
      ],
    });
    alert.present();
  }

  async load() {
    const alert = await this.alertController.create({
      header: 'Please enter the name',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Load',
          role: 'confirm',
          handler: (evt) => {
            if(evt.name) {
              if(!localStorage.getItem(evt.name)) {
                // ya existe
                this.alertController.create({
                  header: 'File doesn`t exists',
                  buttons: [
                    {
                      text: 'Ok',
                      role: 'ok',
                    },
                  ],
                }).then(d => d.present());
              } else {
                this.whiteCanvasSrv.load(localStorage.getItem(evt.name));
              }
            }
          },
        },
      ],
      inputs: [
        {
          placeholder: 'Name',
          name: 'name'
        },
      ],
    });
    alert.present();
  }

  async trash() {
    const alert = await this.alertController.create({
      header: 'Are you sure to clear all?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.whiteCanvasSrv.erease();
          },
        },
      ],
    });
    await alert.present();
  }

}
