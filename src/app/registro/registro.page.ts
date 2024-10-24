import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {

  username: string = '';
  nombreCompleto: string = '';
  run: string = '';
  password: string = '';

  constructor(
    private navCtrl: NavController,
    private storage: Storage,
    private toastController: ToastController
  ) {
    this.initStorage();
  }

  async initStorage() {
    await this.storage.create();
  }

  async registrar() {
    if (this.username && this.nombreCompleto && this.run && this.password) {
      const nuevoUsuario = {
        username: this.username,
        nombreCompleto: this.nombreCompleto,
        run: this.run,
        password: this.password
      };

      try {
        // Verificar si el usuario ya existe
        const usuarioExistente = await this.storage.get(this.username);
        if (usuarioExistente) {
          this.mostrarMensaje('Ya existe un usuario con este nombre de usuario');
          return;
        }

        // Guardar el nuevo usuario
        await this.storage.set(this.username, nuevoUsuario);
        this.mostrarMensaje('Usuario registrado exitosamente');
        this.navCtrl.navigateBack('/home');
      } catch (error) {
        console.error('Error al registrar usuario:', error);
        this.mostrarMensaje('Error al registrar usuario');
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
