import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuscarPage } from './tab2.page';  // Cambiado a BuscarPage

const routes: Routes = [
  {
    path: '',
    component: BuscarPage,  // Cambiado a BuscarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab2PageRoutingModule {}
