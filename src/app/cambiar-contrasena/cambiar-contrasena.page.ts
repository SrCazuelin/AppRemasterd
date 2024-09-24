import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './cambiar-contrasena.page.html',
  styleUrls: ['./cambiar-contrasena.page.scss'],
})

export class CambiarContrasenaPage {
  newPassword: string | undefined; 
  confirmNewPassword: string | undefined;

  constructor(private navCtrl: NavController, private alertController: AlertController) {}

  resetPassword() {
    if (this.newPassword === this.confirmNewPassword) {
      this.Successful();
      this.navCtrl.navigateBack('/home'); 
    } else {
      this.errorEqual();
    
    }
  }

  async errorEqual() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Las contraseñas no coinciden',
      buttons: ['OK']
    });
    await alert.present();
  }

  async errorblank() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Su contraseña no puede quedar en blanco',
      buttons: ['OK']
    });
    await alert.present();
  }

  async Successful() {
    const alert = await this.alertController.create({
      header: 'Felicitaciones',
      message: 'La contraseña fue cambiada con exito',
      buttons: ['OK']
    });
    await alert.present();
  }

}
