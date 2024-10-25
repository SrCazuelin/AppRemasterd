import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Geolocation } from '@capacitor/geolocation';
import { WeatherService } from '../services/weather.service';

interface Usuario {
  username: string;
  nombreCompleto: string;
  run: string;
}

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {

  usuario: Usuario | null = null;
  latitude: number = 0;
  longitude: number = 0;
  weather: any;

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private storage: Storage,
    private alertController: AlertController,
    private toastController: ToastController,
    private weatherService: WeatherService
  ) {}

  ngOnInit() {
    this.cargarUsuario();
    this.obtenerUbicacion();
  }

  async cargarUsuario() {
    const usuarioActual = await this.storage.get('usuarioActual');
    if (usuarioActual) {
      this.usuario = usuarioActual;
      console.log('Usuario cargado:', this.usuario);
    } else {
      console.error('No se pudo cargar la información del usuario');
      this.router.navigate(['/home']);
    }
  }

  async obtenerUbicacion() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      this.latitude = coordinates.coords.latitude;
      this.longitude = coordinates.coords.longitude;
      this.obtenerClima();
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
      this.mostrarMensaje('No se pudo obtener la ubicación');
    }
  }

  obtenerClima() {
    this.weatherService.getWeather(this.latitude, this.longitude).subscribe(
      (data) => {
        this.weather = data.current_weather;
      },
      (error) => {
        console.error('Error al obtener el clima:', error);
        this.mostrarMensaje('No se pudo obtener la información del clima');
      }
    );
  }

  async mostrarMensaje(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'top'
    });
    toast.present();
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

  irACambiarContrasena() {
    this.router.navigate(['/cambiar-contrasena']);
  }

}
