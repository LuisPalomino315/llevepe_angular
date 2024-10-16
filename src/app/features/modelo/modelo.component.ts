import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import { ModeloService } from 'src/app/services/modelo.service';

@Component({
  selector: 'app-modelo',
  templateUrl: './modelo.component.html',
  styleUrls: ['./modelo.component.scss']
})
export class ModeloComponent implements OnInit, OnDestroy{
  private routerSubscription: Subscription = new Subscription();
  rows: any[] = [];
  dataTable: any;
  modeloIdToDelete: number | null = null;
  modeloToDeleteName: string = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modeloService: ModeloService,
    private chRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Suscribirse a los eventos de navegación
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadModelos();
      });

    // Llamar a loadUsers cuando el componente se inicializa
    this.loadModelos();
  }

  ngOnDestroy(): void {
    // Desuscribirse de los eventos de navegación para evitar fugas de memoria
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  loadModelos(): void {
    this.modeloService.getModelos().subscribe(data => {
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
      this.dataTable = $('#modeloTable').DataTable({
        data: this.rows,
        columns: [
          { data: 'id_modelo', visible: false},
          { data: 'id_categoria', visible: false},
          { data: 'categoria.nombre' },
          { data: 'nombre'},
          { data: 'descripcion' },
          {
            data: null,
            render: (data: any, type: any, row: any) => {
              return `
                <button class="btn btn-primary btn-sm edit-btn" data-id="${row.id_modelo}"><i class="fas fa-edit"></i></button>
                <button class="btn btn-danger btn-sm delete-btn" data-toggle="modal" data-target="#deleteModal" data-id="${row.id_modelo}"><i class="fas fa-trash"></i></button>
              `;
            }
          }
        ],
        language: {
          url: "assets/i18n/Spanish.json"
        }
      });

      // Manejar eventos de los botones después de que la tabla se haya dibujado
      $('#modeloTable tbody').on('click', 'button.edit-btn', (event: any) => {
        const id = $(event.currentTarget).data('id');
        this.editModelo(id);
      });

      $('#modeloTable tbody').on('click', 'button.delete-btn', (event: any) => {
        const id = $(event.currentTarget).data('id');
        const row = this.rows.find(r => r.id_modelo === id);
        this.openDeleteModal(row);
      });
    }
  }

  editModelo(id: number): void {
    console.log('Edit modelo with id: ', id);
    this.router.navigate(['/edit-modelo', id]);
  }

  // deleteUser(id: number): void {
  //   this.userService.deleteUser(id).subscribe(() => {
  //     this.loadUsers();
  //   });
  // }

  openDeleteModal(row: any): void {
    this.modeloIdToDelete = row.id_modelo;
    this.modeloToDeleteName = `${row.nombre}`;
    console.log(`id: ${this.modeloIdToDelete}`);
  }

  confirmDelete(): void {
    console.log(this.modeloIdToDelete)
    if (this.modeloIdToDelete !== null) {
      this.modeloService.deleteModelo(this.modeloIdToDelete).subscribe(() => {
        this.loadModelos();
      });
    }
  }

  navigateToAddModelo(): void {
    this.router.navigate(['/add-modelo']);
  }

}

