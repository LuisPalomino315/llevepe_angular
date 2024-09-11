import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import * as toastr from 'toastr';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  editUserForm: FormGroup;
  userId: number = 0;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.editUserForm = this.fb.group({
      nombres: ['', Validators.required],
      apellido_paterno: ['', Validators.required],
      apellido_materno: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      pass: ['', Validators.required],
      rol: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.userId = id ? + id : 0;
    this.loadUserData();
  }

  loadUserData(): void {
    this.userService.getUserById(this.userId).subscribe(user => {
      this.editUserForm.patchValue(user);
    });
  }

  onSubmit(): void {
    if (this.editUserForm.valid) {
      this.userService.updateUser(this.userId, this.editUserForm.value).subscribe(
        response => {
          toastr.success('Usuario actualizado exitosamente.', 'Éxito');
          this.router.navigate(['/user']);
        },
        error => {
          toastr.error('Hubo un error al actualizar el usuario. Por favor, inténtelo de nuevo.', 'Error');
        }
      );
    } else {
      toastr.error('Por favor, corrige los errores en el formulario.', 'Error');
    }
  }
}