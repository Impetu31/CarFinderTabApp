import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Tab1PageRoutingModule } from './tab1-routing.module';
import { ReportarPage } from './tab1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    Tab1PageRoutingModule
  ],
  declarations: [ReportarPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // Aquí está el esquema correctamente configurado
})
export class Tab1PageModule {}
