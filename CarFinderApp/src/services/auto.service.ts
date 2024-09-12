import { Injectable } from '@angular/core';
import { Auto } from 'src/models/auto.model';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AutoService {
  private autos: Auto[] = [];

  constructor(private alertController: AlertController) {
    const storedAutos = localStorage.getItem('autos');
    this.autos = storedAutos ? JSON.parse(storedAutos) : [];
  }

  async addAuto(auto: Auto): Promise<boolean> {
    const patenteNormalizada = this.normalizarPatente(auto.patente);

    if (patenteNormalizada.length !== 6) {
      await this.mostrarDialogo('Error', 'La patente debe tener exactamente 6 caracteres y no debe contener vocales.');
      return false;
    }

    const autoExists = this.autos.find((a) => a.patente === patenteNormalizada);
    if (autoExists) {
      await this.mostrarDialogo('Error', 'Esta patente ya ha sido reportada.');
      return false;
    }

    auto.patente = patenteNormalizada;
    this.autos.push(auto);
    this.saveToLocalStorage();
    return true;
  }

  getAutosByUser(userEmail: string): Auto[] {
    return this.autos.filter((auto) => auto.userEmail === userEmail);
  }

  async searchAutoByPatente(patente: string): Promise<Auto | null> {
    if (!patente) {
      await this.mostrarDialogo('Error', 'Debes ingresar una patente.');
      return null;
    }

    const patenteNormalizada = this.normalizarPatente(patente);
    const auto = this.autos.find((auto) => auto.patente === patenteNormalizada);

    if (!auto) {
      await this.mostrarDialogo('Auto no encontrado', `No se encontró ningún auto con la patente: ${patente}`);
      return null;
    }

    return auto;
  }

  updateAuto(auto: Auto): void {
    const index = this.autos.findIndex((a) => a.id === auto.id);
    if (index !== -1) {
      this.autos[index] = auto;
      this.saveToLocalStorage();
    }
  }

  deleteAuto(patente: string): void {
    const patenteNormalizada = this.normalizarPatente(patente);
    this.autos = this.autos.filter((auto) => auto.patente !== patenteNormalizada);
    this.saveToLocalStorage();
  }

  deleteAllAutosByUser(userEmail: string): void {
    this.autos = this.autos.filter((auto) => auto.userEmail !== userEmail);
    this.saveToLocalStorage();
  }

  private saveToLocalStorage() {
    localStorage.setItem('autos', JSON.stringify(this.autos));
  }

  private normalizarPatente(patente: string): string {
    return patente.toUpperCase().replace(/[AEIOU]/g, '');
  }

  private async mostrarDialogo(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
