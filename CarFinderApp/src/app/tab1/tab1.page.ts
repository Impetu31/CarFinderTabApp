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
    anio: 0,
    color: '',
    marca: '',
    modelo: ''
  };

  patenteError = false;
  camposIncompletos = false;
  interstitialShown = false;

  constructor(private autoService: AutoService) {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    if (loggedInUser?.email) {
      this.mostrarAnuncioInterstitial();
    }
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
      console.warn('Error mostrando interstitial:', error);
    }
  }

  async reportarAuto() {
    this.patenteError = false;
    this.camposIncompletos = false;

    if (this.nuevoAuto.patente.length < 6) {
      this.patenteError = true;
      return;
    }

    const { descripcion, marca, modelo, color, anio } = this.nuevoAuto;
    if (!descripcion || !marca || !modelo || !color || anio < 1900) {
      this.camposIncompletos = true;
      return;
    }

    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    if (!loggedInUser?.email) {
      await this.autoService.mostrarDialogo('Error', 'Debes estar logueado para reportar un auto.');
      return;
    }

    this.nuevoAuto.userEmail = loggedInUser.email;
    const patenteNormalizada = this.autoService.normalizarPatente(this.nuevoAuto.patente);
    this.nuevoAuto.patente = patenteNormalizada;

    const existente = await this.autoService.searchAutoByPatente(patenteNormalizada);
    if (existente) {
      await this.autoService.mostrarDialogo('Error', 'Esta patente ya ha sido reportada.');
      return;
    }

    const success = await this.autoService.addAuto(this.nuevoAuto);
    if (success) {
      await this.autoService.mostrarDialogo('Éxito', 'Auto reportado exitosamente.');
      this.limpiarFormulario();
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
      anio: 0,
      color: '',
      marca: '',
      modelo: ''
    };
  }
}
