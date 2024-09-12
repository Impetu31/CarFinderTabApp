import { Component } from '@angular/core';
import { AutoService } from 'src/services/auto.service';
import { Auto } from 'src/models/auto.model';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page {
  patente: string = '';
  direccion: string = ''; // Declarar la propiedad 'direccion'
  autoEncontrado: Auto | null = null;

  constructor(private autoService: AutoService) { }

  async buscarAuto() {
    if (!this.patente) {
      alert('Por favor, ingresa una patente.');
      return;
    }

    const patenteNormalizada = this.patente.toUpperCase().replace(/[AEIOU]/g, '');

    // Usar 'await' para obtener el auto encontrado
    this.autoEncontrado = await this.autoService.searchAutoByPatente(patenteNormalizada);

    if (!this.autoEncontrado) {
      alert('Auto no encontrado.');
    }
  }

  // Método para enviar la notificación
  enviarNotificacion() {
    if (!this.autoEncontrado) {
      alert('No se ha encontrado el auto para enviar la notificación.');
      return;
    }

    if (!this.direccion) {
      alert('Por favor, ingresa una dirección.');
      return;
    }

    // Crear la notificación
    const notificacion = {
      mensaje: `El auto con patente ${this.autoEncontrado.patente} fue visto en ${this.direccion}.`,
      fecha: new Date(),
    };

    // Agregar la notificación al auto
    this.autoEncontrado.notificaciones.push(notificacion);

    // Actualizar el auto en el servicio
    this.autoService.updateAuto(this.autoEncontrado);
    alert('Notificación enviada.');
  }

  // Método para manejar la selección de la imagen
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        console.log('Imagen seleccionada:', e.target.result); // Solo muestra la imagen en la consola
        // Puedes manejar la imagen como necesites aquí
      };
      reader.readAsDataURL(file);
    }
  }
}
