import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { CustomApiProvider } from '../../providers/custom-api/custom-api';
import { ModalErrorPage } from "../modal-error/modal-error";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  loader: any;

  constructor(public navCtrl: NavController,
              private modal: ModalController,
              public loadingCtrl: LoadingController,
              private customApi: CustomApiProvider) {
    //needs to be recreated each time
    this.loader = this.loadingCtrl.create({
      content:"Talking to server",
    });
    //pop overlay
    this.loader.present();

    this.customApi.init()
        .then(message => {
          //all fine just remove overlay
          this.loader.dismiss();
        })
        .catch(message => {
          //ok we got an error  ..
          //first remove overlay spinner
          this.loader.dismiss();

          //somehow force tab3  settings.
          //this.navCtrl.setRoot(SettingsPage);
          this.navCtrl.parent.select(2);
          //then show message
          const errorModal = this.modal.create(ModalErrorPage, {errorMessage: message});
          errorModal.present();
        });
  }

}
