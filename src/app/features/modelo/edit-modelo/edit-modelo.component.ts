import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModeloService } from '../../../services/modelo.service';
import * as toastr from 'toastr';

@Component({
  selector: 'app-edit-modelo',
  templateUrl: './edit-modelo.component.html',
  styleUrls: ['./edit-modelo.component.scss']
})
export class EditModeloComponent  {
  editModeloForm: FormGroup;
  modeloId: number = 0;

  constructor(
    private fb: FormBuilder,
    private modeloService: ModeloService,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.editModeloForm = this.fb.group({
      id_categoria: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],// Validar como numérico
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.modeloId = id ? + id : 0;
    this.loadModeloData();
  }

  loadModeloData(): void {
    this.modeloService.getModeloById(this.modeloId).subscribe(modelo => {
      this.editModeloForm.patchValue(modelo);
    });
  }

  onSubmit(): void {
    if (this.editModeloForm.valid) {
      this.modeloService.updateModelo(this.modeloId, this.editModeloForm.value).subscribe(
        response => {
          toastr.success('Modelo actualizado exitosamente.', 'Éxito');
          this.router.navigate(['/modelo']);
        },
        error => {
          toastr.error('Hubo un error al actualizar el modelo. Por favor, inténtelo de nuevo.', 'Error');
        }
      );
    } else {
      toastr.error('Por favor, corrige los errores en el formulario.', 'Error');
    }
  }
}


