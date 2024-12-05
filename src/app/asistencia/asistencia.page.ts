import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.page.html',
  styleUrls: ['./asistencia.page.scss'],
})
export class AsistenciaPage implements OnInit {
  selectedDate: string = '';
  attendanceMessage: string = '';
  attended: boolean | null = null;
  validSubjects: string[] = ['Matematicas', 'Ciencias', 'Historia', 'Lengua', 'Arte'];
  attendanceRecordsByDate: { [date: string]: { [subject: string]: boolean | null } } = {};
  attendanceRecord: { [subject: string]: boolean | null } = {};

  constructor(private cdr: ChangeDetectorRef, private storage: Storage) {
    this.initStorage();
  }

  async initStorage() {
    await this.storage.create();
  }

  async ngOnInit() {
    const usuarioActual = await this.storage.get('usuarioActual');
    if (usuarioActual) {
      const asistencias = await this.storage.get('asistencias') || {};
      const userAsistencias = asistencias[usuarioActual.username] || {};
      this.attendanceRecordsByDate = userAsistencias;
      this.selectedDate = this.getCurrentDate();
      this.updateAttendance();
    }
  }

  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  initializeAttendanceRecord() {
    const record: { [subject: string]: boolean | null } = {};
    this.validSubjects.forEach(subject => {
      record[subject] = null;
    });
    return record;
  }

  updateAttendance() {
    const formattedDate = this.formatDate(this.selectedDate);

    if (!this.attendanceRecordsByDate[formattedDate]) {
      this.attendanceRecordsByDate[formattedDate] = this.initializeAttendanceRecord();
    }

    this.attendanceRecord = { ...this.attendanceRecordsByDate[formattedDate] };

    this.validSubjects.forEach(subject => {
      if (this.attendanceRecord[subject] === undefined) {
        this.attendanceRecord[subject] = null;
      }
    });
  }

  formatDate(date: string): string {
    const [year, month, day] = date.split('-');
    return `${year}-${month}-${day}`;
  }

  async scanQRCode() {
    try {
      await BarcodeScanner.checkPermission({ force: true });
      const result = await BarcodeScanner.startScan();

      if (result.hasContent) {
        const qrData = result.content.trim().split('-');
        const [day, month, year, subject] = qrData;

        const scannedDate = `${year}-${month}-${day}`;

        if (!this.attendanceRecordsByDate[scannedDate]) {
          this.attendanceRecordsByDate[scannedDate] = this.initializeAttendanceRecord();
        }

        if (this.validSubjects.includes(subject)) {
          this.attendanceMessage = `Asististe a la clase de ${subject} el ${scannedDate}`;
          this.attendanceRecordsByDate[scannedDate][subject] = true;
          alert(`Asistencia registrada: ${subject} el ${scannedDate}`);

          await this.guardarAsistencia(scannedDate, subject);
        } else {
          this.attendanceMessage = `La asignatura no es válida.`;
          this.attendanceRecordsByDate[scannedDate][subject] = false;
          alert(`Error: La asignatura ${subject} no es válida.`);
        }

        if (scannedDate === this.formatDate(this.selectedDate)) {
          this.attendanceRecord = { ...this.attendanceRecordsByDate[scannedDate] };
          console.log('Attendance Record:', this.attendanceRecord);
          this.cdr.detectChanges();
        }
      } else {
        this.attendanceMessage = 'No se encontró contenido en el código QR';
        alert('Error: No se encontró contenido en el código QR');
      }
    } catch (error) {
      console.error('Error al escanear el código QR:', error);
      this.attendanceMessage = 'Error al escanear el código QR';
      alert('Error al escanear el código QR');
    } finally {
      BarcodeScanner.stopScan();
    }
  }

  async guardarAsistencia(fecha: string, asignatura: string) {
    const usuarioActual = await this.storage.get('usuarioActual');
    if (!usuarioActual) {
      alert('No hay usuario autenticado');
      return;
    }

    const asistencias = await this.storage.get('asistencias') || {};

    if (!asistencias[usuarioActual.username]) {
      asistencias[usuarioActual.username] = {};
    }

    if (!asistencias[usuarioActual.username][fecha]) {
      asistencias[usuarioActual.username][fecha] = {};
    }

    asistencias[usuarioActual.username][fecha][asignatura] = true;

    await this.storage.set('asistencias', asistencias);
  }
}
