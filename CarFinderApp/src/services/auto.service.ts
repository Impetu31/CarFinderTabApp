import { Injectable } from '@angular/core';
import { Auto, Notificacion } from 'src/models/auto.model';
import { AlertController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';

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

  normalizarPatente(patente: string): string {
    return patente.trim().toUpperCase();
  }

  async addAuto(auto: Auto): Promise<boolean> {
    try {
      auto.patente = this.normalizarPatente(auto.patente);
      await this.autosRef.push(auto);
      return true;
    } catch (error) {
      console.error('Error al agregar auto:', error);
      return false;
    }
  }

  getAutosByUser(email: string): Observable<Auto[]> {
    return this.db
      .list<Auto>('autos', (ref) =>
        ref.orderByChild('userEmail').equalTo(email)
      )
      .valueChanges() as Observable<Auto[]>;
  }

  async searchAutoByPatente(patente: string): Promise<Auto | null> {
    const patenteNormalizada = this.normalizarPatente(patente);
    const snapshot = await this.db
      .list<Auto>('autos', (ref) =>
        ref.orderByChild('patente').equalTo(patenteNormalizada)
      )
      .query.once('value');
    const autos = snapshot.val();
    return autos ? (Object.values(autos)[0] as Auto) : null;
  }

  async enviarNotificacion(
    auto: Auto,
    direccion: string,
    imagenBase64?: string
  ) {
    const notificacion: Notificacion = {
      mensaje: direccion,
      fecha: new Date(),
      imagenBase64,
    };

    const existe = auto.notificaciones?.some(
      (n) =>
        n.mensaje === notificacion.mensaje &&
        n.fecha.toISOString() === notificacion.fecha.toISOString()
    );

    if (!existe) {
      auto.notificaciones = [...(auto.notificaciones || []), notificacion];
      await this.updateAuto(auto);
    }
  }

  async updateAuto(auto: Auto): Promise<void> {
    const autoRef = this.db.object(`autos/${auto.id}`);
    await autoRef.update(auto);
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

  async mostrarDialogo(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
