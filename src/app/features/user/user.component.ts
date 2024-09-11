import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { ChangeDetectorRef } from '@angular/core';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  private routerSubscription: Subscription = new Subscription();
  rows: any[] = [];
  dataTable: any;
  userIdToDelete: number | null = null;
  userToDeleteName: string = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private chRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Suscribirse a los eventos de navegación
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadUsers();
      });

    // Llamar a loadUsers cuando el componente se inicializa
    this.loadUsers();
  }

  ngOnDestroy(): void {
    // Desuscribirse de los eventos de navegación para evitar fugas de memoria
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(data => {
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
      this.dataTable = $('#userTable').DataTable({
        data: this.rows,
        columns: [
          { data: 'id_usuario', visible: false},
          { data: 'nombres' },
          { data: 'apellido_paterno' },
          { data: 'apellido_materno' },
          { data: 'email' },
          { data: 'telefono' },
          { data: 'rol' },
          {
            data: null,
            render: (data: any, type: any, row: any) => {
              return `
                <button class="btn btn-primary btn-sm edit-btn" data-id="${row.id_usuario}"><i class="fas fa-edit"></i></button>
                <button class="btn btn-danger btn-sm delete-btn" data-toggle="modal" data-target="#deleteModal" data-id="${row.id_usuario}"><i class="fas fa-trash"></i></button>
              `;
            }
          }
        ]
      });

      // Manejar eventos de los botones después de que la tabla se haya dibujado
      $('#userTable tbody').on('click', 'button.edit-btn', (event: any) => {
        const id = $(event.currentTarget).data('id');
        this.editUser(id);
      });

      $('#userTable tbody').on('click', 'button.delete-btn', (event: any) => {
        const id = $(event.currentTarget).data('id');
        const row = this.rows.find(r => r.id_usuario === id);
        this.openDeleteModal(row);
      });
    }
  }

  editUser(id: number): void {
    console.log('Edit user with id: ', id);
    this.router.navigate(['/edit-user', id]);
  }

  // deleteUser(id: number): void {
  //   this.userService.deleteUser(id).subscribe(() => {
  //     this.loadUsers();
  //   });
  // }

  openDeleteModal(row: any): void {
    this.userIdToDelete = row.id_usuario;
    this.userToDeleteName = `${row.nombres} ${row.apellido_paterno} ${row.apellido_materno}`;
    console.log(`id: ${this.userIdToDelete}`);
  }

  confirmDelete(): void {
    if (this.userIdToDelete !== null) {
      this.userService.deleteUser(this.userIdToDelete).subscribe(() => {
        this.loadUsers();
      });
    }
  }

  navigateToAddUser(): void {
    this.router.navigate(['/add-user']);
  }
}