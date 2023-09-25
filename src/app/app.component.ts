import { Component, OnInit } from '@angular/core';
import { Utente } from './models/utente';
import { UtenteService } from './services/utente.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'PassePartoutLogin';
  utenti: Utente[] = [];

  constructor(private utenteService: UtenteService) { }

  //Metodo utile per il debugging
  ngOnInit(): void {
    this.utenteService.getAllUtenti()
      .subscribe({
        next: utenti => {
          console.log(utenti);
        },
        error: result => {
          console.log(result);
        }
      });
  }
}
