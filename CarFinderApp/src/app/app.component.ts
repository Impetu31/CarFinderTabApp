import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AdMob } from '@capacitor-community/admob';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private platform: Platform) {
    this.platform.ready().then(() => {
      this.inicializarAdmobGlobal();
    });
  }

  async inicializarAdmobGlobal() {
    try {
      await AdMob.initialize();
    } catch (error) {
      console.warn('Error inicializando AdMob global:', error);
    }
  }
}
