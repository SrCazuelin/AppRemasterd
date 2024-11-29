import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  @Input() usuario: any; // Recibe el usuario
  @Output() cerrarSesion = new EventEmitter<void>(); // Evento para cerrar sesión

  constructor(private router: Router, private alertController: AlertController) {}

  verPerfil() {
    this.router.navigate(['/perfil']); // Cambia '/perfil' por la ruta correcta
  }

  irACambiarContrasena() {
    this.router.navigate(['/cambiar-contrasena']); // Cambia '/cambiar-contrasena' por la ruta correcta
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

  irASede() {
    this.router.navigate(['/location']); // Cambia '/geolocation' por la ruta correcta a tu vista de geolocalización
  }

  onCerrarSesion() {
    this.cerrarSesion.emit(); // Emitir el evento de cerrar sesión
  }

  irAAsistencia() {
    this.router.navigate(['/asistencia']);
  }
}
