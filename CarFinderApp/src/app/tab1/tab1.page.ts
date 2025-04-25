import { Component } from '@angular/core';
import { AutoService } from 'src/services/auto.service';
import { Auto } from 'src/models/auto.model';
import { AdMob } from '@capacitor-community/admob';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page {
  nuevoAuto: Auto = {
    id: '',
    patente: '',
    descripcion: '',
    esPropietario: false,
    status: 'robado',
    notificaciones: [],
    userEmail: '',
  };
  patenteError: boolean = false;
  interstitialShown: boolean = false;

  constructor(private autoService: AutoService) {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    if (loggedInUser && loggedInUser.email) {
      this.mostrarAnuncioInterstitial();
    }
  }

  async mostrarAnuncioInterstitial() {
    if (this.interstitialShown) return;
    this.interstitialShown = true;

    try {
      await AdMob.prepareInterstitial({
        adId: 'ca-app-pub-3940256099942544/1033173712', // ID oficial de prueba de Google
        isTesting: true,
      });

      await AdMob.showInterstitial();
    } catch (error) {
      console.warn('Error mostrando interstitial:', error);
    }
  }

  async reportarAuto() {
    if (this.nuevoAuto.patente.length < 6) {
      this.patenteError = true;
      return;
    } else {
      this.patenteError = false;
    }

    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    if (loggedInUser && loggedInUser.email) {
      this.nuevoAuto.userEmail = loggedInUser.email;
      this.nuevoAuto.id = this.autoService.generateAutoId();

      const patenteNormalizada = this.autoService.normalizarPatente(this.nuevoAuto.patente);
      const autoEncontrado = await this.autoService.searchAutoByPatente(patenteNormalizada);

      if (autoEncontrado) {
        await this.autoService.mostrarDialogo('Error', 'Esta patente ya ha sido reportada.');
      } else {
        const agregadoExitoso = await this.autoService.addAuto(this.nuevoAuto);
        if (agregadoExitoso) {
          await this.autoService.mostrarDialogo('Éxito', 'Auto reportado exitosamente.');
          this.limpiarFormulario();
        }
      }
    } else {
      await this.autoService.mostrarDialogo('Error', 'Debes estar logueado para reportar un auto.');
    }
  }

  limpiarFormulario() {
    this.nuevoAuto = {
      id: '',
      patente: '',
      descripcion: '',
      esPropietario: false,
      status: 'robado',
      notificaciones: [],
      userEmail: '',
    };
  }
}
