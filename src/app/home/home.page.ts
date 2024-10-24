import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular'; // Importa el servicio de almacenamiento

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  username: string = ''; 
  password: string = ''; 

  constructor(
    private navCtrl: NavController, 
    private toastController: ToastController,
    private alertController: AlertController,
    private storage: Storage // Inyecta el servicio de almacenamiento
  ) {
    this.init();
  }

  async init() {
    await this.storage.create(); // Inicializa el almacenamiento
  }

  goToRegistro() {
    this.navCtrl.navigateForward('/registro');
  }

  async iniciarSesion() {
    if (this.username && this.password) {
      try {
        const usuario = await this.storage.get(this.username);
        if (usuario && usuario.password === this.password) {
          console.log('Inicio de sesión exitoso');
          await this.storage.set('usuarioActual', this.username);
          this.mostrarBienvenida();
          this.navCtrl.navigateForward('/principal');
        } else {
          console.error('Credenciales incorrectas.');
          this.mostrarErrorAlert('Credenciales incorrectas. Por favor, intenta de nuevo.');
        }
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        this.mostrarErrorAlert('Error al iniciar sesión. Por favor, intenta de nuevo.');
      }
    } else {
      console.error('Por favor, ingresa tu nombre de usuario y contraseña.');
      this.mostrarErrorAlert('Por favor, ingresa tu nombre de usuario y contraseña.');
    }
  }

  forgotPassword() {
    console.log('Olvidaste tu contraseña');
    this.navCtrl.navigateForward('/cambiar-contrasena');
  }

  async mostrarBienvenida() {
    const toast = await this.toastController.create({
      message: `Bienvenido, ${this.username}!`,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  async mostrarErrorAlert(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }
}
