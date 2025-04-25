import { Component } from '@angular/core';
import { AutoService } from 'src/services/auto.service';
import { Auto } from 'src/models/auto.model';
import { AdMob } from '@capacitor-community/admob';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page {
  patente: string = '';
  direccion: string = '';
  autoEncontrado: Auto | null = null;
  imagenBase64: string = '';
  interstitialShown: boolean = false;

  constructor(private autoService: AutoService) {
    this.mostrarAnuncioInterstitial();
  }

  async mostrarAnuncioInterstitial() {
    if (this.interstitialShown) return;
    this.interstitialShown = true;

    try {
      await AdMob.prepareInterstitial({
        adId: 'ca-app-pub-3940256099942544/1033173712',
        isTesting: true,
      });
      await AdMob.showInterstitial();
    } catch (error) {
      console.warn('Error mostrando interstitial en Tab2:', error);
    }
  }

  async buscarAuto() {
    const patenteNormalizada = this.autoService.normalizarPatente(this.patente);
    const auto = await this.autoService.searchAutoByPatente(patenteNormalizada);

    if (auto) {
      this.autoEncontrado = auto;
    } else {
      await this.autoService.mostrarDialogo(
        'Error',
        'No se encontró ningún auto con la patente: ' + this.patente
      );
    }
  }

  async enviarNotificacion() {
    if (this.autoEncontrado) {
      await this.autoService.enviarNotificacion(
        this.autoEncontrado,
        this.direccion,
        this.imagenBase64
      );
      await this.autoService.mostrarDialogo(
        'Éxito',
        'Notificación enviada al dueño del auto.'
      );
      this.limpiarFormulario();
    }
  }

  onImageSelected(base64Image: string | undefined) {
    this.imagenBase64 = base64Image || '';
  }

  limpiarFormulario() {
    this.patente = '';
    this.direccion = '';
    this.autoEncontrado = null;
    this.imagenBase64 = '';
  }
}
