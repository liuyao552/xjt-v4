import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule',  canActivate: [AuthGuard] }, // 放后面
  { path: 'scan', loadChildren: './pages/scan/scan.module#ScanPageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  // { path: '',   redirectTo: './pages/login/login.module#LoginPageModule', pathMatch: 'full' },
  { path: '**', loadChildren: './pages/login/login.module#LoginPageModule' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
