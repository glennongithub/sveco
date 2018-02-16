import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalSortPage } from './modal-sort';

@NgModule({
  declarations: [
    ModalSortPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalSortPage),
  ],
})
export class ModalSortPageModule {}
