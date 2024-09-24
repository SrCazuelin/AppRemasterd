import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  username: string = ''; 
  password: string = ''; 

  constructor(private navCtrl: NavController, private toastController: ToastController,private alertController: AlertController) {}

  
  goToRegistro() {
    this.navCtrl.navigateForward('/registro');
  }

 
  iniciarSesion() {
    if (this.username) {
      console.log('Iniciar sesión');
      this.mostrarBienvenida();
      this.navCtrl.navigateForward('/principal');
    } else {
      console.error('Por favor, ingresa tu nombre de usuario.');
      this.mostrarErrorAlert();
      
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

  async mostrarErrorAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Por favor, ingresa tu nombre de usuario y contraseña.',
      buttons: ['OK']
    });
    await alert.present();
  }
}


  