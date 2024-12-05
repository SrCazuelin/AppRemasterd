import { Component } from '@angular/core';
import { NavController, ToastController, AlertController } from '@ionic/angular';
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
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    this.initStorage();
  }

  async initStorage() {
    await this.storage.create();
  }

  async registrar() {
    if (this.validarCampos()) {
      const nuevoUsuario = {
        username: this.username,
        nombreCompleto: this.nombreCompleto,
        run: this.run,
        password: this.password
      };

      try {
        const usuarioExistente = await this.storage.get(this.username);
        if (usuarioExistente) {
          this.mostrarAlerta('Error', 'Ya existe un usuario con este nombre de usuario');
          return;
        }

        await this.storage.set(this.username, nuevoUsuario);
        this.mostrarAlerta('Éxito', 'Usuario registrado exitosamente');
        this.navCtrl.navigateBack('/home');
      } catch (error) {
        console.error('Error al registrar usuario:', error);
        this.mostrarAlerta('Error', 'Error al registrar usuario');
      }
    }
  }

  validarCampos(): boolean {
    if (this.username.length < 4) {
      this.mostrarAlerta('Validación', 'El nombre de usuario debe tener al menos 4 caracteres');
      return false;
    }

    const nombreCompletoArray = this.nombreCompleto.split(' ');
    if (nombreCompletoArray.length < 2 || nombreCompletoArray.some(nombre => nombre.length < 4)) {
      this.mostrarAlerta('Validación', 'El nombre completo debe contener al menos un nombre y un apellido, ambos de al menos 4 caracteres');
      return false;
    }

    if (!this.validarRun(this.run)) {
      this.mostrarAlerta('Validación', 'El RUT no es válido');
      return false;
    }

    if (this.password.length < 8) {
      this.mostrarAlerta('Validación', 'La contraseña debe tener al menos 8 caracteres');
      return false;
    }

    return true;
  }

  validarRun(run: string): boolean {
    // Expresión regular para validar el formato del RUT
    const rutRegex = /^[0-9]{7,8}-[0-9Kk]$/;
    if (!rutRegex.test(run)) {
      return false;
    }

    // Separar el número del dígito verificador
    const [numero, digitoVerificador] = run.split('-');
    const digito = digitoVerificador.toUpperCase();

    // Calcular el dígito verificador esperado
    let suma = 0;
    let multiplicador = 2;

    for (let i = numero.length - 1; i >= 0; i--) {
      suma += parseInt(numero[i], 10) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const resto = suma % 11;
    const digitoEsperado = 11 - resto === 11 ? '0' : 11 - resto === 10 ? 'K' : (11 - resto).toString();

    // Comparar el dígito verificador calculado con el proporcionado
    return digito === digitoEsperado;
  }

  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  volverAInicio() {
    this.navCtrl.navigateBack('/home');
  }
}
