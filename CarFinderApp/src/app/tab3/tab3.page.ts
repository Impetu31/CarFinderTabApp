import { Component, OnInit, OnDestroy } from '@angular/core';
import { AutoService } from 'src/services/auto.service';
import { Auto } from 'src/models/auto.model';
import { Subscription } from 'rxjs';
import { AdMob } from '@capacitor-community/admob';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit, OnDestroy {
  user: any;
  autosReportados: Auto[] = [];
  autoSubscription?: Subscription;
  interstitialShown = false;

  constructor(private autoService: AutoService) {
    this.mostrarAnuncioInterstitial();
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    if (this.user?.email) {
      this.autoSubscription = this.autoService.getAutosByUser(this.user.email).subscribe((autos) => {
        this.autosReportados = autos.filter((auto) => !!auto.id); // solo válidos
      });
    }
  }

  async mostrarAnuncioInterstitial() {
    if (this.interstitialShown) return;
    this.interstitialShown = true;
    try {
      await AdMob.prepareInterstitial({
        adId: 'ca-app-pub-3940256099942544/1033173712',
        isTesting: true,
      });
      await AdMob.showInterstitial();
    } catch (error) {
      console.warn('Error mostrando interstitial en Tab3:', error);
    }
  }

  abrirEnGoogleMaps(direccion: string) {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`;
    window.open(url, '_blank');
  }

  async cambiarEstado(auto: Auto) {
    auto.status = auto.status === 'robado' ? 'recuperado' : 'robado';
    await this.autoService.updateAuto(auto);
    await this.autoService.mostrarDialogo('Éxito', `Estado del auto cambiado a "${auto.status}".`);
  }

  async eliminarAuto(auto: Auto) {
    const confirm = window.confirm(`¿Eliminar el reporte de la patente ${auto.patente}?`);
    if (confirm) {
      await this.autoService.deleteAutoById(auto.id);
      this.autosReportados = this.autosReportados.filter((a) => a.id !== auto.id);
      await this.autoService.mostrarDialogo(
        'Eliminado',
        `El reporte de la patente ${auto.patente} ha sido eliminado.`
      );
    }
  }

  async eliminarAutos() {
    await this.autoService.deleteAllAutosByUser(this.user.email);
    this.autosReportados = [];
    await this.autoService.mostrarDialogo('Éxito', 'Todos los autos reportados han sido eliminados.');
  }

  cerrarSesion() {
    localStorage.removeItem('loggedInUser');
    window.location.href = '/home';
  }

  ngOnDestroy() {
    this.autoSubscription?.unsubscribe();
  }
}
