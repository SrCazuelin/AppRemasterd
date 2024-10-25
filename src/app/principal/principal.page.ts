import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {

  username: string = 'Usuario';

  constructor(
    private router: Router,
    private storage: Storage,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.cargarUsuario();
  }

  async cargarUsuario() {
    const usuarioActual = await this.storage.get('usuarioActual');
    if (usuarioActual) {
      this.username = usuarioActual;
    }
  }

  async cerrarSesion() {
    await this.storage.remove('usuarioActual');
    this.router.navigate(['/home']);
  }

  async borrarCuenta() {
    const alert = await this.alertController.create({
      header: 'Confirmar borrado',
      message: '¿Estás seguro de que quieres borrar tu cuenta? Esta acción no se puede deshacer.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        }, {
          text: 'Borrar',
          handler: () => {
            this.confirmarBorrado();
          }
        }
      ]
    });

    await alert.present();
  }

  async confirmarBorrado() {
    const usuarioActual = await this.storage.get('usuarioActual');
    if (usuarioActual) {
      await this.storage.remove(usuarioActual);
      await this.storage.remove('usuarioActual');
      
      const toast = await this.toastController.create({
        message: 'Tu cuenta ha sido borrada',
        duration: 2000
      });
      toast.present();

      this.router.navigate(['/home']);
    }
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
