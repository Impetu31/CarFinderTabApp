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

  // Función para agregar un auto reportado
  async addAuto(auto: Auto): Promise<boolean> {
    const patenteNormalizada = this.normalizarPatente(auto.patente);

    if (patenteNormalizada.length !== 6) {
      await this.mostrarDialogo('Error', 'La patente debe tener exactamente 6 caracteres y no debe contener vocales.');
      return false;
    }

    const autoExists = this.autos.find((a) => a.patente === patenteNormalizada);
    if (autoExists) {
      await this.mostrarDialogo('Error', 'Esta patente ya ha sido reportada.');
      return false; // No permitir duplicados
    }

    auto.patente = patenteNormalizada;
    this.autos.push(auto);
    this.saveToLocalStorage();
    return true;
  }

  // Buscar un auto por patente
  async searchAutoByPatente(patente: string): Promise<Auto | null> {
    if (!patente) {
      return null; // No hacer nada si no se ingresa nada
    }

    const patenteNormalizada = this.normalizarPatente(patente);
    const auto = this.autos.find((auto) => auto.patente === patenteNormalizada);

    if (auto) {
      // Mostrar diálogo indicando que el auto fue reportado como robado
      await this.mostrarDialogo(
        'Vehículo Reportado',
        'Este vehículo fue reportado como robado. Añade información para que el dueño lo recupere.'
      );
    }

    return auto || null;
  }

  // Actualizar la información del auto (visto en algún lugar)
  updateAuto(auto: Auto): void {
    const index = this.autos.findIndex((a) => a.id === auto.id);
    if (index !== -1) {
      this.autos[index] = auto;
      this.saveToLocalStorage();
    }
  }

  // Obtener todos los autos reportados por un usuario específico
  getAutosByUser(userEmail: string): Auto[] {
    return this.autos.filter((auto) => auto.userEmail === userEmail);
  }

  // Enviar notificación al dueño del auto
  enviarNotificacion(auto: Auto, direccion: string): void {
    auto.notificaciones.push({
      mensaje: `El auto fue visto en: ${direccion}`,
      fecha: new Date(),
    });
    this.updateAuto(auto);
  }

  // Eliminar todos los autos reportados por un usuario específico
  deleteAllAutosByUser(userEmail: string): void {
    this.autos = this.autos.filter((auto) => auto.userEmail !== userEmail);
    this.saveToLocalStorage();
  }

  // Guardar los autos en el localStorage
  private saveToLocalStorage() {
    localStorage.setItem('autos', JSON.stringify(this.autos));
  }

  // Normalizar la patente eliminando vocales y convirtiendo a mayúsculas
  private normalizarPatente(patente: string): string {
    return patente.toUpperCase().replace(/[AEIOU]/g, '');
  }

  // Mostrar un diálogo personalizado
  public async mostrarDialogo(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
