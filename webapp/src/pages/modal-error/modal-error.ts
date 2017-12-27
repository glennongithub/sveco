import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, } from 'ionic-angular';

/**
 * Generated class for the ModalErrorPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-error',
  templateUrl: 'modal-error.html',
})
export class ModalErrorPage {
  errorMessage: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private view: ViewController) {
    this.errorMessage = navParams.get('errorMessage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalErrorPage');
  }

  closeErrorModal()
  {
    this.view.dismiss();
  }

}
