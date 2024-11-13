import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { HomePage } from './home.page';
import { By } from '@angular/platform-browser';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [IonicModule.forRoot(), RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a button to navigate to login', () => {
    const loginButton = fixture.debugElement.query(By.css('ion-button[routerLink="/login"]'));
    expect(loginButton).toBeTruthy();
  });

  it('should have a button to navigate to registro', () => {
    const registroButton = fixture.debugElement.query(By.css('ion-button[routerLink="/registro"]'));
    expect(registroButton).toBeTruthy();
  });
});
