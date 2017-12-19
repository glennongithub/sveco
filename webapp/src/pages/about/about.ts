import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { LocationPage } from '../location/location';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html',

})

export class AboutPage {

    location = LocationPage;

 fakeApiData :any;
  constructor(public navCtrl: NavController) {
    this.fakeApiData = [
        {
            id: 1,
            type: 'appartment',
            address: 'Vista Alegre 24, 07015 Palma de Mallorca',
            status: 'unknown',
            language: 'swedish',
            visits: '3',
            note: 'This was a strange address'
        },
        {
            id: 2,
            type: 'house',
            address: 'Köpenhamnsvägen 15b, 26135 Malmö',
            status: 'unknown',
            language: 'norweigan',
            visits: '3',
            note: 'This was a strange address'
        },
        {
            id: 1,
            type: 'appartment',
            address: 'Vista Alegre 24, 07015 Palma de Mallorca',
            status: 'unknown',
            language: 'swedish',
            visits: '3',
            note: 'This was a strange address'
        },
        {
            id: 2,
            type: 'house',
            address: 'Köpenhamnsvägen 15b, 26135 Malmö',
            status: 'unknown',
            language: 'norweigan',
            visits: '3',
            note: 'This was a strange address'
        },
        {
            id: 1,
            type: 'appartment',
            address: 'Vista Alegre 24, 07015 Palma de Mallorca',
            status: 'unknown',
            language: 'danish',
            visits: '3',
            note: 'This was a strange address'
        },
        {
            id: 2,
            type: 'house',
            address: 'Köpenhamnsvägen 15b, 26135 Malmö',
            status: 'unknown',
            language: 'swedish',
            visits: '3',
            note: 'This was a strange address'
        },
        {
            id: 1,
            type: 'appartment',
            address: 'Vista Alegre 24, 07015 Palma de Mallorca',
            status: 'unknown',
            language: 'norweigan',
            visits: '3',
            note: 'This was a strange address'
        },
        {
            id: 2,
            type: 'house',
            address: 'Köpenhamnsvägen 15b, 26135 Malmö',
            status: 'unknown',
            language: 'danish',
            visits: '3',
            note: 'This was a strange address'
        },
        {
            id: 1,
            type: 'appartment',
            address: 'Vista Alegre 24, 07015 Palma de Mallorca',
            status: 'unknown',
            language: 'swedish',
            visits: '3',
            note: 'This was a strange address'
        },
        {
            id: 2,
            type: 'house',
            address: 'Köpenhamnsvägen 15b, 26135 Malmö',
            status: 'unknown',
            language: 'norweigan',
            visits: '3',
            note: 'This was a strange address'
        },
        {
            id: 1,
            type: 'appartment',
            address: 'Vista Alegre 24, 07015 Palma de Mallorca',
            status: 'unknown',
            language: 'norweigan',
            visits: '3',
            note: 'This was a strange address'
        },
        {
            id: 2,
            type: 'house',
            address: 'Köpenhamnsvägen 15b, 26135 Malmö',
            status: 'unknown',
            language: 'swedish',
            visits: '3',
            note: 'This was a strange address'
        },
      ];
    }

}
