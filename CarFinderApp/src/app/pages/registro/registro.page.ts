import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/services/auth.service';
import { NavController, AlertController } from '@ionic/angular';
import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';

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

    this.mostrarBanner();
  }

  async mostrarBanner() {
    try {
      await AdMob.initialize();
      await AdMob.showBanner({
        adId: 'ca-app-pub-3940256099942544/6300978111',
        adSize: BannerAdSize.ADAPTIVE_BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
        isTesting: true,
      });
    } catch (error) {
      console.warn('Error mostrando banner en REGISTRO:', error);
    }
  }

  ngOnInit() {}

  async onSubmit() {
    const { email, username, password, confirmPassword } = this.registroForm.value;

    if (password !== confirmPassword) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Las contraseñas no coinciden.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    try {
      await this.authService.register(email, password);
      const alert = await this.alertController.create({
        header: 'Registro exitoso',
        message: 'Usuario registrado exitosamente.',
        buttons: ['OK'],
      });
      await alert.present();
      this.navCtrl.navigateRoot('/tabs/home');
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'El correo ya está registrado o hay un error en el registro.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
}
