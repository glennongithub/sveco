import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, } from 'ionic-angular';

/**
 * Generated class for the ModalSortPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-sort',
  templateUrl: 'modal-sort.html',
})
export class ModalSortPage {
  constructor(public navCtrl: NavController, public navParams: NavParams, private view: ViewController) {

  }


  items = [
      'Newest',
      'Oldest',
      'A-Z',
      'Z-A'
  ];

  itemSelected(item: string) {
    console.log("Selected Item", item);
  }

  ionViewDidLoad() {
      console.log('ionViewDidLoad ModalSortPage');
  }

  closeSortModal()
  {
      this.view.dismiss();
  }

}
