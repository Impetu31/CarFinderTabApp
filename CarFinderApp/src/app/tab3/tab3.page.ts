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

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    this.autosReportados = this.autoService.getAutosByUser(this.user.email);
  }

  cambiarEstado(auto: Auto) {
    auto.status = 'recuperado';
    this.autoService.updateAuto(auto);
    this.autoService.mostrarDialogo('Éxito', 'Estado del auto cambiado a "recuperado".');
  }

  cerrarSesion() {
    localStorage.removeItem('loggedInUser');
    window.location.href = '/home';
  }

  eliminarAutos() {
    this.autoService.deleteAllAutosByUser(this.user.email);
    this.autosReportados = [];
    this.autoService.mostrarDialogo('Éxito', 'Todos los autos reportados han sido eliminados.');
  }
}
