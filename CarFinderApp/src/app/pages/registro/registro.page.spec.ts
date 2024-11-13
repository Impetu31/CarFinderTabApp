import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroPage } from './registro.page';
import { AuthService } from 'src/services/auth.service';
import { NavController, AlertController, IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

describe('RegistroPage', () => {
  let component: RegistroPage;
  let fixture: ComponentFixture<RegistroPage>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let navCtrlSpy: jasmine.SpyObj<NavController>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    navCtrlSpy = jasmine.createSpyObj('NavController', ['navigateRoot']);
    alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);

    await TestBed.configureTestingModule({
      declarations: [RegistroPage],
      imports: [ReactiveFormsModule, IonicModule.forRoot(), RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NavController, useValue: navCtrlSpy },
        { provide: AlertController, useValue: alertControllerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroPage);
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
    component.registroForm.controls['username'].setValue('testuser');
    component.registroForm.controls['email'].setValue('test@example.com');
    component.registroForm.controls['password'].setValue('password123');
    component.registroForm.controls['confirmPassword'].setValue('password123');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('ion-button[type="submit"]');
    expect(button.disabled).toBeFalse();
  });

  it('should show error alert if passwords do not match', async () => {
    component.registroForm.controls['username'].setValue('testuser');
    component.registroForm.controls['email'].setValue('test@example.com');
    component.registroForm.controls['password'].setValue('password123');
    component.registroForm.controls['confirmPassword'].setValue('password1234');

    const alert = jasmine.createSpyObj('HTMLIonAlertElement', ['present']);
    alertControllerSpy.create.and.returnValue(Promise.resolve(alert));

    await component.onSubmit();
    expect(alertControllerSpy.create).toHaveBeenCalledWith({
      header: 'Error',
      message: 'Las contraseñas no coinciden.',
      buttons: ['OK']
    });
    expect(alert.present).toHaveBeenCalled();
  });

  it('should call AuthService register on form submit if form is valid', async () => {
    component.registroForm.controls['username'].setValue('testuser');
    component.registroForm.controls['email'].setValue('test@example.com');
    component.registroForm.controls['password'].setValue('password123');
    component.registroForm.controls['confirmPassword'].setValue('password123');
    authServiceSpy.register.and.returnValue(Promise.resolve());

    await component.onSubmit();
    expect(authServiceSpy.register).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(navCtrlSpy.navigateRoot).toHaveBeenCalledWith('/tabs/home');
  });
});
