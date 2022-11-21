import { PenRgb } from './../white-canvas/objects';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { PenModes, Point } from '../white-canvas/objects';
import { WhitecanvasService } from '../white-canvas/whitecanvas.service';
import { AlertController, ModalController } from '@ionic/angular';
import { DocumentsComponent } from './documents/documents.component';
import { SaveComponent } from './save/save.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {

  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('window') window: ElementRef<HTMLCanvasElement>;
  @ViewChild('content') content: ElementRef<HTMLImageElement>;

  public mode: PenModes = PenModes.PAINT;
  public stroke = new PenRgb(0, 0, 0);
  public lineWidth = localStorage.getItem('-CFG-CUSTOM-L') ? parseInt(localStorage.getItem('-CFG-CUSTOM-L'), 10) : 2;
  public zoom = localStorage.getItem('-CFG-CUSTOM-Z') ? parseInt(localStorage.getItem('-CFG-CUSTOM-Z'), 10) : 2;
  public openedFileID?: string;

  public screensMultiplier = {
    width: localStorage.getItem('-CFG-CUSTOM-W') ? parseFloat(localStorage.getItem('-CFG-CUSTOM-W')) : 2.5,
    height: localStorage.getItem('-CFG-CUSTOM-H') ? parseFloat(localStorage.getItem('-CFG-CUSTOM-H')) : 2.5,
  };

  public sizeCanvas = {
    width: 1,
    height: 1,
  };

  public windowSize = {
    width: 0,
    height: 0
  };

  public mousePosition = new Point();

  constructor(private readonly whiteCanvasSrv: WhitecanvasService,
              private readonly alertController: AlertController,
              private readonly modalCtrl: ModalController) { }

  async openSketch() {
    const modal = await this.modalCtrl.create({
      component: DocumentsComponent
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    this.openedFileID = data?.fileID;
  }

  async saveSketch() {
    const modal = await this.modalCtrl.create({
      component: SaveComponent,
      componentProps: {
        openedFileID: this.openedFileID
      }
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
  }

  ngAfterViewInit(): void {
    this.windowSize.width = window.innerWidth;
    this.windowSize.height = window.innerHeight;
    this.window.nativeElement.width = this.windowSize.width / this.zoom;
    this.window.nativeElement.height = this.windowSize.height / this.zoom;
    this.sizeCanvas.width = this.windowSize.width * this.screensMultiplier.width;
    this.sizeCanvas.height = this.windowSize.height * this.screensMultiplier.height;
    this.canvas.nativeElement.width = this.sizeCanvas.width;
    this.canvas.nativeElement.height = this.sizeCanvas.height;
    this.whiteCanvasSrv.initCanvas(this.canvas.nativeElement, this.window.nativeElement, this.zoom);
    this.whiteCanvasSrv.format({
      lineWidth: this.lineWidth,
      stroke: this.stroke
    });
    addEventListener('touchmove', (e) => {
      this.mousePosition.x = e.touches[0].clientX;
      this.mousePosition.y = e.touches[0].clientY;
    });
    this.openSketch();
  }

  async expand() {
    const alert = await this.alertController.create({
      header: 'Size of screen (change this clear draw)',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Save',
          role: 'confirm',
          handler: (evt) => {
            const width = parseFloat(evt.width);
            if (width > 0) {
              localStorage.setItem('-CFG-CUSTOM-W', width.toString());
            }
            const height = parseFloat(evt.height);
            if (height > 0) {
              localStorage.setItem('-CFG-CUSTOM-H', height.toString());
            }
            window.location.reload();
          }
        }
      ],
      inputs: [
        {
          placeholder: 'Width screens (2.5)',
          name: 'width',
          value: this.screensMultiplier.width
        },
        {
          placeholder: 'Height screens (2.5)',
          name: 'height',
          value: this.screensMultiplier.height
        },
      ],
    });
    alert.present();
  }

  async zoomPopup() {
    const alert = await this.alertController.create({
      header: 'Zoom (change this clear draw)',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Save',
          role: 'confirm',
          handler: (evt) => {
            const zoom = parseFloat(evt.zoom);
            if (zoom > 0) {
              localStorage.setItem('-CFG-CUSTOM-Z', zoom.toString());
            }
            window.location.reload();
          }
        }
      ],
      inputs: [
        {
          placeholder: 'Zoom (2)',
          name: 'zoom',
          value: this.zoom
        }
      ],
    });
    alert.present();
  }

  async brushSize() {
    const alert = await this.alertController.create({
      header: 'Please enter the fiber size',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Apply',
          role: 'confirm',
          handler: (evt) => {
            if(evt.size) {
              const size = parseInt(evt.size, 10);
              if(size) {
                localStorage.setItem('-CFG-CUSTOM-L', size.toString());
                this.whiteCanvasSrv.format({
                  lineWidth: size
                });
                this.lineWidth = size;
              }
            }
          },
        },
      ],
      inputs: [
        {
          placeholder: 'Size',
          name: 'size',
          value: this.lineWidth
        },
      ],
    });
    alert.present();
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

  save() {
    this.saveSketch();
  }

  async _save() {
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
            if (evt.name) {
              if (localStorage.getItem(evt.name)) {
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

  load() {
    this.openSketch();
  }

  async _load() {
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
            if (evt.name) {
              if (!localStorage.getItem(evt.name)) {
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

  center() {
    this.whiteCanvasSrv.centerWindow();
  }
}
