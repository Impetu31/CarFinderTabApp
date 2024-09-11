import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reportar',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class ReportarPage implements OnInit {
  reportarForm!: FormGroup;  // Añade "!" para afirmar que será inicializada

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.reportarForm = this.formBuilder.group({
      patente: ['', Validators.required],
      descripcion: ['', Validators.required],
      esPropietario: [false, Validators.required]
    });
  }

  reportarAuto() {
    console.log(this.reportarForm.value);
  }
}
