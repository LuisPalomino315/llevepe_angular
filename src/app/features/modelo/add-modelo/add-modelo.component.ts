import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModeloService } from '../../../services/modelo.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as toastr from 'toastr';

@Component({
  selector: 'app-add-modelo',
  templateUrl: './add-modelo.component.html',
  styleUrls: ['./add-modelo.component.scss']
})
export class AddModeloComponent {
  addModeloForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modeloService: ModeloService,
    private router: Router
  ) {
    this.addModeloForm = this.fb.group({
      id_categoria: ['',[Validators.required, Validators.pattern('^[0-9]*$')]], // Validar como numérico
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.addModeloForm.valid) {
      this.modeloService.createModelo(this.addModeloForm.value).subscribe(
        response => {
          console.log(response.status);
          if (response.status === 201) {
            toastr.success('Modelo creado exitosamente.', 'Éxito');
            setTimeout(() => {
              this.router.navigate(['/models']);
            }, 1000);
          } else {
            toastr.error('Hubo un error al crear el modelo. Por favor, inténtelo de nuevo.', 'Error');
          }
        },
        error => {
          toastr.error('Hubo un error al crear el modelo. Por favor, inténtelo de nuevo.', 'Error');
        }
      );
    } else {
      this.getFormValidationErrors();
      toastr.error('Por favor, corrige los errores en el formulario.', 'Error');
    }
  }
  
  onBack(): void {
    this.router.navigate(['/models']);
  }
  
  getFormValidationErrors() {
    Object.keys(this.addModeloForm.controls).forEach(key => {
      const control = this.addModeloForm.get(key);
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



