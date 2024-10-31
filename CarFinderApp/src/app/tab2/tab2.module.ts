import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import { Tab2Page } from './tab2.page';
import { ImageUploaderComponent } from 'src/app/components/image-uploader/image-uploader.component'; // Importamos el componente

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Tab2PageRoutingModule
  ],
  declarations: [
    Tab2Page,
    ImageUploaderComponent // Declaramos el componente aquí
  ]
})
export class Tab2PageModule {}
