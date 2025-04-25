import { Component } from '@angular/core';
import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  constructor() {
    this.mostrarBanner();
  }

  async mostrarBanner() {
    try {
      await AdMob.initialize();
      await AdMob.showBanner({
        adId: 'ca-app-pub-3940256099942544/6300978111', // Banner oficial de prueba
        adSize: BannerAdSize.ADAPTIVE_BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
        isTesting: true,
      });
    } catch (error) {
      console.warn('Error mostrando banner en HOME:', error);
    }
  }
}
