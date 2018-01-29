import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalAddVisitPage } from './modal-add-visit';

@NgModule({
  declarations: [
    ModalAddVisitPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalAddVisitPage),
  ],
})
export class ModalAddVisitPageModule {}
