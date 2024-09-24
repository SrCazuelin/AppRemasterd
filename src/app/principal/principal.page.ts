import { Component, OnInit } from '@angular/core';
import { ToastController, NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {

  username: string = 'Usuario';

  constructor(private toastController: ToastController, private navCtrl: NavController,private alertController: AlertController) { }

  ngOnInit() {
    this.mostrarToastBienvenida();
  }

  async mostrarToastBienvenida() {
    const toast = await this.toastController.create({
      message: `¡Bienvenido, ${this.username}! Nos alegra tenerte de vuelta.`,
      duration: 3000,
      position: 'top',
      color: 'primary',
    });
    toast.present();
  }

  async explorarApp() {
    const alert = await this.alertController.create({
      header: 'Explorar Aplicación',
      message: 'Estás explorando la aplicación. ¡Diviértete!',
      buttons: ['OK'],
    });
    await alert.present();
  }
 
  async verPerfil() {
    const alert = await this.alertController.create({
      header: 'Ver Perfil',
      message: 'Redirigiendo al perfil de usuario.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            console.log("Redirigiendo"); // Simulacion, "genio"
          }
        }
      ],
    });
    await alert.present();
  }

  async contactarSoporte() {
    const alert = await this.alertController.create({
      header: 'Contactar Soporte',
      message: '¿Necesitas ayuda? Redirigiendo a la página de soporte.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            console.log("Redirigiendo"); // otra simulacion xd
          }
        }
      ],
    });
    await alert.present();
  }

}
