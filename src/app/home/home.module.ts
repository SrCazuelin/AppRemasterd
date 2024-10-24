import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { IonicStorageModule } from '@ionic/storage-angular'; // Importa el módulo de almacenamiento

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    IonicStorageModule.forRoot() // Configura el módulo de almacenamiento
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
