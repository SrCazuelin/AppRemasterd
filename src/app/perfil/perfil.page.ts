import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  usuario: any;

  constructor(private storage: Storage) {}

  async ngOnInit() {
    this.usuario = await this.storage.get('usuarioActual');
  }
}
