import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { Tab1Page } from './tab1.page';
import { AutoService } from 'src/services/auto.service';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('Tab1Page', () => {
  let component: Tab1Page;
  let fixture: ComponentFixture<Tab1Page>;
  let autoServiceSpy: jasmine.SpyObj<AutoService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AutoService', ['generateAutoId', 'normalizarPatente', 'searchAutoByPatente', 'addAuto', 'mostrarDialogo']);

    await TestBed.configureTestingModule({
      declarations: [Tab1Page],
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: AutoService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Tab1Page);
    component = fixture.componentInstance;
    autoServiceSpy = TestBed.inject(AutoService) as jasmine.SpyObj<AutoService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error if patente length is less than 6', async () => {
    component.nuevoAuto.patente = '123';
    await component.reportarAuto();
    expect(component.patenteError).toBeTrue();
  });

  it('should add auto if all conditions are met', async () => {
    component.nuevoAuto = {
      id: '',
      patente: 'ABC123',
      descripcion: 'Auto reportado robado',
      esPropietario: false,
      status: 'robado',
      notificaciones: [],
      userEmail: 'test@example.com'
    };

    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({ email: 'test@example.com' }));
    autoServiceSpy.generateAutoId.and.returnValue('testId');
    autoServiceSpy.normalizarPatente.and.returnValue('ABC123');
    autoServiceSpy.searchAutoByPatente.and.returnValue(Promise.resolve(null));
    autoServiceSpy.addAuto.and.returnValue(Promise.resolve(true));

    await component.reportarAuto();

    expect(autoServiceSpy.addAuto).toHaveBeenCalledWith(jasmine.objectContaining({
      patente: 'ABC123',
      descripcion: 'Auto reportado robado',
      status: 'robado'
    }));
    expect(component.patenteError).toBeFalse();
  });
});
