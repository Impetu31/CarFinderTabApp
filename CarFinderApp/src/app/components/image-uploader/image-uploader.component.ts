import { Component, Output, EventEmitter } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss'],
})
export class ImageUploaderComponent {
  @Output() imageSelected = new EventEmitter<string | undefined>(); // Aceptamos string | undefined
  imageBase64: string | undefined; // Cambiamos a string | undefined para evitar errores

  constructor() {}

  // Método para abrir la cámara y capturar la imagen
  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        source: CameraSource.Camera, // Fuente: Cámara del dispositivo
        resultType: CameraResultType.DataUrl, // Resultado en formato base64
      });

      this.imageBase64 = image.dataUrl ?? undefined; // Asegura que nunca sea null
      this.imageSelected.emit(this.imageBase64); // Emitimos la imagen al componente padre
    } catch (error) {
      console.error('Error al tomar la foto:', error);
    }
  }
}
