export interface Auto {
  id: number;
  patente: string;
  descripcion: string;
  esPropietario: boolean;
  status: string;
  notificaciones: Notificacion[];
  direccion?: string;  // Optional property for location
  userEmail: string;
}

export interface Notificacion {
  mensaje: string;
  fecha: Date;
}
