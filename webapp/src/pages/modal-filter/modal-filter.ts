import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, } from 'ionic-angular';

/**
 * Generated class for the ModalFilterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-filter',
  templateUrl: 'modal-filter.html',
})
export class ModalFilterPage {
  constructor(public navCtrl: NavController, public navParams: NavParams, private view: ViewController) {

  }


  items = [
      'Close to me',
      'Visited sinze '
  ];

  itemSelected(item: string) {
    console.log("Selected Item", item);
  }

  ionViewDidLoad() {
      console.log('ionViewDidLoad ModalFilterPage');
  }

  closeFilterModal()
  {
      this.view.dismiss();
  }

}
