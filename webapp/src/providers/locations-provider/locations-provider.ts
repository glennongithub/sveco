import { Injectable } from '@angular/core';
import {location, area} from "../../model/location.model";
import {CustomApiProvider} from "../custom-api/custom-api";
import {LoadingController} from "ionic-angular";


@Injectable()
export class LocationsProvider {

    private locations:location[];
    private areas:area[];
    loader:any;

    constructor(
        private customApi: CustomApiProvider,
        public loadingCtrl: LoadingController, //adding this to test if I can control spinner popping from here
    ) {

        console.log('constructing Locations Provider');
        //why not always load remote data to local .. if we want to rel on local data
        //this.loadRemoteAreas();
        //this.loadRemoteLocations();
    }

    // make async so we always return a promise and can await if we want.
    async addLocation(addedLocation: location, waitForResolve: boolean = true) {
        //make sure to update local copy with it
        this.locations.push(addedLocation);

        // Now do the api-stuff  comment this if we don't use it
        try {
            // then make sure backend is updated to.
            // should return the updated location
            if(waitForResolve) {
                // pop spinner
                this.loader = this.loadingCtrl.create({
                    content:"Talking to server: adding location",
                });
                //pop overlay
                this.loader.present();
                // wait for com to finish
                addedLocation = await this.customApi.addLocation(addedLocation);
                // remove spinner
                this.loader.dismiss();

            }
            else
                this.customApi.addLocation(addedLocation); //ignoring promise intentionally


        } catch (e) {
            console.log('catch in locations-provider .. addLocation waiting for resolve. :'+e.toString());
        }

        //always return the added location
        return addedLocation;
    }

    // make async so we always return a promise and can await if we want.
    async updateLocation(location: location, waitForResolve: boolean = true) {
        let updatedLocation;
        // first update corresponding item in this master array
        // and take back the updated item.
        updatedLocation = this.updateLocationInLocations(location);

        // Now do the api-stuff  comment this if we don't use it
            try {
                // then make sure backend is updated to.
                // should return the updated location
                if(waitForResolve) {
                    // pop spinner
                    this.loader = this.loadingCtrl.create({
                        content:"Talking to server",
                    });
                    //pop overlay
                    this.loader.present();
                    // wait for com to finish
                    updatedLocation = await this.customApi.updateLocation(location);
                    // remove spinner
                    this.loader.dismiss();

                }
                else
                    this.customApi.updateLocation(location); //ignoring promise intentionally
            } catch (e) {
                console.log('catch in locations-provider .. updateLocation waiting for resolve. :'+e.toString());
            }

        // always return copy of current state of locationsArray
        return updatedLocation;
    }

    getLocations() {
        //if nothing loaded to locations yet. just return empty array
        if (!this.locations)
            return this.locations;
        //else return copy of locations
        return this.locations.slice(); //slice apparently returns a copy instead of a ref.
    }

    getAreas() {
        return this.areas.slice(); //slice apparently returns a copy instead of a ref.
    }

    async loadRemoteLocations() {
        try {
            // pop spinner
            this.loader = this.loadingCtrl.create({
                content:"Talking to server: loading locations",
            });
            //pop overlay
            this.loader.present();
            this.locations = await this.customApi.getLocations();
            // remove spinner
            this.loader.dismiss();
            return this.getLocations();
        } catch (e) {
            console.log(e.toString())
        }
    }

    async loadRemoteAreas() {
        try {
            // pop spinner
            this.loader = this.loadingCtrl.create({
                content:"Talking to server: loading areas",
            });
            //pop overlay
            this.loader.present();
            this.areas = await this.customApi.getAreas();
            // remove spinner
            this.loader.dismiss();
            return this.getAreas();
        } catch (e) {
            console.log(e.toString())
        }
    }




    //*************************/
    /* Supportfunctions bellow*/

    // this is a function that just loops through the array using id to look for the matching item
    // so kind of important function here .. so we know that we can keep the local copy of locations uptodate with what
    // we updated on server via api .. instead of always refetch everything.
    updateLocationInLocations(updatedLocation: location){
        let itemToUpdateFromArray = this.locations.find(this.findItemById, updatedLocation.id);

        // Find the correct index
        let index = this.locations.indexOf(itemToUpdateFromArray);

        // Update the actual item in array
        this.locations[index] = updatedLocation;
        return this.locations[index];
    }

    findItemById(lookingAtItem) {
        return lookingAtItem.id === this;
    }

}
