import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ------------------------------------------------------------
  // PRUEBA 1: Verificar que el componente se crea
  // ------------------------------------------------------------
  it('Se crea el componente de login', () => {
    expect(component).toBeTruthy();
  });

  // ------------------------------------------------------------
  // PRUEBA 2: Verificar que el formulario existe
  // ------------------------------------------------------------
  it('debe tener un formulario de login', () => {
    expect(component.loginForm).toBeTruthy();
  });

  // ------------------------------------------------------------
  // PRUEBA 3: Verificar campos del formulario
  // ------------------------------------------------------------
  it('debe tener campo de email', () => {
    const emailControl = component.loginForm.get('email');
    expect(emailControl).toBeTruthy();
  });

  it('debe tener campo de contraseña', () => {
    const passwordControl = component.loginForm.get('password');
    expect(passwordControl).toBeTruthy();
  });

  // ------------------------------------------------------------
  // PRUEBA 4: Validaciones básicas
  // ------------------------------------------------------------
  it('debe requerir el email', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('');
    expect(emailControl?.valid).toBeFalse();
  });

  it('debe aceptar email válido', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('usuario@ejemplo.com');
    expect(emailControl?.valid).toBeTrue();
  });

  // ------------------------------------------------------------
  // PRUEBA 5: Interfaz de usuario
  // ------------------------------------------------------------
  it('debe mostrar el botón de login', () => {
    const button = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(button).toBeTruthy();
  });

  it('debe deshabilitar el botón si el formulario es inválido', () => {
    component.loginForm.setValue({
      email: '',
      password: ''
    });
    fixture.detectChanges();
    
    const button = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(button.nativeElement.disabled).toBeTrue();
  });
});
