import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { AuthoService } from 'src/Services/authoservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string = '';
  password: string = '';

  constructor(private Auth: AuthoService, private router: Router) { }

  sub(): void {
    console.log("Email:", this.email);
    console.log("Password:", this.password);

    // Vérification des champs
    if (!this.email || !this.password) {
      console.error("Veuillez entrer un email et un mot de passe.");
      return;
    }

    // Envoi de la requête d'authentification
    this.Auth.signInWithEmailAndPassword(this.email, this.password)
    .subscribe({
      next: (res) => {
        console.log("Connexion réussie", res);
        localStorage.setItem("token", res.token); // Stocker le token
        localStorage.setItem('user_id', res.user_id);
    console.log("education :", res.education);
      
          if(!res.education || res.education === "null") {
            this.router.navigate(['/bg']);
          }
          else { 
          this.router.navigate(['']);
          }
 
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
