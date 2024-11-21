import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Geolocation } from '@capacitor/geolocation';
import { WeatherService } from '../services/weather.service';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

interface Usuario {
  username: string;
  nombreCompleto: string;
  run: string;
}

interface Asignatura {
  nombre: string;
  asistida: boolean;
  codigoQR: string; // Código QR asociado
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
  asignaturas: Asignatura[] = [
    { nombre: 'Matemáticas', asistida: false, codigoQR: 'matematicas' },
    { nombre: 'Ciencias', asistida: false, codigoQR: 'ciencias' },
    { nombre: 'Historia', asistida: false, codigoQR: 'historia' },
    { nombre: 'Lengua', asistida: false, codigoQR: 'lengua' },
    { nombre: 'Arte', asistida: false, codigoQR: 'arte' },
  ];

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

        // Cargar las asistencias del usuario
        const asistencias = await this.storage.get('asistencias') || {};
        if (asistencias[usuarioActual.username]) {
            const codigosAsistidos = Object.keys(asistencias[usuarioActual.username]);
            this.asignaturas.forEach(asignatura => {
                if (codigosAsistidos.includes(asignatura.codigoQR)) {
                    asignatura.asistida = true; // Marcar como asistida
                }
            });
        }
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
        // Eliminar la cuenta del almacenamiento usando el nombre de usuario
        await this.storage.remove(usuarioActual.username);
        // Eliminar la referencia del usuario actual
        await this.storage.remove('usuarioActual');

        const toast = await this.toastController.create({
            message: 'Tu cuenta ha sido borrada y has cerrado sesión.',
            duration: 2000
        });
        toast.present();

        // Redirigir a la página de inicio
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

  async scanQRCode() {
    const result = await BarcodeScanner.startScan();
    if (result.hasContent) {
      console.log('Código QR escaneado:', result.content);
      this.registrarAsistencia(result.content);
    }
  }

  async registrarAsistencia(codigoQR: string) {
    const asignatura = this.asignaturas.find(a => a.codigoQR === codigoQR);
    if (asignatura) {
        asignatura.asistida = true;
        this.mostrarMensaje(`Asistencia registrada para ${asignatura.nombre}`);

        // Obtener el usuario actual
        const usuarioActual = await this.storage.get('usuarioActual');
        if (!usuarioActual) {
            this.mostrarMensaje('No hay usuario autenticado');
            return;
        }

        // Obtener las asistencias del almacenamiento
        const asistencias = await this.storage.get('asistencias') || {};

        // Si no hay un objeto para el usuario actual, inicializarlo
        if (!asistencias[usuarioActual.username]) {
            asistencias[usuarioActual.username] = {};
        }

        // Marcar la asignatura como asistida
        asistencias[usuarioActual.username][codigoQR] = true;

        // Guardar las asistencias actualizadas en el almacenamiento
        await this.storage.set('asistencias', asistencias);
    } else {
        this.mostrarMensaje('Código QR no válido para ninguna asignatura');
    }
  }

}