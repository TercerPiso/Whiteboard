import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-save',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.scss'],
})
export class SaveComponent implements OnInit {

  @Input() openedFileID?: string;

  constructor(private readonly modal: ModalController) { }

  ngOnInit() {}

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss({}, 'confirm');
  }

}
