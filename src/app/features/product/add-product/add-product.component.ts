import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as toastr from 'toastr';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent {
  addProductForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    this.addProductForm = this.fb.group({
      id_modelo: ['',[Validators.required, Validators.pattern('^[0-9]*$')]], // Validar como numérico
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['',  [Validators.required, Validators.pattern('^[0-9]*$')]], // Validar como numérico
      stock: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],// Validar como numérico
      foto: ['', Validators.required], 
      talla: ['', Validators.required]// Validar como numérico
    });
  }

  onSubmit(): void {
    if (this.addProductForm.valid) {
      this.productService.createProduct(this.addProductForm.value).subscribe(
        response => {
          console.log(response.status);
          if (response.status === 201) {
            toastr.success('Producto creado exitosamente.', 'Éxito');
            setTimeout(() => {
              this.router.navigate(['/product']);
            }, 1000);
          } else {
            toastr.error('Hubo un error al crear el producto. Por favor, inténtelo de nuevo.', 'Error');
          }
        },
        error => {
          toastr.error('Hubo un error al crear el producto. Por favor, inténtelo de nuevo.', 'Error');
        }
      );
    } else {
      this.getFormValidationErrors();
      toastr.error('Por favor, corrige los errores en el formulario.', 'Error');
    }
  }
  
  onBack(): void {
    this.router.navigate(['/products']);
  }
  
  getFormValidationErrors() {
    Object.keys(this.addProductForm.controls).forEach(key => {
      const control = this.addProductForm.get(key);
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
}


