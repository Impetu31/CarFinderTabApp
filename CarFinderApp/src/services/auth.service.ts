import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private users = JSON.parse(localStorage.getItem('users') || '[]');
  private currentUser: any = null;  // Para almacenar el usuario autenticado

  constructor() {}

  register(email: string, password: string): string {
    const userExists = this.users.find((user: any) => user.email === email);
    if (userExists) {
      return 'exists';
    } else {
      const newUser = { email, password };
      this.users.push(newUser);
      localStorage.setItem('users', JSON.stringify(this.users));
      return 'success';
    }
  }

  login(email: string, password: string): boolean {
    const user = this.users.find((user: any) => user.email === email && user.password === password);
    if (user) {
      this.currentUser = user;  // Guardar el usuario autenticado
      return true;
    }
    return false;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  logout() {
    this.currentUser = null;
  }
}
