import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as toastr from 'toastr';


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent {
  addUserForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.addUserForm = this.fb.group({
      nombres: ['', Validators.required],
      apellido_paterno: ['', Validators.required],
      apellido_materno: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]*$')]], // Validar como numérico
      pass: ['', Validators.required],
      rol: ['', [Validators.required, Validators.pattern('^[0-9]*$')]] // Validar como numérico
    });
  }

  onSubmit(): void {
    if (this.addUserForm.valid) {
      this.userService.createUser(this.addUserForm.value).subscribe(
        response => {
          if (response.status === 200) {
            toastr.success('Usuario creado exitosamente.', 'Éxito');
            setTimeout(() => {
              this.router.navigate(['/users']);
            }, 2000);
          } else {
            toastr.error('Hubo un error al crear el usuario. Por favor, inténtelo de nuevo.', 'Error');
          }
        },
        error => {
          toastr.error('Hubo un error al crear el usuario. Por favor, inténtelo de nuevo.', 'Error');
        }
      );
    } else {
      this.getFormValidationErrors();
      toastr.error('Por favor, corrige los errores en el formulario.', 'Error');
    }
  }
  
  onBack(): void {
    this.router.navigate(['/user']);
  }
  
  getFormValidationErrors() {
    Object.keys(this.addUserForm.controls).forEach(key => {
      const control = this.addUserForm.get(key);
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