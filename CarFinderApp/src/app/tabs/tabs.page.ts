import { Component } from '@angular/core';
import { AdMob } from '@capacitor-community/admob';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  constructor() {
    AdMob.hideBanner(); // 👈 También aquí por precaución
  }
}