import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { AuthoService } from 'src/Services/authoservice.service';

@Component({
  selector: 'app-singup',
  templateUrl: './singup.component.html',
  styleUrls: ['./singup.component.css']
})
export class SingupComponent {

    email: string = '';
    password: string = '';
    name: string = '';
    FamilyName: string = '';
  
    constructor(private Auth: AuthoService, private router: Router) { }
  
    sub(): void {
      console.log("fulname:", this.FamilyName);
      console.log("Email:", this.email);
      console.log("Password:", this.password);
      console.log("name:", this.name);
  
      // Vérification des champs
      if (!this.email || !this.password || !this.name || !this.FamilyName) {
        console.error("Veuillez entrer un email et un mot de passe.");
        return;
      }
  
      // Envoi de la requête d'authentification
      this.Auth.signUp(this.email, this.password , this.name, this.FamilyName)
        .subscribe({
          next: (res) => {
            console.log("register réussie", res);
            this.router.navigate(['/Login']);
          },
          error: (err) => {
            console.error("Erreur lors de la connexion :", err.message);
          }
        });
    }
    images: string[] = [
      'assets/images/bg1.png',
      'assets/images/bg2.png',
      'assets/images/bg3.png',
      'assets/images/bg4.png'
    ];
    
    currentIndex: number = 0;
    
    ngOnInit(): void {
      setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
      }, 4000); // change toutes les 4 secondes
    }

}
