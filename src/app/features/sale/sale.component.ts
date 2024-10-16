import { Component, OnInit, OnDestroy, AfterViewInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SaleService } from '../../services/sale.service';
import { ChangeDetectorRef } from '@angular/core';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss']
})
export class SaleComponent implements OnInit, OnDestroy {
  private routerSubscription: Subscription = new Subscription();
  rows: any[] = [];
  dataTable: any;
  ventaIdToDelete: number | null = null;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private saleService: SaleService,
    private chRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Suscribirse a los eventos de navegación
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadSales();
      });

    // Llamar a loadVentas cuando el componente se inicializa
    this.loadSales();
  }

  ngOnDestroy(): void {
    // Desuscribirse de los eventos de navegación para evitar fugas de memoria
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  loadSales(): void {
    this.saleService.getSales().subscribe(data => {
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
      this.dataTable = $('#saleTable').DataTable({
        data: this.rows,
        columns: [
          { data: 'id_venta', visible: false },
          {
            title: "Cliente",
            data: null,
            render: function (data, type, row) {
              return `${row.cliente.nombres} ${row.cliente.apellidos}`;
            }
          },
          {
            data: 'tipo_envio.descripcion',
            render: function (data, type, row) {
              return data || 'N/A';
            }
          },
          {
            data: 'distrito.nombre',
            render: function (data, type, row) {
              return data || 'N/A';
            }
          },
          {
            data: 'adelanto', render: function (data, type, row) {
              return data || '0';
            }
          },
          {
            data: 'total', render: function (data, type, row) {
              return data || '0';
            }
          },
          {
            data: null,
            render: (data: any, type: any, row: any) => {
              return `
                <button class="btn btn-primary btn-sm" data-id="${row.id_venta}"><i class="fas fa-edit"></i></button>
                <button class="btn btn-danger btn-sm" data-id="${row.id_venta}"><i class="fas fa-trash"></i></button>
              `;
            }
          }
        ],
        language: {
          url: "assets/i18n/Spanish.json"
        },
        //responsive: true,
        pagingType: 'simple_numbers', // Tipo de paginación
      });

      // Manejar eventos de los botones después de que la tabla se haya dibujado
      $('#saleTable tbody').on('click', 'button.edit-btn', (event) => {
        const id = $(event.currentTarget).data('id');
        this.editSale(id);
      });

      $('#saleTable tbody').on('click', 'button.delete-btn', (event) => {
        const id = $(event.currentTarget).data('id');
        this.openDeleteModal(id);
      });
    }
  }

  editSale(id: number): void {
    console.log('Edit venta with id: ', id);
    this.router.navigate(['/sale/edit-sale', id]);
  }

  openDeleteModal(id: number): void {
    this.ventaIdToDelete = id;
    ($('#deleteModal') as any).modal('show');
  }

  confirmDelete(): void {
    if (this.ventaIdToDelete !== null) {
      this.saleService.deleteSale(this.ventaIdToDelete).subscribe(() => {
        this.loadSales();
        ($('#deleteModal') as any).modal('hide');
      });
    }
  }

  navigateToAddVenta(): void {
    this.router.navigate(['/sale/add-sale']);
  }
}