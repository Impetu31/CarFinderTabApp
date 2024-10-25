import { Injectable } from '@angular/core';
import { Auto, Notificacion } from 'src/models/auto.model';
import { AlertController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root',
})
export class AutoService {
  private autosRef = this.db.list<Auto>('autos');

  constructor(
    private alertController: AlertController,
    private db: AngularFireDatabase
  ) {}

  generateAutoId(): string {
    return this.db.createPushId();
  }

  async addAuto(auto: Auto): Promise<boolean> {
    try {
      await this.autosRef.push(auto);
      return true;
    } catch (error) {
      console.error('Error al agregar auto:', error);
      return false;
    }
  }

  async searchAutoByPatente(patente: string): Promise<Auto | null> {
    const snapshot = await this.db
      .list<Auto>('autos', (ref) => ref.orderByChild('patente').equalTo(patente))
      .query.once('value');

    const autos = snapshot.val();
    return autos ? (Object.values(autos)[0] as Auto) : null;
  }

  async getAutosByUser(email: string): Promise<Auto[]> {
    const snapshot = await this.db
      .list<Auto>('autos', (ref) => ref.orderByChild('userEmail').equalTo(email))
      .query.once('value');

    const autos = snapshot.val();
    return autos ? (Object.values(autos) as Auto[]) : [];
  }

  listenForAutoChanges(email: string, callback: (autos: Auto[]) => void): void {
    this.db
      .list<Auto>('autos', (ref) => ref.orderByChild('userEmail').equalTo(email))
      .valueChanges()
      .subscribe(callback);
  }

  async deleteAllAutosByUser(email: string): Promise<void> {
    const snapshot = await this.db
      .list<Auto>('autos', (ref) => ref.orderByChild('userEmail').equalTo(email))
      .query.once('value');

    const autos = snapshot.val();
    if (autos) {
      const updates: any = {};
      Object.keys(autos).forEach((key) => (updates[`autos/${key}`] = null));
      await this.db.database.ref().update(updates);
    }
  }

  // Evita duplicaciones al enviar notificaciones
  async enviarNotificacion(auto: Auto, direccion: string, imagenBase64?: string) {
    const notificacion: Notificacion = {
      mensaje: `El auto fue visto en: ${direccion}`,
      fecha: new Date(),
      imagenBase64,
    };

    if (!auto.notificaciones) {
      auto.notificaciones = [];
    }

    // Verificar si ya existe una notificación similar
    const notificacionExistente = auto.notificaciones.some(
      (n) =>
        n.mensaje === notificacion.mensaje &&
        n.fecha.toString() === notificacion.fecha.toString()
    );

    if (!notificacionExistente) {
      auto.notificaciones.push(notificacion);
      await this.updateAuto(auto);
    } else {
      console.warn('Notificación duplicada evitada.');
    }
  }

  async updateAuto(auto: Auto): Promise<void> {
    const autoRef = this.db.object(`autos/${auto.id}`);
    const snapshot = await autoRef.query.once('value');

    if (snapshot.exists()) {
      await autoRef.update(auto); // Actualizar solo si existe el auto
    } else {
      console.error('El auto no existe en la base de datos.');
    }
  }

  async mostrarDialogo(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
