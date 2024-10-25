import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private storage: Storage, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const usuarioActual = await this.storage.get('usuarioActual');
    if (usuarioActual) {
      return true;
    } else {
      // Si no hay usuario autenticado, redirigir a la página de error 404
      this.router.navigate(['/error404']);
      return false;
    }
  }
}
