import { Injectable } from '@angular/core';
import { Utente } from '../models/utente';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UtenteService {

  baseApiUrl: string = environment.baseApiUrl; //prendo Urls da enviroment
  isAuthenticated: boolean = false;

  constructor(private http: HttpClient, private router: Router) {
    //non e' un vero e prorio JWT token, si tratta dell'id utente che semplicemente verifico
    //se esiste o meno nel local storage per mantenere accesso nonostante il refresh
    const token = localStorage.getItem('authToken');
    if (token) {
      if (this.isTokenValid(token)) {
        this.isAuthenticated = true;
      }
    }
  }

  //Metodi CRUD
  getAllUtenti(): Observable<Utente[]> {
    return this.http.get<Utente[]>(this.baseApiUrl + '/api/Utente');
  }

  getUtenteById(id: string) {
    return this.http.get<Utente>(this.baseApiUrl + `/api/Utente/GetById/${id}`);
  }

  addUtente(utenteRequest: Utente): Observable<Utente> {
    console.log("Registro utente");
    return this.http.post<Utente>(this.baseApiUrl + '/api/Utente', utenteRequest);
  }

  updateUtente(id: string, utenteRequest: Utente): Observable<Utente> {
    return this.http.put<Utente>(this.baseApiUrl + `/api/Utente/GetById/${id}`, utenteRequest);
  }

  loginUtente(loginRequest: { email: string, password: string }): Observable<Utente> {
    return this.http.post<Utente>(this.baseApiUrl + '/api/Utente/authenticate', loginRequest)
      .pipe(
        tap((utente) => {   //ammetto di non aver capito bene pipe-tap
          if (utente) {
            this.isAuthenticated = true;  //questo mi serve per il GUARD
            localStorage.setItem('authToken', utente.id!); //e questo
          }
        }));
  }

  logoutUtente() {
    localStorage.clear(); //anziche localStorage.removeItem('authToken') copro dal fatto che potenzialmente si potrebbero fare piu login e caricare il local storage all'infinito
    this.isAuthenticated = false;
    this.router.navigate(['']);
  }

  isAuthenticatedUser(): boolean {
    //Questo non lo uso
    return this.isAuthenticated;
  }

  isTokenValid(token: string): boolean {
    if (token)
      return true;
    else
      return false;
  }
}
