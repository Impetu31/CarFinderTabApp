import { Component } from '@angular/core';
import { AutoService } from 'src/services/auto.service';
import { Auto } from 'src/models/auto.model';

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

  constructor(private autoService: AutoService) {}

  async reportarAuto() {
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
