import { Component, NgZone } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the GogletestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-gogletest',
  templateUrl: 'gogletest.html',

})
export class GogletestPage {
    GoogleAutocomplete:any;
    autocomplete:any;
    autocompleteItems:any;
    lat:any;
    long:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private zone: NgZone, private geolocation: Geolocation) {
      this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
      this.autocomplete = { input: '' };
      this.autocompleteItems = [];
      this.geolocation.getCurrentPosition().then((resp) => {
              this.lat=resp.coords.latitude;
              this.long=resp.coords.longitude;
      }).catch((error) => {
          console.log('Error getting location', error);
      });
  }

    ionViewDidLoad() {
    console.log('ionViewDidLoad GogletestPage');
    }

    updateSearchResults(){

        var defaultBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(this.lat, this.long)
        );

        console.log(defaultBounds);
        if (this.autocomplete.input == '') {
            this.autocompleteItems = [];
            return;
        }
        this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input, bounds: defaultBounds },
            (predictions, status) => {
                this.autocompleteItems = [];
                this.zone.run(() => {
                    predictions.forEach((prediction) => {
                        this.autocompleteItems.push(prediction);
                    });
                });
            });
        }
}

