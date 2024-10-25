import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  constructor(private storage: Storage, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const usuarioActual = await this.storage.get('usuarioActual');
    if (usuarioActual) {
      // Si el usuario está autenticado, redirigir a la página principal
      this.router.navigate(['/principal']);
      return false;
    }
    return true;
  }
}
