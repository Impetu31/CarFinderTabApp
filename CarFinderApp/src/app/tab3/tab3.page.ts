import { Component, OnInit } from '@angular/core';
import { AutoService } from 'src/services/auto.service';
import { Auto } from 'src/models/auto.model';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  user: any;
  autosReportados: Auto[] = [];

  constructor(private autoService: AutoService, private alertController: AlertController) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    this.autosReportados = this.autoService.getAutosByUser(this.user.email);
  }

  cambiarEstado(auto: Auto) {
    auto.status = 'recuperado';
    this.autoService.updateAuto(auto);
    this.mostrarAlerta('Estado actualizado', 'El estado del auto ha sido cambiado a "recuperado".');
  }

  borrarAutosReportados() {
    this.autoService.deleteAllAutosByUser(this.user.email);
    this.autosReportados = [];
    this.mostrarAlerta('Autos eliminados', 'Todos los autos reportados han sido eliminados.');
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
