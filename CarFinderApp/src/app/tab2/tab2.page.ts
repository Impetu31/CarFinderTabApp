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
  estadoObservado: string = '';
  autoEncontrado: Auto | null = null;
  imagenBase64: string = '';
  interstitialShown: boolean = false;
  mostrarFormulario: boolean = false;

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
    this.autoEncontrado = null;
    this.mostrarFormulario = false;

    const patenteNormalizada = this.autoService.normalizarPatente(this.patente);
    const auto = await this.autoService.searchAutoByPatente(patenteNormalizada);

    if (!auto) {
      await this.autoService.mostrarDialogo(
        'No encontrado',
        `No se encontró ningún auto con la patente: ${this.patente}`
      );
      return;
    }

    if (auto.status === 'recuperado') {
      await this.autoService.mostrarDialogo(
        'Auto Recuperado',
        'Este vehículo ya fue recuperado. No es necesario enviar una nueva notificación.'
      );
      return;
    }

    this.autoEncontrado = auto;
    this.mostrarFormulario = true;

    await this.autoService.mostrarDialogo(
      'Auto robado encontrado',
      '🚨 Has encontrado una patente reportada por robo. Por favor brinda ubicación, estado observado y una foto para ayudar al dueño a recuperarlo.'
    );
  }

  async enviarNotificacion() {
    if (this.autoEncontrado) {
      const mensajeCompleto = `${this.direccion} - Estado: ${this.estadoObservado}`;
      await this.autoService.enviarNotificacion(
        this.autoEncontrado,
        mensajeCompleto,
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
    this.estadoObservado = '';
    this.autoEncontrado = null;
    this.imagenBase64 = '';
    this.mostrarFormulario = false;
  }
}
