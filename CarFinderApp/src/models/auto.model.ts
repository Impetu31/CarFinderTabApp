export interface Auto {
  id: number;
  patente: string;
  descripcion: string;
  esPropietario: boolean;
  status: string;
  notificaciones: Notificacion[];
  direccion?: string;  // Se añadió esta propiedad para el error
  userEmail: string;
}

export interface Notificacion {
  mensaje: string;
  fecha: Date;
}
