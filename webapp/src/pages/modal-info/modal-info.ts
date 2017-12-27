import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ModalInfoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-info',
  templateUrl: 'modal-info.html',
})
export class ModalInfoPage {

  infoMessage: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, private view: ViewController) {
    this.infoMessage = navParams.get('infoMessage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalInfoPage');
  }

  closeInfoModal()
  {
    this.view.dismiss();
  }

}
