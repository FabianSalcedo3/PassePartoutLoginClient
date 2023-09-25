import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UtenteService } from 'src/app/services/utente.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  userForm!: FormGroup;

  constructor(private fb: FormBuilder, private utenteService: UtenteService, private router: Router) {
    this.createForm();
  }

  createForm() {
    this.userForm = this.fb.group({
      email: this.fb.control('', [Validators.required]),
      password: this.fb.control('', [Validators.required]),
    });
  }

  login() {
    this.utenteService.loginUtente({ email: this.userForm.value.email, password: this.userForm.value.password })
      .subscribe({
        next: utente => {
          this.router.navigate(['update/' + utente.id]);
        },
        error: errore => {
          alert('Credenziali errate.'); //Possibile miglioramento: riportare se comunque ha trovato una corrispondenza nella mail
          console.log(errore);
        }
      })
  }
}
