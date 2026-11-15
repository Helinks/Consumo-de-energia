import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardPageModule)
  },
  {
    path: 'calcular-consumo',
    loadChildren: () => import('./pages/calcular-consumo/calcular-consumo.module').then(m => m.CalcularConsumoPageModule)
  },
  {
    path: 'resultados',
    loadChildren: () => import('./pages/resultados/resultados.module').then(m => m.ResultadosPageModule)
  },
  {
    path: 'inquilinos',
    loadChildren: () => import('./pages/gestionar-inquilinos/gestionar-inquilinos.module').then(m => m.GestionarInquilinosPageModule)
  },
  {
    path: 'apartamentos',
    loadChildren: () => import('./pages/gestionar-apartamentos/gestionar-apartamentos.module').then(m => m.GestionarApartamentosPageModule)
  },
  {
    path: 'historial',
    loadChildren: () => import('./pages/historial-consumo/historial-consumo.module').then(m => m.HistorialConsumoPageModule)
  },
  {
    path: 'resultado-historial',
    loadChildren: () => import('./pages/resultado-historial/resultado-historial.module').then(m => m.ResultadoHistorialPageModule)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
