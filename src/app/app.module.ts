import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveFormsModule


import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MainMenuComponent } from './features/main-menu/main-menu.component';
import { AppRoutingModule } from './app-routing.module';
import { UserComponent } from './features/user/user.component';
import { NavbarComponent } from './features/navbar/navbar.component';
import { SidebarComponent } from './features/sidebar/sidebar.component';
import { FooterComponent } from './features/footer/footer.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { UserService } from './services/user.service';
import { SaleService } from './services/sale.service';
import { AddUserComponent } from './features/user/add-user/add-user.component';
import { EditUserComponent } from './features/user/edit-user/edit-user.component';
import { SaleComponent } from './features/sale/sale.component';
import { AddSaleComponent } from './features/sale/add-sale/add-sale.component';
import { EditSaleComponent } from './features/sale/edit-sale/edit-sale.component';
import { ProductComponent } from './features/product/product.component';
import { AddProductComponent } from './features/product/add-product/add-product.component';
import { EditProductComponent } from './features/product/edit-product/edit-product.component';
import { CategoryComponent } from './features/category/category.component';
import { AddCategoryComponent } from './features/category/add-category/add-category.component';
import { EditCategoryComponent } from './features/category/edit-category/edit-category.component';
import { ModeloComponent } from './features/modelo/modelo.component';
import { AddModeloComponent } from './features/modelo/add-modelo/add-modelo.component';
import { EditModeloComponent } from './features/modelo/edit-modelo/edit-modelo.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainMenuComponent,
    UserComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    DashboardComponent,
    AddUserComponent,
    EditUserComponent,
    SaleComponent,
    AddSaleComponent,
    EditSaleComponent,
    ProductComponent,
    AddProductComponent,
    EditProductComponent,
    CategoryComponent,
    AddCategoryComponent,
    EditCategoryComponent,
    ModeloComponent,
    AddModeloComponent,
    EditModeloComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    FormsModule,
    MatToolbarModule,
    MatListModule,
    MatSidenavModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [UserService, SaleService],
  bootstrap: [AppComponent]
})
export class AppModule { }
