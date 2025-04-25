import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/services/auth.service';
import { NavController, AlertController } from '@ionic/angular';
import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';

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
      password: ['', Validators.required],
    });

    this.mostrarBanner();
  }

  async mostrarBanner() {
    try {
      await AdMob.initialize();
      await AdMob.showBanner({
        adId: 'ca-app-pub-3940256099942544/6300978111', // Banner de prueba
        adSize: BannerAdSize.ADAPTIVE_BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
        isTesting: true,
      });
    } catch (error) {
      console.warn('Error mostrando banner en LOGIN:', error);
    }
  }

  ngOnInit() {}

  async login() {
    const { email, password } = this.loginForm.value;

    try {
      await this.authService.login(email, password);
      const alert = await this.alertController.create({
        header: 'Login exitoso',
        message: 'Has iniciado sesión correctamente.',
        buttons: ['OK'],
      });
      await alert.present();
      this.navCtrl.navigateRoot('/tabs/tab1');
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Correo o contraseña incorrectos.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
}
