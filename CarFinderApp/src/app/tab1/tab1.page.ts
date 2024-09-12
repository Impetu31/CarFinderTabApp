import { Component } from '@angular/core';
import { AutoService } from 'src/services/auto.service';
import { Auto } from 'src/models/auto.model';
import { AlertController } from '@ionic/angular'; // Import AlertController

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page {

  nuevoAuto: Auto = {
    id: 0,
    patente: '',
    descripcion: '',
    esPropietario: false,
    status: 'robado', // Estado inicial como robado
    notificaciones: [],
    userEmail: '',
  };

  constructor(private autoService: AutoService, private alertController: AlertController) { }

  async reportarAuto() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      this.nuevoAuto.userEmail = user.email;
      this.nuevoAuto.id = Date.now();

      const patenteNormalizada = this.nuevoAuto.patente.toUpperCase().replace(/[AEIOU]/g, '');

      // Verificar si la patente ya existe
      const autoEncontrado = await this.autoService.searchAutoByPatente(patenteNormalizada);

      if (autoEncontrado) {
        this.mostrarAlerta('Error', 'Esta patente ya ha sido reportada.');
      } else {
        this.nuevoAuto.patente = patenteNormalizada;
        const resultado = await this.autoService.addAuto(this.nuevoAuto);

        if (resultado) {
          this.mostrarAlerta('Éxito', 'Auto reportado correctamente.');
          this.limpiarFormulario();
        }
      }
    } else {
      this.mostrarAlerta('Error', 'Debes estar logueado para reportar un auto.');
    }
  }

  limpiarFormulario() {
    this.nuevoAuto = {
      id: 0,
      patente: '',
      descripcion: '',
      esPropietario: false,
      status: 'robado', // Restablecer el estado a robado
      notificaciones: [],
      userEmail: '',
    };
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }
}
