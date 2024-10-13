import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Notificacion } from 'src/models/auto.model';  // Correct import for Notificacion

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  users: any[] = [];

  constructor(private afAuth: AngularFireAuth) {
    const storedUsers = localStorage.getItem('users');
    this.users = storedUsers ? JSON.parse(storedUsers) : [];
  }

  // Register a new user with Firebase Authentication
  async register(email: string, password: string): Promise<any> {
    try {
      // Firebase Authentication para registrar un usuario
      return await this.afAuth.createUserWithEmailAndPassword(email, password);
    } catch (error) {
      console.error('Error en el registro:', error);
      throw error;
    }
  }

  // Login with Firebase Authentication
  async login(email: string, password: string): Promise<any> {
    try {
      return await this.afAuth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error('Error en el login:', error);
      throw error;
    }
  }

  // Logout from Firebase Authentication
  async logout(): Promise<void> {
    return this.afAuth.signOut();
  }

  // Get the currently logged-in user from Firebase Authentication
  getAuthState() {
    return this.afAuth.authState;
  }

  // Add notification to a specific user (local storage functionality)
  agregarNotificacion(userEmail: string, notificacion: Notificacion): void {
    const user = this.users.find((u) => u.email === userEmail);

    if (user) {
      user.notificaciones.push(notificacion);
      this.updateUser(user);
    }
  }

  // Update user data in localStorage (for storing notifications locally)
  private updateUser(updatedUser: any): void {
    const userIndex = this.users.findIndex((u) => u.email === updatedUser.email);

    if (userIndex !== -1) {
      this.users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(this.users));
    }

    const loggedInUser = this.getLoggedInUser();
    if (loggedInUser.email === updatedUser.email) {
      localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
    }
  }

  // Get the currently logged-in user (local storage functionality)
  getLoggedInUser(): any {
    return JSON.parse(localStorage.getItem('loggedInUser') || '{}');
  }

  // Check if the user is authenticated using Firebase Authentication
  isAuthenticated(): boolean {
    const user = this.afAuth.authState;
    return user ? true : false;
  }
}
