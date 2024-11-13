import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { AuthService } from 'src/services/auth.service';
import { NavController, AlertController, IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let navCtrlSpy: jasmine.SpyObj<NavController>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    navCtrlSpy = jasmine.createSpyObj('NavController', ['navigateRoot']);
    alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);

    await TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [ReactiveFormsModule, IonicModule.forRoot(), RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NavController, useValue: navCtrlSpy },
        { provide: AlertController, useValue: alertControllerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a disabled submit button if form is invalid', () => {
    const button = fixture.nativeElement.querySelector('ion-button[type="submit"]');
    expect(button.disabled).toBeTrue();
  });

  it('should enable submit button if form is valid', () => {
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('password123');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('ion-button[type="submit"]');
    expect(button.disabled).toBeFalse();
  });

  it('should call AuthService login method on valid form submission', async () => {
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('password123');
    authServiceSpy.login.and.returnValue(Promise.resolve());

    await component.login();
    expect(authServiceSpy.login).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('should display error alert if login fails', async () => {
    component.loginForm.controls['email'].setValue('wrong@example.com');
    component.loginForm.controls['password'].setValue('wrongpassword');
    authServiceSpy.login.and.returnValue(Promise.reject('Login failed'));

    const alert = jasmine.createSpyObj('HTMLIonAlertElement', ['present']);
    alertControllerSpy.create.and.returnValue(Promise.resolve(alert));

    await component.login();
    expect(alertControllerSpy.create).toHaveBeenCalledWith({
      header: 'Error',
      message: 'Correo o contraseña incorrectos.',
      buttons: ['OK']
    });
    expect(alert.present).toHaveBeenCalled();
  });
});
