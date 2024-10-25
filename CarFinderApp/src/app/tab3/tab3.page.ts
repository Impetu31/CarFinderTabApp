import { Component, OnInit } from '@angular/core';
import { AutoService } from 'src/services/auto.service';
import { Auto } from 'src/models/auto.model';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  user: any;
  autosReportados: Auto[] = [];

  constructor(private autoService: AutoService) {}

  async ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    if (this.user && this.user.email) {
      this.autosReportados = await this.autoService.getAutosByUser(this.user.email);
      this.autoService.listenForAutoChanges(this.user.email, (autos) => {
        this.autosReportados = autos; // Actualiza automáticamente
      });
    }
  }

  async cambiarEstado(auto: Auto) {
    auto.status = 'recuperado';
    await this.autoService.updateAuto(auto);
    await this.autoService.mostrarDialogo('Éxito', 'Estado del auto cambiado a "recuperado".');
  }

  cerrarSesion() {
    localStorage.removeItem('loggedInUser');
    window.location.href = '/home';
  }

  async eliminarAutos() {
    await this.autoService.deleteAllAutosByUser(this.user.email);
    this.autosReportados = [];
    await this.autoService.mostrarDialogo('Éxito', 'Todos los autos reportados han sido eliminados.');
  }
}
