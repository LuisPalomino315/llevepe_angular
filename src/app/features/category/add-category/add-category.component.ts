import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as toastr from 'toastr';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent {
 addCategoryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private router: Router
  ) {
    this.addCategoryForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.addCategoryForm.valid) {
      this.categoryService.createCategory(this.addCategoryForm.value).subscribe(
        response => {
          console.log(response.status);
          if (response.status === 201) {
            toastr.success('Categoria creado exitosamente.', 'Éxito');
            setTimeout(() => {
              this.router.navigate(['/category']);
            }, 1000);
          } else {
            toastr.error('Hubo un error al crear la categoria. Por favor, inténtelo de nuevo.', 'Error');
          }
        },
        error => {
          toastr.error('Hubo un error al crear la categoria. Por favor, inténtelo de nuevo.', 'Error');
        }
      );
    } else {
      this.getFormValidationErrors();
      toastr.error('Por favor, corrige los errores en el formulario.', 'Error');
    }
  }
  
  onBack(): void {
    this.router.navigate(['/categorys']);
  }
  
  getFormValidationErrors() {
    Object.keys(this.addCategoryForm.controls).forEach(key => {
      const control = this.addCategoryForm.get(key);
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
