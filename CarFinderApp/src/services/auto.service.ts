import { Injectable } from '@angular/core';
import { Auto } from 'src/models/auto.model';  
import { Notificacion } from 'src/models/auto.model';  

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private autos: Auto[] = [];

  constructor() {}

  add(auto: Auto): boolean {
    const exists = this.autos.find((a) => a.patente === auto.patente);
    if (exists) {
      return false;
    }
    this.autos.push(auto);
    return true;
  }

  getAll(): Auto[] {
    return this.autos;
  }

  getProductsByUser(email: string): Auto[] {
    return this.autos.filter((auto) => auto.userEmail === email);
  }
}
