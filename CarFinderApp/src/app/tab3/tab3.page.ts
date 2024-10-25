import { Component, OnInit, OnDestroy } from '@angular/core';
import { AutoService } from 'src/services/auto.service';
import { Auto } from 'src/models/auto.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit, OnDestroy {
  user: any;
  autosReportados: Auto[] = [];
  autoSubscription: Subscription | undefined;

  constructor(private autoService: AutoService) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    if (this.user && this.user.email) {
      this.autoSubscription = this.autoService
        .getAutosByUser(this.user.email)
        .subscribe((autos) => {
          this.autosReportados = autos.filter(
            (auto, index, self) =>
              index === self.findIndex((t) => t.id === auto.id)
          );
        });
    }
  }

  async cambiarEstado(auto: Auto) {
    auto.status = auto.status === 'robado' ? 'recuperado' : 'robado';
    await this.autoService.updateAuto(auto);
    await this.autoService.mostrarDialogo(
      'Éxito',
      `Estado del auto cambiado a "${auto.status}".`
    );
  }

  cerrarSesion() {
    localStorage.removeItem('loggedInUser');
    window.location.href = '/home';
  }

  async eliminarAutos() {
    await this.autoService.deleteAllAutosByUser(this.user.email);
    this.autosReportados = [];
    await this.autoService.mostrarDialogo(
      'Éxito',
      'Todos los autos reportados han sido eliminados.'
    );
  }

  ngOnDestroy() {
    if (this.autoSubscription) {
      this.autoSubscription.unsubscribe();
    }
  }
}
