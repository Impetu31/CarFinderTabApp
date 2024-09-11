import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportarPage } from './tab1.page';  // Asegúrate de que se importe ReportarPage

const routes: Routes = [
  {
    path: '',
    component: ReportarPage,  // Cambiado a ReportarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab1PageRoutingModule {}
