import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModeloService } from '../../../services/modelo.service';
import { GlobalService } from 'src/app/services/global.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as toastr from 'toastr';
import { CategoryService } from 'src/app/services/category.service';
import 'select2';

@Component({
  selector: 'app-add-modelo',
  templateUrl: './add-modelo.component.html',
  styleUrls: ['./add-modelo.component.scss']
})
export class AddModeloComponent {
  addModeloForm: FormGroup;
  categorys: any[] = [];

  constructor(
    private fb: FormBuilder,
    private modeloService: ModeloService,
    private categoryService: CategoryService,
    private global: GlobalService,
    private router: Router
    
  ) {
    this.addModeloForm = this.fb.group({
      id_categoria: ['',[Validators.required, Validators.pattern('^[0-9]*$')]], // Validar como numérico
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
    });
  }

  ngOnInit():void {
    this.loadModelo();
  }

  ngAfterViewInit(): void {
    const selectCategory = $('#id_categoria');
    console.log(selectCategory)
    // Detectar cambios en select2 y actualizar el formControl de Angular
    selectCategory.on('change', (e: any) => {
      const selectedValue = e.target.value;
      console.log(selectedValue)
      this.addModeloForm.get('id_categoria')?.setValue(selectedValue);
    });
  }

  onSubmit(): void {
    console.log(this.addModeloForm)
    if (this.addModeloForm.valid) {
      this.modeloService.createModelo(this.addModeloForm.value).subscribe(
        response => {
          console.log(response.status);
          if (response.status === 201) {
            toastr.success('Modelo creado exitosamente.', 'Éxito');
            setTimeout(() => {
              this.router.navigate(['/modelo']);
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
    this.router.navigate(['/modelo']);
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

  loadModelo(): void {
    this.categoryService.getCategorys().subscribe(data => {
      console.log(data); // Verificar los datos en la consola
      this.categorys = data as any[];
    });
    this.global.initializeSelect2('Seleccione una categoria');
  }
}



