import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy{
  private routerSubscription: Subscription = new Subscription();
  rows: any[] = [];
  dataTable: any;
  productIdToDelete: number | null = null;
  productToDeleteName: string = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private chRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Suscribirse a los eventos de navegación
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadProducts();
      });

    // Llamar a loadUsers cuando el componente se inicializa
    this.loadProducts();
  }

  ngOnDestroy(): void {
    // Desuscribirse de los eventos de navegación para evitar fugas de memoria
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(data => {
      console.log(data); // Verificar los datos en la consola
      this.rows = data as any[];
      this.chRef.detectChanges();
      this.initializeDataTable();
    });
  }

  initializeDataTable(): void {
    if (this.dataTable) {
      this.dataTable.clear();
      this.dataTable.rows.add(this.rows);
      this.dataTable.draw();
    } else {
      this.dataTable = $('#productTable').DataTable({
        data: this.rows,
        columns: [
          { data: 'id_producto', visible: false},
          { data: 'id_modelo', visible: false},
          { data: 'modelo.nombre' },
          { data: 'nombre' },
          { data: 'descripcion' },
          { data: 'precio' },
          { data: 'stock' },
          { data: 'foto' },
          { data: 'talla' },
          {
            data: null,
            render: (data: any, type: any, row: any) => {
              return `
                <button class="btn btn-primary btn-sm edit-btn" data-id="${row.id_producto}"><i class="fas fa-edit"></i></button>
                <button class="btn btn-danger btn-sm delete-btn" data-toggle="modal" data-target="#deleteModal" data-id="${row.id_producto}"><i class="fas fa-trash"></i></button>
              `;
            }
          }
        ]
      });

      // Manejar eventos de los botones después de que la tabla se haya dibujado
      $('#productTable tbody').on('click', 'button.edit-btn', (event: any) => {
        const id = $(event.currentTarget).data('id');
        this.editProduct(id);
      });

      $('#productTable tbody').on('click', 'button.delete-btn', (event: any) => {
        const id = $(event.currentTarget).data('id');
        const row = this.rows.find(r => r.id_producto === id);
        this.openDeleteModal(row);
      });
    }
  }

  editProduct(id: number): void {
    console.log('Edit product with id: ', id);
    this.router.navigate(['/edit-product', id]);
  }

  // deleteUser(id: number): void {
  //   this.userService.deleteUser(id).subscribe(() => {
  //     this.loadUsers();
  //   });
  // }

  openDeleteModal(row: any): void {
    this.productIdToDelete = row.id_producto;
    this.productToDeleteName = `${row.nombre}`;
    console.log(`id: ${this.productIdToDelete}`);
  }

  confirmDelete(): void {
    console.log(this.productIdToDelete)
    if (this.productIdToDelete !== null) {
      this.productService.deleteProduct(this.productIdToDelete).subscribe(() => {
        this.loadProducts();
      });
    }
  }

  navigateToAddProduct(): void {
    this.router.navigate(['/add-product']);
  }

}
