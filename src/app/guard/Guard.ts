import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { UtenteService } from '../services/utente.service';
//Utilizzo canactivate anche se deprecato esclusivamente per comodita

@Injectable({
  providedIn: 'root',
})
export class Guard implements CanActivate {

  constructor(private utenteService: UtenteService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentMenu = route.url[0].path;

    if (currentMenu === 'update') {
      if (this.utenteService.isAuthenticatedUser()) {
        return true;
      } else {
        alert('Utente non riconosciuto');
        this.router.navigate(['']);
        return false;
      }
    }
    return true; // Ritorna true per consentire l'accesso ad altre rotte..
  }
}


