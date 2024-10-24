import { Component } from '@angular/core';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './cambiar-contrasena.page.html',
  styleUrls: ['./cambiar-contrasena.page.scss'],
})
export class CambiarContrasenaPage {

  username: string = '';
  password: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';

  constructor(
    private navCtrl: NavController,
    private storage: Storage,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    this.initStorage();
  }

  async initStorage() {
    await this.storage.create();
  }

  async resetPassword() {
    if (this.username && this.password && this.newPassword && this.confirmNewPassword) {
      if (this.newPassword !== this.confirmNewPassword) {
        this.mostrarMensaje('Las nuevas contraseñas no coinciden');
        return;
      }

      try {
        const usuario = await this.storage.get(this.username);
        if (usuario && usuario.password === this.password) {
          // Actualizar la contraseña
          usuario.password = this.newPassword;
          await this.storage.set(this.username, usuario);
          this.mostrarMensaje('Contraseña cambiada exitosamente');
          this.navCtrl.navigateBack('/home');
        } else {
          this.mostrarMensaje('Usuario o contraseña actual incorrectos');
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
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
}
