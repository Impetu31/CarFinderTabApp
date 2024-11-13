import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { Tab2Page } from './tab2.page';
import { AutoService } from 'src/services/auto.service';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Auto } from 'src/models/auto.model'; // Asegúrate de importar el modelo Auto

describe('Tab2Page', () => {
  let component: Tab2Page;
  let fixture: ComponentFixture<Tab2Page>;
  let autoServiceSpy: jasmine.SpyObj<AutoService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AutoService', [
      'normalizarPatente',
      'searchAutoByPatente',
      'enviarNotificacion',
      'mostrarDialogo'
    ]);

    await TestBed.configureTestingModule({
      declarations: [Tab2Page],
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [{ provide: AutoService, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(Tab2Page);
    component = fixture.componentInstance;
    autoServiceSpy = TestBed.inject(AutoService) as jasmine.SpyObj<AutoService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display an error dialog if the auto is not found', async () => {
    autoServiceSpy.searchAutoByPatente.and.returnValue(Promise.resolve(null));
    component.patente = 'XYZ123';

    await component.buscarAuto();

    expect(autoServiceSpy.mostrarDialogo).toHaveBeenCalledWith(
      'Error',
      'No se encontró ningún auto con la patente: XYZ123'
    );
    expect(component.autoEncontrado).toBeNull();
  });

  it('should find an auto and display it when a valid patent is entered', async () => {
    const mockAuto: Auto = {
      id: '1',
      patente: 'XYZ123',
      descripcion: 'Auto sospechoso',
      esPropietario: false,
      status: 'robado',
      notificaciones: [],
      userEmail: 'test@example.com',
    };
    autoServiceSpy.searchAutoByPatente.and.returnValue(Promise.resolve(mockAuto));

    component.patente = 'XYZ123';
    await component.buscarAuto();

    expect(component.autoEncontrado).toEqual(mockAuto);
  });

  it('should send notification and clear the form', async () => {
    const mockAuto: Auto = {
      id: '1',
      patente: 'XYZ123',
      descripcion: 'Auto sospechoso',
      esPropietario: false,
      status: 'robado',
      notificaciones: [],
      userEmail: 'test@example.com',
    };

    component.autoEncontrado = mockAuto;
    component.direccion = 'Av. Siempre Viva 123';
    component.imagenBase64 = 'base64image';

    autoServiceSpy.enviarNotificacion.and.returnValue(Promise.resolve());
    autoServiceSpy.mostrarDialogo.and.returnValue(Promise.resolve());

    await component.enviarNotificacion();

    expect(autoServiceSpy.enviarNotificacion).toHaveBeenCalledWith(
      mockAuto,
      'Av. Siempre Viva 123',
      'base64image'
    );
    expect(autoServiceSpy.mostrarDialogo).toHaveBeenCalledWith(
      'Éxito',
      'Notificación enviada al dueño del auto.'
    );

    // Verificar que el formulario esté limpio después de la notificación
    expect(component.patente).toBe('');
    expect(component.direccion).toBe('');
    expect(component.autoEncontrado).toBeNull();
    expect(component.imagenBase64).toBe('');
  });
});
