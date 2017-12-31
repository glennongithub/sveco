import { Injectable } from '@angular/core';
import {location} from "../../model/location.model";
import {CustomApiProvider} from "../custom-api/custom-api";


@Injectable()
export class LocationsProvider {

    private locations:location[];

    constructor(
        private customApi: CustomApiProvider,
    ) {

        console.log('constructing Locations Provider');


    }

    addLocation(location: location) {

    }

    updateLocation(location: location) {
        // if a copy of locations is used .. not ref . we need to update the location in
    }

    getLocations() {
        return this.locations.slice(); //slice apparently returns a copy instead of a ref.
    }

    loadRemoteLocations() {
        return new Promise((resolve, reject) => {
            this.customApi.getLocations().subscribe(
                data => { //a successful connection
                    console.log(data);
                    this.locations = data;
                    //always remove overlay when done
                    resolve("OK");
                    /** always make sure to handle failed connections*/
                } , errdata => { //failed connection
                    //always remove overlay when done
                    reject("Connection to server totally failed when running whoami ;( ! Errors was: "+errdata.statusText);

                }
            );
        });
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

    }

    findItemById(lookingAtItem) {
        return lookingAtItem.id === this;
    }

}
