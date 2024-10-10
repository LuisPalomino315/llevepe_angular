import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainMenuComponent } from './features/main-menu/main-menu.component';
import { UserComponent } from './features/user/user.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AddUserComponent } from './features/user/add-user/add-user.component'; // Importa el componente hijo
import { EditUserComponent } from './features/user/edit-user/edit-user.component'; // Importa el componente hijo
import { SaleComponent } from './features/sale/sale.component';
import { AddSaleComponent } from './features/sale/add-sale/add-sale.component'; // Importa el componente hijo
import { EditSaleComponent } from './features/sale/edit-sale/edit-sale.component'; // Importa el componente hijo

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainMenuComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: DashboardComponent },
      { path: 'user', component: UserComponent },
      { path: 'user/add-user', component: AddUserComponent },
      { path: 'user/edit-user/:id', component: EditUserComponent },
      { path: 'sale', component: SaleComponent },
      { path: 'sale/add-sale', component: AddSaleComponent },
      { path: 'sale/edit-sale', component: EditSaleComponent },
      // Agrega más rutas secundarias según sea necesario
    ]
  },
  // Agrega más rutas principales según sea necesario
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
