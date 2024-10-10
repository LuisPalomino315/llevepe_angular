import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SaleService } from '../../../services/sale.service';
import * as toastr from 'toastr';

@Component({
  selector: 'app-edit-sale',
  templateUrl: './edit-sale.component.html',
  styleUrls: ['./edit-sale.component.scss']
})
export class EditSaleComponent implements OnInit {
  editSaleForm: FormGroup;
  saleId: number = 0;

  constructor(
    private fb: FormBuilder,
    private saleService: SaleService,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.editSaleForm = this.fb.group({
      id_usuario: ['', Validators.required],
      id_cliente: ['', Validators.required],
      fecha: ['', Validators.required],
      total: ['', [Validators.required, Validators.pattern('^[0-9]*\.?[0-9]+$')]],
      adelanto: ['', [Validators.required, Validators.pattern('^[0-9]*\.?[0-9]+$')]],
      id_tipo_envio: ['', Validators.required],
      direccion: ['', Validators.required],
      id_distrito: ['', Validators.required],
      observacion: [''],
      flk_activo: [true]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.saleId = id ? +id : 0;
    this.loadSaleData();
  }

  loadSaleData(): void {
    this.saleService.getSaleById(this.saleId).subscribe(sale => {
      this.editSaleForm.patchValue(sale);
    });
  }

  onSubmit(): void {
    if (this.editSaleForm.valid) {
      this.saleService.updateSale(this.saleId, this.editSaleForm.value).subscribe(
        response => {
          toastr.success('Venta actualizada exitosamente.', 'Éxito');
          this.router.navigate(['/sales']);
        },
        error => {
          toastr.error('Hubo un error al actualizar la venta. Por favor, inténtelo de nuevo.', 'Error');
        }
      );
    } else {
      toastr.error('Por favor, corrige los errores en el formulario.', 'Error');
    }
  }
}