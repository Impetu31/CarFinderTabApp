import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, AlertController } from '@ionic/angular';
import { Tab3Page } from './tab3.page';
import { AutoService } from 'src/services/auto.service';
import { of } from 'rxjs';
import { Auto } from 'src/models/auto.model';

describe('Tab3Page', () => {
  let component: Tab3Page;
  let fixture: ComponentFixture<Tab3Page>;
  let autoServiceSpy: jasmine.SpyObj<AutoService>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;

  beforeEach(async () => {
    const autoServiceMock = jasmine.createSpyObj('AutoService', [
      'getAutosByUser',
      'updateAuto',
      'deleteAllAutosByUser',
      'mostrarDialogo'
    ]);

    const alertControllerMock = jasmine.createSpyObj('AlertController', ['create']);

    await TestBed.configureTestingModule({
      declarations: [Tab3Page],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: AutoService, useValue: autoServiceMock },
        { provide: AlertController, useValue: alertControllerMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Tab3Page);
    component = fixture.componentInstance;
    autoServiceSpy = TestBed.inject(AutoService) as jasmine.SpyObj<AutoService>;
    alertControllerSpy = TestBed.inject(AlertController) as jasmine.SpyObj<AlertController>;

    // Configuración de datos simulados
    autoServiceSpy.getAutosByUser.and.returnValue(of([]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should clear loggedInUser from localStorage on logout', () => {
    spyOn(localStorage, 'removeItem');
    component.cerrarSesion();
    expect(localStorage.removeItem).toHaveBeenCalledWith('loggedInUser');
  });

  it('should call updateAuto on change of auto status', async () => {
    const mockAuto: Auto = {
      id: '1',
      patente: 'XYZ123',
      descripcion: 'Auto sospechoso',
      esPropietario: false,
      status: 'robado',
      notificaciones: [],
      userEmail: 'test@example.com',
    };

    autoServiceSpy.updateAuto.and.returnValue(Promise.resolve());

    await component.cambiarEstado(mockAuto);

    expect(autoServiceSpy.updateAuto).toHaveBeenCalledWith(mockAuto);
    expect(mockAuto.status).toBe('recuperado'); // Cambia el estado como parte de la prueba
  });
});
