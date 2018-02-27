import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {location, visit, user} from "../../model/location.model"
import {LocationsProvider} from "../../providers/locations-provider/locations-provider";

/**
 * Generated class for the ModalViewVisitPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-modal-view-visit',
  templateUrl: 'modal-view-visit.html',
})
export class ModalViewVisitPage {

  visit:visit;
  location:location;
  user: user;
  availableUsers: user[];
  posibleStatuses = [
      {statusValue: 'not_at_home', statusLabel: 'Not at home'},
      {statusValue: 'interested', statusLabel: 'Interested'},
      {statusValue: 'not_interested', statusLabel: 'Not interested'},
    ];


  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, public locationsProvider: LocationsProvider) {
    //set our local var to the location this should be added to
    let d = new Date;
    console.log(d.toISOString());
    this.location = navParams.get('location');
    this.user = navParams.get('user');
    this.visit = navParams.get('visit');
    /*fetch available users.. maybe should it only have self for regular users .. and all users for admins .. to let them create visits*/
    this.availableUsers = [
      this.user,
      {
        username: 'John',
        fullname: 'John Doe'
      },
      //and so on .. this will we a list fetched from server later on
    ];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalViewVisitPage');
  }


  cancel()
  {
      this.viewCtrl.dismiss();
  }

}
