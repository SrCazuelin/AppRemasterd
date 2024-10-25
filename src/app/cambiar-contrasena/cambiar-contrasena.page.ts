import { Component } from '@angular/core';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './cambiar-contrasena.page.html',
  styleUrls: ['./cambiar-contrasena.page.scss'],
})
export class CambiarContrasenaPage {

  username: string = '';
  RUT: string = '';
  password: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';

  constructor(
    private navCtrl: NavController,
    private storage: Storage,
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router
  ) {
    this.initStorage();
  }

  async initStorage() {
    await this.storage.create();
  }

  async resetPassword() {
    if (this.username && this.RUT && this.password && this.newPassword && this.confirmNewPassword) {
      if (this.newPassword !== this.confirmNewPassword) {
        this.mostrarMensaje('Las nuevas contraseñas no coinciden');
        return;
      }

      try {
        const usuario = await this.storage.get(this.username);
        if (usuario && usuario.password === this.password && usuario.run === this.RUT) {
          // Actualizar la contraseña
          usuario.password = this.newPassword;
          await this.storage.set(this.username, usuario);
          this.mostrarMensaje('Contraseña cambiada exitosamente');
          this.navCtrl.navigateBack('/home');
        } else {
          this.mostrarMensaje('Usuario, RUT o contraseña actual incorrectos');
        }
      } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        this.mostrarMensaje('Error al cambiar la contraseña');
      }
    } else {
      this.mostrarMensaje('Por favor, completa todos los campos');
    }
  }

  async mostrarMensaje(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }

  async regresarYCerrarSesion() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que quieres regresar? Se cerrará tu sesión por seguridad.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        }, {
          text: 'Aceptar',
          handler: () => {
            this.cerrarSesionYRegresar();
          }
        }
      ]
    });

    await alert.present();
  }

  async cerrarSesionYRegresar() {
    try {
      await this.storage.remove('usuarioActual');
      this.mostrarMensaje('Sesión cerrada por seguridad');
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      this.mostrarMensaje('Error al cerrar sesión');
    }
  }
}
