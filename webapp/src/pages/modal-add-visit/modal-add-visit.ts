import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {location, visit, user} from "../../model/location.model"
import {LocationsProvider} from "../../providers/locations-provider/locations-provider";

/**
 * Generated class for the ModalAddVisitPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-modal-add-visit',
  templateUrl: 'modal-add-visit.html',
})
export class ModalAddVisitPage {

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
    this.visit = {
      visitDate: d.toISOString(),
      user: this.user,
      status: 'not_at_home',
      note: 'test',
      locationId: this.location.id //must be set when adding new visit to till what location it belongs to
    };
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
    console.log('ionViewDidLoad ModalAddVisitPage');
  }

  addVisit()
  {
    console.log(this.visit);

    // lets kill the apiKey and fullname in user since that is not set correctly anyways
    // we could set them .. but server do not need them to be able to connect to correct user .. unique username is enough
    //delete this.visit.user.apiKey;
    //delete this.visit.user.fullname;

    //now push it to locationsProvider copy of what we work with

    this.locationsProvider.addVisitToLocation(this.visit).then((addedVisit) => {
      //navigate back to locations.  ionWilShow makes sure it reloads with updated data
      console.log('This was added');
      console.log(addedVisit);
      //this.navCtrl.pop();
      this.viewCtrl.dismiss(); //makes it possible to  send data back to parent .. if handler set up properly there

    });

  }

}
