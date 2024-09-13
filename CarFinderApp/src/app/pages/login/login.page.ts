import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/services/auth.service';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private navCtrl: NavController,
    private alertController: AlertController
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {}

  async login() {
    const { email, password } = this.loginForm.value;
    
    const loginSuccess = this.authService.login(email, password);

    if (loginSuccess) {
      const alert = await this.alertController.create({
        header: 'Login exitoso',
        message: 'Has iniciado sesión correctamente.',
        buttons: ['OK']
      });
      await alert.present();
      this.navCtrl.navigateRoot('/tabs/tab1'); 
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Correo o contraseña incorrectos.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}
