import { Component, NgZone } from '@angular/core';
import {} from '@types/googlemaps';
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
        console.log('ionViewDidLoad GoogletestPage');
    }

    updateSearchResults(){

        let defaultBounds = new google.maps.LatLngBounds(
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

    selectSearchResult (item) {
        let request = { placeId: item.place_id };
        console.log(item.place_id);

        let service = new google.maps.places.PlacesService(document.createElement('div'));

        service.getDetails(request, (place, status) => {
            if (status == google.maps.places.PlacesServiceStatus.OK) {

                let dataToSaveInDB = this.parsePlaceToCustomData(place);
                //tack on placd_id used when retrieving this place
                dataToSaveInDB['place_id'] = item.place_id;
                console.log(dataToSaveInDB);
            }
        });
    }

    parsePlaceToCustomData(place) {

        /*
          Define what fields/types in address_component part of the returned place we want to extract
          and whether to use long or short name
           */
        let address_parts = {
            street_number: 'short_name', //street-nr
            route: 'long_name', //Typ street-name
            postal_town: 'long_name', //city
            administrative_area_level_1: 'short_name', //typ skåne län
            country: 'long_name', //country
            postal_code: 'short_name' //postal_code
        };

        // the parsed obect we want to save in DB
        let parsedAddress = { /* init as empty and fill with same keys as in address_parts above*/ };

        // Get each component of the address from the place details
        // and fill the corresponding field on the form.
        place.address_components.forEach((addressRow)=> {
            let addressType = addressRow.types[0];
            if (address_parts[addressType] ) {
                parsedAddress[addressType] = addressRow[address_parts[addressType]];
            }
        });

        //add on long, lat
        parsedAddress['geolocation'] = {lng:place.geometry.location.lng(), lat:place.geometry.location.lat()};

        return parsedAddress;
    }
}
