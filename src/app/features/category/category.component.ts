import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, OnDestroy{
  private routerSubscription: Subscription = new Subscription();
  rows: any[] = [];
  dataTable: any;
  categoryIdToDelete: number | null = null;
  categoryToDeleteName: string = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService,
    private chRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Suscribirse a los eventos de navegación
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadCategory();
      });

    // Llamar a loadUsers cuando el componente se inicializa
    this.loadCategory();
  }

  ngOnDestroy(): void {
    // Desuscribirse de los eventos de navegación para evitar fugas de memoria
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  loadCategory(): void {
    this.categoryService.getCategorys().subscribe(data => {
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
      this.dataTable = $('#categoryTable').DataTable({
        data: this.rows,
        columns: [
          { data: 'id_categoria', visible: false},
          { data: 'nombre' },
          { data: 'descripcion' },
          {
            data: null,
            render: (data: any, type: any, row: any) => {
              return `
                <button class="btn btn-primary btn-sm edit-btn" data-id="${row.id_categoria}"><i class="fas fa-edit"></i></button>
                <button class="btn btn-danger btn-sm delete-btn" data-toggle="modal" data-target="#deleteModal" data-id="${row.id_categoria}"><i class="fas fa-trash"></i></button>
              `;
            }
          }
        ],
        language: {
          url: "assets/i18n/Spanish.json"
        }
      });

      // Manejar eventos de los botones después de que la tabla se haya dibujado
      $('#categoryTable tbody').on('click', 'button.edit-btn', (event: any) => {
        const id = $(event.currentTarget).data('id');
        this.editCategory(id);
      });

      $('#categoryTable tbody').on('click', 'button.delete-btn', (event: any) => {
        const id = $(event.currentTarget).data('id');
        const row = this.rows.find(r => r.id_categoria === id);
        this.openDeleteModal(row);
      });
    }
  }

  editCategory(id: number): void {
    console.log('Edit category with id: ', id);
    this.router.navigate(['/edit-category', id]);
  }

  // deleteUser(id: number): void {
  //   this.userService.deleteUser(id).subscribe(() => {
  //     this.loadUsers();
  //   });
  // }

  openDeleteModal(row: any): void {
    this.categoryIdToDelete = row.id_categoria;
    this.categoryToDeleteName = `${row.nombre}`;
    console.log(`id: ${this.categoryIdToDelete}`);
  }

  confirmDelete(): void {
    console.log(this.categoryIdToDelete)
    if (this.categoryIdToDelete !== null) {
      this.categoryService.deleteCategory(this.categoryIdToDelete).subscribe(() => {
        this.loadCategory();
      });
    }
  }

  navigateToAddCategory(): void {
    this.router.navigate(['/add-category']);
  }

}

