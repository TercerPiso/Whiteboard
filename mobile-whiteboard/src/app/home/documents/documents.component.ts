import { FileData, TFile } from './../../fileserver/pojos';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { FileserverService } from 'src/app/fileserver/fileserver.service';
import { Folder } from 'src/app/fileserver/pojos';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
})
export class DocumentsComponent implements OnInit {

  public folders: Folder[];
  public filesInfolder: TFile[];
  public folderSelectedID?: string;

  constructor(private readonly modal: ModalController,
              private readonly fsSrv: FileserverService,
              private readonly alertController: AlertController) { }

  ngOnInit() {
    this.folders = this.fsSrv.getFolders();
  }

  selectFolder(id: string) {
    this.folderSelectedID = id;
    this.filesInfolder = this.fsSrv.getFolderContent(id);
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm(fileID: string) {
    this.modal.dismiss({
      fileID
    }, 'confirm');
  }

  async newFolder() {
    const alert = await this.alertController.create({
      header: 'Folder name',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Save',
          role: 'confirm',
          handler: (evt) => {
            const name = evt.fname.trim();
            this.fsSrv.addFolder(name);
          }
        }
      ],
      inputs: [
        {
          placeholder: 'Name',
          name: 'fname',
        },
      ],
    });
    alert.present();
  }

  async newFile(folderID: string) {
    const alert = await this.alertController.create({
      header: 'File name',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Save',
          role: 'confirm',
          handler: (evt) => {
            const name = evt.fname.trim();
            const fileID = this.fsSrv.saveFile(folderID, name, new FileData());
            this.confirm(fileID);
          }
        }
      ],
      inputs: [
        {
          placeholder: 'Name',
          name: 'fname',
        },
      ],
    });
    alert.present();
  }

  removeFolder(folderID: string) {
    this.fsSrv.removeFolder(folderID);
  }

  removeFile(fileID: string) {
    this.fsSrv.removeFile(fileID);
  }

}
