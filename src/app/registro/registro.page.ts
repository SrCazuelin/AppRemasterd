import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {

  firstname: string = '';
  lastname: string = '';
  run: string = '';
  password: string = '';

  constructor(private navCtrl: NavController) {
    console.log('RegistroPage cargado'); 
  }

  registrar() {
    console.log('Registrar usuario');

    
    this.navCtrl.navigateForward('/home');
  }
}

