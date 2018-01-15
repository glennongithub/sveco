import {Component, NgZone} from '@angular/core';
import {ViewController} from 'ionic-angular';
import {Geolocation} from "@ionic-native/geolocation";

@Component({
    selector: 'page-addressAutocomplete',
    templateUrl: 'addressAutocomplete.html'
})

export class AddressAutocompletePage {
    autocompleteItems;
    autocomplete;
    service = new google.maps.places.AutocompleteService();
    pos:{
        lat: any,
        lng: any
    };
    map:any;
    marker:any;

    selectedItem:any;
    dataToSaveInDB:any;

    constructor (public viewCtrl: ViewController, private zone: NgZone, private geolocation: Geolocation,) {
        this.autocompleteItems = [];
        this.autocomplete = {
            query: ''
        };
        this.geolocation.getCurrentPosition().then((resp) => {
            this.pos = {
                lat:resp.coords.latitude,
                lng:resp.coords.longitude
            };


            /*** showing map */
                this.map = new google.maps.Map(document.getElementById('map'), {
                center: this.pos,
                zoom: 13
            });
            /** */

        }).catch((error) => {
            console.log('Error getting location', error);
        });


    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    chooseItem(item: any) {

        this.selectedItem = item;
        this.autocomplete.query = item.description;
        let request = { placeId: item.place_id };
        console.log('item selected'+item);


        //let service = new google.maps.places.PlacesService(document.createElement('div'));
        let service = new google.maps.places.PlacesService(this.map);

        // todo pop spinner so we know we are waiting for something
        service.getDetails(request, (place, status) => {
            if (status == google.maps.places.PlacesServiceStatus.OK) {

                this.dataToSaveInDB = this.parsePlaceToCustomData(place);
                //tack on placd_id used when retrieving this place
                this.dataToSaveInDB['place_id'] = item.place_id;


                //Update map center pos
                this.pos.lat = place.geometry.location.lat();
                this.pos.lng = place.geometry.location.lng();

                let name = place.name;
                //Trying to drop marker to
                if(this.marker)
                    this.marker.setMap(null); //kill previous marker

                this.marker = new google.maps.Marker({
                    position: this.pos,
                    map: this.map,
                    title: name
                });

                this.map.setCenter(this.pos);

                // tohandle several markers see https://developers.google.com/maps/documentation/javascript/examples/marker-remove

                console.log(this.dataToSaveInDB);
                this.autocompleteItems = [];

                 //todo remove spinner
            }

        });


    }

    useSelectedAddress()
    {
        this.viewCtrl.dismiss({selectedItem: this.selectedItem, parsedData:this.dataToSaveInDB});
    }

    updateSearch() {
        let defaultBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(this.pos.lat, this.pos.lng)
        );

        if (this.autocomplete.query == '') {
            this.autocompleteItems = [];
            return;
        }
        let me = this;
        this.service.getPlacePredictions({ input: this.autocomplete.query, bounds: defaultBounds }, function (predictions, status) {
            me.autocompleteItems = [];
            me.zone.run(function () {
                predictions.forEach(function (prediction) {
                    me.autocompleteItems.push(prediction);
                });
            });
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