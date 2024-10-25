import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.page.html',
  styleUrls: ['./recuperar-contrasena.page.scss'],
})
export class RecuperarContrasenaPage {
  username: string = '';
  RUT: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';

  constructor(
    private navCtrl: NavController,
    private storage: Storage,
    private toastController: ToastController
  ) {}

  async recuperarContrasena() {
    if (this.username && this.RUT && this.newPassword && this.confirmNewPassword) {
      if (this.newPassword !== this.confirmNewPassword) {
        await this.mostrarMensaje('Las nuevas contraseñas no coinciden');
        return;
      }

      try {
        const usuario = await this.storage.get(this.username);
        if (usuario && usuario.run === this.RUT) {
          usuario.password = this.newPassword;
          await this.storage.set(this.username, usuario);
          await this.mostrarMensaje('Contraseña recuperada exitosamente');
          this.navCtrl.navigateBack('/home');
        } else {
          await this.mostrarMensaje('Usuario o RUT incorrectos');
        }
      } catch (error) {
        console.error('Error al recuperar la contraseña:', error);
        await this.mostrarMensaje('Error al recuperar la contraseña');
      }
    } else {
      await this.mostrarMensaje('Por favor, completa todos los campos');
    }
  }

  async mostrarMensaje(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'top'
    });
    await toast.present();
  }

  regresar() {
    this.navCtrl.navigateBack('/home');
  }

  
}
