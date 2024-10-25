import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';
import { Error404Page } from './error404/error404.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
  },
  {
    path: 'registro',
    loadChildren: () => import('./registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'cambiar-contrasena',
    loadChildren: () => import('./cambiar-contrasena/cambiar-contrasena.module').then( m => m.CambiarContrasenaPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'principal',
    loadChildren: () => import('./principal/principal.module').then( m => m.PrincipalPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'error404',
    loadChildren: () => import('./error404/error404.module').then( m => m.Error404PageModule)
  },
  {
    path: '**',
    redirectTo: '/error404'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
