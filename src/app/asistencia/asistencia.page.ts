import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';

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
  contentHeight: string = '91vh';

  constructor(private cdr: ChangeDetectorRef, private storage: Storage, private alertController: AlertController) {
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
    const currentDate = this.getCurrentDate();

    if (!this.attendanceRecordsByDate[formattedDate]) {
      this.attendanceRecordsByDate[formattedDate] = this.initializeAttendanceRecord();
    }

    this.attendanceRecord = { ...this.attendanceRecordsByDate[formattedDate] };

    this.validSubjects.forEach(subject => {
      if (this.attendanceRecord[subject] === undefined) {
        this.attendanceRecord[subject] = null;
      }

      if (formattedDate < currentDate && this.attendanceRecord[subject] === null) {
        this.attendanceRecord[subject] = false;
      }

      if (formattedDate === currentDate && this.attendanceRecord[subject] === null) {
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
      this.contentHeight = '0';
      this.cdr.detectChanges();

      const status = await BarcodeScanner.checkPermission({ force: true });
      if (!status.granted) {
        const alert = await this.alertController.create({
          header: 'Permiso de Cámara',
          message: 'La aplicación necesita acceso a la cámara para escanear códigos QR.',
          buttons: ['OK']
        });
        await alert.present();
        return;
      }

      const bodyElement = document.querySelector('body');
      if (bodyElement) {
        bodyElement.classList.add('scanner-active');
      }

      BarcodeScanner.showBackground();
      const cameraContainer = document.getElementById('camera-container');
      if (cameraContainer) {
        cameraContainer.style.display = 'block';
      }

      const result = await BarcodeScanner.startScan();

      if (cameraContainer) {
        cameraContainer.style.display = 'none';
      }

      if (result.hasContent) {
        const qrData = result.content.trim().split('-');
        const [day, month, year, subject, section] = qrData;

        const scannedDate = `${year}-${month}-${day}`;
        const currentDate = this.getCurrentDate();

        const validSections = ['006D', '005D', '004D'];

        if (!validSections.includes(section)) {
          this.attendanceMessage = 'Sección no existente.';
          const alert = await this.alertController.create({
            header: 'Error',
            message: 'Sección no existente.',
            buttons: ['OK']
          });
          await alert.present();
          return;
        }

        if (scannedDate < currentDate) {
          this.attendanceMessage = 'La clase ya pasó.';
          const alert = await this.alertController.create({
            header: 'Error',
            message: 'La clase ya pasó.',
            buttons: ['OK']
          });
          await alert.present();
          return;
        } else if (scannedDate > currentDate) {
          this.attendanceMessage = 'La clase aún no ha pasado.';
          const alert = await this.alertController.create({
            header: 'Error',
            message: 'La clase aún no ha pasado.',
            buttons: ['OK']
          });
          await alert.present();
          return;
        }

        if (!this.attendanceRecordsByDate[scannedDate]) {
          this.attendanceRecordsByDate[scannedDate] = this.initializeAttendanceRecord();
        }

        if (this.validSubjects.includes(subject)) {
          this.attendanceMessage = `Asististe a la clase de ${subject} el ${scannedDate} en la sección ${section}`;
          this.attendanceRecordsByDate[scannedDate][subject] = true;
          const alert = await this.alertController.create({
            header: 'Asistencia Registrada',
            message: `Asistencia registrada: ${subject} el ${scannedDate} en la sección ${section}`,
            buttons: ['OK']
          });
          await alert.present();
          await this.guardarAsistencia(scannedDate, subject);
        } else {
          this.attendanceMessage = `La asignatura no es válida.`;
          this.attendanceRecordsByDate[scannedDate][subject] = false;
          const alert = await this.alertController.create({
            header: 'Error',
            message: `La asignatura ${subject} no es válida.`,
            buttons: ['OK']
          });
          await alert.present();
        }

        if (scannedDate === this.formatDate(this.selectedDate)) {
          this.attendanceRecord = { ...this.attendanceRecordsByDate[scannedDate] };
          console.log('Attendance Record:', this.attendanceRecord);
          this.cdr.detectChanges();
        }

        this.contentHeight = '91vh';
        this.cdr.detectChanges();
      } else {
        this.attendanceMessage = 'No se encontró contenido en el código QR';
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'No se encontró contenido en el código QR',
          buttons: ['OK']
        });
        await alert.present();
      }
    } catch (error) {
      console.error('Error al escanear el código QR:', error);
      this.attendanceMessage = 'Error al escanear el código QR';
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Error al escanear el código QR',
        buttons: ['OK']
      });
      await alert.present();
    } finally {
      if (BarcodeScanner) {
        BarcodeScanner.stopScan();
      }
      const bodyElement = document.querySelector('body');
      if (bodyElement) {
        bodyElement.classList.remove('scanner-active');
      }
      this.contentHeight = '91vh';
      this.cdr.detectChanges();
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
