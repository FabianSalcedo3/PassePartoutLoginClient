import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Utente } from 'src/app/models/utente';
import { UtenteService } from 'src/app/services/utente.service';
import { CustomValidators } from 'src/app/validators/classe/custom-validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  utente?: Utente;
  userForm!: FormGroup;

  constructor(private fb: FormBuilder, private utenteService: UtenteService, private router: Router) {
    this.createForm();
  }

  createForm() {
    this.userForm = this.fb.group({
      email: this.fb.control('', [
        Validators.required,
        CustomValidators.patternValidator(
          /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i,
          { invalidEmail: true }
        )
      ]),
      password: this.fb.control('', [
        Validators.required,
        CustomValidators.patternValidator(/\d/, { hasNumber: true }),
        CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
        CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
        CustomValidators.patternValidator(/[@#{}|!()*{}]/, { hasSpecialCharacters: true }), //Non ho messo la regex per la lunghezza per agevolare l'esercizio
      ]),
      nome: this.fb.control('', [Validators.required]),
      cognome: this.fb.control('', [Validators.required]),
      citta: this.fb.control('', [Validators.required]),
    });
  }

  createUser() {
    this.utente = new Utente();
    this.utente.id = '00000000-0000-0000-0000-000000000000'; // Guid lato server
    this.utente.email = this.userForm.value.email;
    this.utente.password = this.userForm.value.password;
    this.utente.nome = this.userForm.value.nome;
    this.utente.cognome = this.userForm.value.cognome;
    this.utente.citta = this.userForm.value.citta;
    this.utenteService.addUtente(this.utente)
      .subscribe({
        next: utente => { //in futuro riporto la mail dell'utente gia' preinserita nella login una volta reindirizzato
          this.router.navigate(['']);
        },
        error: errore => {
          console.log(errore);
        }
      });
  }

}

