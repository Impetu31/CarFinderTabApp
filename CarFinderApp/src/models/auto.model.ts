export interface Notificacion {
  mensaje: string;
  fecha: Date;
  imagenBase64?: string;  // Imagen opcional en formato base64
}

export interface Auto {
  id: string;
  patente: string;
  descripcion: string;
  direccion?: string;      // Dirección donde se vio el auto (opcional)
  esPropietario: boolean;
  status: string;
  notificaciones: Notificacion[];
  userEmail: string;

  // Nuevas propiedades requeridas
  anio: number;            // Año del vehículo (REQUIRED)
  color: string;           // Color del vehículo (REQUIRED)
  marca: string;           // Marca del vehículo (REQUIRED)
  modelo: string;          // Modelo del vehículo (REQUIRED)
}
