import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Notificacion } from 'src/models/auto.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  users: any[] = [];

  constructor(private afAuth: AngularFireAuth) {
    const storedUsers = localStorage.getItem('users');
    this.users = storedUsers ? JSON.parse(storedUsers) : [];
  }

  // Registrar un nuevo usuario con Firebase Authentication
  async register(email: string, password: string): Promise<void> {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const user = { email: userCredential.user?.email, notificaciones: [] };
      this.users.push(user);
      localStorage.setItem('users', JSON.stringify(this.users));
      localStorage.setItem('loggedInUser', JSON.stringify(user));
    } catch (error) {
      console.error('Error en el registro:', error);
      throw error;
    }
  }

  // Iniciar sesión con Firebase Authentication
  async login(email: string, password: string): Promise<void> {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      const user = this.users.find((u) => u.email === email) || { email, notificaciones: [] };
      localStorage.setItem('loggedInUser', JSON.stringify(user));
    } catch (error) {
      console.error('Error en el login:', error);
      throw error;
    }
  }

  // Cerrar sesión de Firebase y limpiar el localStorage
  async logout(): Promise<void> {
    await this.afAuth.signOut();
    localStorage.removeItem('loggedInUser');
  }

  // Obtener el estado de autenticación actual desde Firebase
  getAuthState() {
    return this.afAuth.authState;
  }

  // Agregar una notificación al usuario especificado
  agregarNotificacion(userEmail: string, notificacion: Notificacion): void {
    const user = this.users.find((u) => u.email === userEmail);

    if (user) {
      user.notificaciones.push(notificacion);
      this.updateUser(user);
    }
  }

  // Actualizar los datos del usuario en localStorage
  private updateUser(updatedUser: any): void {
    const userIndex = this.users.findIndex((u) => u.email === updatedUser.email);

    if (userIndex !== -1) {
      this.users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(this.users));
    }

    const loggedInUser = this.getLoggedInUser();
    if (loggedInUser?.email === updatedUser.email) {
      localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
    }
  }

  // Obtener el usuario actualmente logueado desde localStorage
  getLoggedInUser(): any {
    return JSON.parse(localStorage.getItem('loggedInUser') || '{}');
  }

  // Verificar si hay un usuario autenticado en Firebase
  async isAuthenticated(): Promise<boolean> {
    const user = await this.afAuth.currentUser;
    return !!user;
  }
}
