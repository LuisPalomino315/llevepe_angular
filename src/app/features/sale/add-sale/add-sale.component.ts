import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { SaleService } from 'src/app/services/sale.service';
import { GlobalService } from 'src/app/services/global.service';
import { ProductService } from 'src/app/services/product.service';
import * as toastr from 'toastr';
import * as $ from 'jquery';
import 'datatables.net';
import 'select2';

@Component({
  selector: 'app-add-sale',
  templateUrl: './add-sale.component.html',
  styleUrls: ['./add-sale.component.scss']
})
export class AddSaleComponent {
  addSaleForm: FormGroup;
  detalleForm: FormGroup;
  dataTable: any;
  productos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private saleService: SaleService,
    private global: GlobalService,
    private productService: ProductService,
    private chRef: ChangeDetectorRef,
    private router: Router
  ) {
    this.addSaleForm = this.fb.group({
      id_usuario: [parseInt(localStorage.getItem('id_usuario') || '0')],
      fecha: [null],
      total: [null, [Validators.pattern('^[0-9]*\.?[0-9]+$')]],
      adelanto: [null, [Validators.pattern('^[0-9]*\.?[0-9]+$')]],
      id_tipo_envio: [null],
      direccion: [''],
      id_distrito: [null],
      observacion: [''],
      cliente: this.fb.group({
        nombres: ['', Validators.required],
        apellidos: ['', Validators.required],
        telefono: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
      }),
      detalles: this.fb.array([])
    });


    this.detalleForm = this.fb.group({
      id_producto: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      precio: ['', [Validators.required, Validators.pattern('^[0-9]*\.?[0-9]+$')]]
    });
  }

  ngOnInit(): void {
    this.initializeDataTable();
    this.loadProductos();
  }

  ngAfterViewInit(): void {
    const selectProducto = $('#id_producto');
    // Detectar cambios en select2 y actualizar el formControl de Angular
    selectProducto.on('change', (e: any) => {
      const selectedValue = e.target.value;
      this.detalleForm.get('id_producto')?.setValue(selectedValue);
    });
  }

  get detalles(): FormArray {
    return this.addSaleForm.get('detalles') as FormArray;
  }

  addDetalle(): void {
  
    const detalleFormGroup = this.fb.group({
      id_producto: [this.detalleForm.get('id_producto')?.value, Validators.required],
      cantidad: [this.detalleForm.get('cantidad')?.value, [Validators.required, Validators.pattern('^[0-9]+$')]],
      precio: [this.detalleForm.get('precio')?.value, [Validators.required, Validators.pattern('^[0-9]*\.?[0-9]+$')]]
    });

    this.detalles.push(detalleFormGroup);
    this.addDetalleToTable(detalleFormGroup.value);

    // Reset detalleForm
    this.detalleForm.reset();
  }

  removeDetalle(id_producto: string): void {
    id_producto = String(id_producto).trim();

    const index = this.detalles.controls.findIndex(detalle => {
      const detalleIdProducto = detalle.get('id_producto')?.value.trim();
      return detalleIdProducto === id_producto;
    });

    console.log(`index: ${index}`);
    if (index !== -1) {
      this.detalles.removeAt(index);
      const row = this.dataTable.row((idx: number, data: any) => data[0] === id_producto);
      row.remove().draw();
      this.chRef.detectChanges();
    }
  }

  addDetalleToTable(detalle: any): void {
    const producto: any = this.findProductoById(detalle.id_producto);
    console.log(producto);
    this.dataTable.row.add([
      detalle.id_producto,
      producto.nombre,
      detalle.cantidad,
      detalle.precio,
      `<button class="btn btn-danger btn-sm delete-btn" data-id="${detalle.id_producto}">Eliminar</button>`
    ]).draw();

    // Manejar eventos de los botones después de que la tabla se haya dibujado
    $('#detallesTable tbody').off('click', 'button.delete-btn').on('click', 'button.delete-btn', (event) => {
      const id_producto = $(event.currentTarget).data('id');
      console.log(id_producto);
      this.removeDetalle(id_producto);
    });
  }

  findProductoById(id_producto: number): any {
    return this.productos.find(producto => producto.id_producto == id_producto);
  }

  initializeDataTable(): void {
    this.dataTable = $('#detallesTable').DataTable({
      columns: [
        { title: 'ID Producto', visible: false },
        { title: 'Producto' },
        { title: 'Cantidad' },
        { title: 'Precio' },
        { title: 'Acciones' }
      ],
      language: {
        url: "assets/i18n/Spanish.json"
      }
    });
  }

  onSubmit(): void {
    if (this.addSaleForm.valid) {
      console.log("Entro")
      console.log(this.addSaleForm.value)
      // Filtrar detalles para eliminar aquellos con id_producto vacío
      const detallesValidos = this.detalles.controls.filter(detalle => detalle.get('id_producto')?.value);
      console.log(detallesValidos)
      // Crear una copia del valor del formulario y reemplazar los detalles con los detalles filtrados
      const formValue = { ...this.addSaleForm.value, detalles: detallesValidos.length ? detallesValidos.map(detalle => detalle.value) : [] };
      console.log(formValue)
      this.saleService.createSale(formValue).subscribe(
        response => {
          toastr.success('Venta creada exitosamente.', 'Éxito');
          setTimeout(() => {
            this.router.navigate(['/sale']);
          }, 2000);
        },
        error => {
          console.log(error);
          toastr.error('Hubo un error al crear la venta. Por favor, inténtelo de nuevo.', 'Error');
        }
      );
    } else {
      this.getFormValidationErrors();
      toastr.error('Por favor, corrige los errores en el formulario.', 'Error');
    }
  }

  onBack(): void {
    this.router.navigate(['/sale']);
  }

  getFormValidationErrors() {
    Object.keys(this.addSaleForm.controls).forEach(key => {
      const control = this.addSaleForm.get(key);
      if (control != null) {
        const controlErrors = control.errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            console.log('Key control: ' + key + ', keyError: ' + keyError + ', error value: ', controlErrors[keyError]);
          });
        }
      }
    });
  }

  onPhoneInput(): void {
    const phoneControl = this.addSaleForm.get('cliente.telefono');
    const phone = phoneControl?.value;
    if (phoneControl?.valid && phone.length === 9) {
      this.saleService.getCustomer(phone).subscribe(
        customer => {
          this.addSaleForm.patchValue({
            cliente: {
              nombres: customer.nombres,
              apellidos: customer.apellidos
            }
          });
        },
        error => {
          toastr.error('Cliente no encontrado.', 'Error');
        }
      );
    }
  }

  loadProductos(): void {
    this.productService.getProducts().subscribe(data => {
      console.log(data); // Verificar los datos en la consola
      this.productos = data as any[];
    });
    this.global.initializeSelect2('Seleccione un producto');
  }
}