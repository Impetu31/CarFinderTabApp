import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-buscar',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class BuscarPage implements OnInit {
  buscarForm!: FormGroup;  // Añade "!" para afirmar que será inicializada
  autoEncontrado: any;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.buscarForm = this.formBuilder.group({
      patente: ['', Validators.required]
    });
  }

  buscarAuto() {
    console.log(this.buscarForm.value);
    this.autoEncontrado = { descripcion: 'Auto encontrado' };  // Solo un ejemplo
  }
}
