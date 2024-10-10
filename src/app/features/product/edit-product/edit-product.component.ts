import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import * as toastr from 'toastr';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent {
  editProductForm: FormGroup;
  productId: number = 0;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.editProductForm = this.fb.group({
      id_modelo: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],// Validar como numérico
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.pattern('^[0-9]*$')]], // Validar como numérico
      stock: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],// Validar como numérico
      foto: ['', Validators.required],
      talla: ['', Validators.required]// Validar como numérico
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.productId = id ? + id : 0;
    this.loadProductData();
  }

  loadProductData(): void {
    this.productService.getProductById(this.productId).subscribe(product => {
      this.editProductForm.patchValue(product);
    });
  }

  onSubmit(): void {
    if (this.editProductForm.valid) {
      this.productService.updateProduct(this.productId, this.editProductForm.value).subscribe(
        response => {
          toastr.success('Producto actualizado exitosamente.', 'Éxito');
          this.router.navigate(['/product']);
        },
        error => {
          toastr.error('Hubo un error al actualizar el producto. Por favor, inténtelo de nuevo.', 'Error');
        }
      );
    } else {
      toastr.error('Por favor, corrige los errores en el formulario.', 'Error');
    }
  }
}

