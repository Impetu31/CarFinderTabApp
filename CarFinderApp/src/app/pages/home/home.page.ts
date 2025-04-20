import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import {
  AdMob,
  BannerAdOptions,
  BannerAdSize,
  BannerAdPosition
} from '@capacitor-community/admob';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  constructor(private platform: Platform) {
    this.platform.ready().then(() => {
      this.mostrarBanner();
    });
  }

  async mostrarBanner() {
    await AdMob.initialize();

    const options: BannerAdOptions = {
      adId: 'ca-app-pub-3940256099942544/6300978111', // 👉 Banner de prueba oficial de Google
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: true
    };

    await AdMob.showBanner(options);
  }
}
