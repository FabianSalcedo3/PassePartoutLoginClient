import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Utente } from 'src/app/models/utente';
import { UtenteService } from 'src/app/services/utente.service';
import { CustomValidators } from 'src/app/validators/classe/custom-validators';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent {
  utente?: Utente;
  userForm!: FormGroup;
  userId: string = '';

  constructor(private fb: FormBuilder, private utenteService: UtenteService, private router: Router, private param: ActivatedRoute) {
    this.createForm();
    this.loadUtente();
  }

  createForm() {
    //Creazione form e validazioni era piu' opportuno astrarle
    this.userForm = this.fb.group({
      id: this.fb.control(''),
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
        CustomValidators.patternValidator(/[@#{}|!()*{}]/, { hasSpecialCharacters: true }),
      ]),
      nome: this.fb.control('', [Validators.required]),
      cognome: this.fb.control('', [Validators.required]),
      citta: this.fb.control('', [Validators.required]),
    });
  }

  loadUtente(): void {
    //Recupero id da url e di conseguenza le credenziali utente da portare nello userform
    this.userId = this.param.snapshot.params['id'];
    this.utenteService.getUtenteById(this.userId).subscribe({
      next: utente => {
        this.userForm.patchValue({
          id: utente.id,
          email: utente.email,
          password: '',
          nome: utente.nome,
          cognome: utente.cognome,
          citta: utente.citta
        });
        this.userForm.get('id')?.disable();
      },
      error: errore => {
        console.log(errore);
        this.utenteService.isAuthenticated = false;
        this.router.navigate(['']);
      }
    });
  }

  updateUtente() {
    //Lancio l'update (Ritorno un utente ma che effettivamente non sfrutto)
    this.utenteService.updateUtente(this.userForm.get('id')?.value, this.userForm.value).subscribe({
      next: utente => {
        alert('Profilo modificato!');
        return utente;
      },
      error: errore => {
        console.log(errore);
      }
    })
  }

  logout() {
    this.utenteService.logoutUtente();
  }
}
