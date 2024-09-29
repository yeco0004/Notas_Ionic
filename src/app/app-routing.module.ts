import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'asignatura',
    pathMatch: 'full'
  },
  {
    path: 'asignatura',
    loadChildren: () => import('./page/asignatura/asignatura.module').then(m => m.AsignaturaPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
