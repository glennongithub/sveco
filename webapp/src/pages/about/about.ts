import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

 fakeApiData :any;
  constructor(public navCtrl: NavController) {
    this.fakeApiData = [
        {
          id: 1,
          name: 'Glenn'
        },
        {
          id: 2,
          name: 'Glenn2'
        },
      ];
    }

}
