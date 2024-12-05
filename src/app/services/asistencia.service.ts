import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  constructor(private storage: Storage) {
    this.initStorage();
  }

  async initStorage() {
    await this.storage.create();
  }

  async guardarAsistencia(usuario: string, fecha: string, asignatura: string) {
    const asistencias = await this.storage.get('asistencias') || {};

    if (!asistencias[usuario]) {
      asistencias[usuario] = {};
    }

    if (!asistencias[usuario][fecha]) {
      asistencias[usuario][fecha] = {};
    }

    asistencias[usuario][fecha][asignatura] = true;

    await this.storage.set('asistencias', asistencias);
  }

  async cargarAsistencias(usuario: string) {
    const asistencias = await this.storage.get('asistencias') || {};
    return asistencias[usuario] || {};
  }
}