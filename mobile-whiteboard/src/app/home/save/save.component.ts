import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { FileserverService } from 'src/app/fileserver/fileserver.service';
import { FileData, FolderOutput } from 'src/app/fileserver/pojos';

@Component({
  selector: 'app-save',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.scss'],
})
export class SaveComponent implements OnInit {

  @Input() openedFileID?: string;
  public folders: FolderOutput[];
  public selectedFolderID?: string;

  constructor(
    private readonly modal: ModalController,
    private readonly fsSrv: FileserverService,
    private readonly alertController: AlertController
  ) { }

  ngOnInit() {
    this.fsSrv.getFolders().subscribe(d => {
      this.folders = d;
    }, e => {
      alert('error');
      console.error(e);
      // FIXME
    });
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  async confirm() {
    if(this.selectedFolderID) {
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
              // TODO: add content
              const fileID = this.fsSrv.saveFile(this.selectedFolderID, name, new FileData());
              this.modal.dismiss({fileID}, 'confirm');
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
      return;
    }
    if(this.openedFileID) {
      // TODO: add content
      this.fsSrv.saveWithID(this.openedFileID, new FileData());
      this.modal.dismiss({fileID: this.openedFileID}, 'confirm');
    }
  }

  async selectFolder(folderID: string) {
    this.selectedFolderID = folderID;
  }

  removeFolder(folderID: string) {
    this.fsSrv.removeFolder(folderID);
  }

  newFolder() {
    // TODO
  }

}
