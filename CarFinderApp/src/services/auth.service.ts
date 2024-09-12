import { Injectable } from '@angular/core';
import { Notificacion } from 'src/models/auto.model';  // Correct import for Notificacion

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  users: any[] = [];

  constructor() {
    const storedUsers = localStorage.getItem('users');
    this.users = storedUsers ? JSON.parse(storedUsers) : [];
  }

  // Register a new user
  register(email: string, username: string, password: string): boolean {
    const userExists = this.users.find((u) => u.email === email);

    if (userExists) {
      return false;
    }

    const newUser = { email, username, password, notificaciones: [] };
    this.users.push(newUser);
    localStorage.setItem('users', JSON.stringify(this.users));
    return true;
  }

  // Login
  login(email: string, password: string): boolean {
    const user = this.users.find((u) => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      return true;
    } else {
      return false;
    }
  }

  // Logout
  logout(): void {
    localStorage.removeItem('loggedInUser');
  }

  // Get the currently logged-in user
  getLoggedInUser(): any {
    return JSON.parse(localStorage.getItem('loggedInUser') || '{}');
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    const user = localStorage.getItem('loggedInUser');
    return user ? true : false;
  }

  // Add notification to a specific user
  agregarNotificacion(userEmail: string, notificacion: Notificacion): void {
    const user = this.users.find((u) => u.email === userEmail);

    if (user) {
      user.notificaciones.push(notificacion);
      this.updateUser(user);
    }
  }

  // Update user data in localStorage
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
}
