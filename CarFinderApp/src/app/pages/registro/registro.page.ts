import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/services/auth.service';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  registroForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private navCtrl: NavController,
    private alertController: AlertController
  ) {
    this.registroForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit() {}

  async onSubmit() {
    const { email, username, password, confirmPassword } = this.registroForm.value;

    if (password !== confirmPassword) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Las contraseñas no coinciden.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    try {
      // Usamos el servicio AuthService que está conectado con Firebase
      await this.authService.register(email, password); // Username no es necesario para Firebase
      const alert = await this.alertController.create({
        header: 'Registro exitoso',
        message: 'Usuario registrado exitosamente.',
        buttons: ['OK']
      });
      await alert.present();
      this.navCtrl.navigateRoot('/tabs/home');
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'El correo ya está registrado o hay un error en el registro.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}
