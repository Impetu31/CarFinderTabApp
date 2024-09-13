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
  direccion: string = '';
  autoEncontrado: Auto | null = null;

  constructor(private autoService: AutoService) {}

  async buscarAuto() {
    const auto = await this.autoService.searchAutoByPatente(this.patente);

    if (auto) {
      this.autoEncontrado = auto;
    } else {
      await this.autoService.mostrarDialogo('Error', 'No se encontró ningún auto con la patente: ' + this.patente);
    }
  }

  async enviarNotificacion() {
    if (this.autoEncontrado) {
      this.autoService.enviarNotificacion(this.autoEncontrado, this.direccion);
      await this.autoService.mostrarDialogo('Éxito', 'Notificación enviada al dueño del auto.');
    }
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
    }
  }
}
