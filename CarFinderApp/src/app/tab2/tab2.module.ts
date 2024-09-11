import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';  // Asegúrate de importar CUSTOM_ELEMENTS_SCHEMA
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Tab2PageRoutingModule } from './tab2-routing.module';
import { BuscarPage } from './tab2.page';  // Asegúrate de que BuscarPage esté importado

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,  // Formulario reactivo
    IonicModule,
    Tab2PageRoutingModule
  ],
  declarations: [BuscarPage],  // Declaración correcta de BuscarPage
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // Asegúrate de que esta línea esté correcta
})
export class Tab2PageModule {}
