import { Component } from '@angular/core';

import { LocationsPage } from '../locations/locations';
import { SettingsPage } from '../settings/settings';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab3Root = SettingsPage;

  constructor() {

  }
}
