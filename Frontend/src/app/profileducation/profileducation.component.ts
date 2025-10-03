import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthoService } from 'src/Services/authoservice.service';

@Component({
  selector: 'app-profileducation',
  templateUrl: './profileducation.component.html',
  styleUrls: ['./profileducation.component.css']
})
export class ProfileducationComponent {
  educationSelected: string = '';
  userId: string = '';

  constructor(private Auth: AuthoService, private router: Router) { 
    // Récupération de l'ID utilisateur
    const storedUser = localStorage.getItem('user_id');
    if (storedUser) {
      this.userId = storedUser;
    } else {
      console.error('Aucun utilisateur connecté');
      this.router.navigate(['/login']); // Redirige vers la page de connexion si non connecté
    }
  }

  // Sélection de l'éducation
  selectEducation(value: string): void {
    this.educationSelected = value;
    console.log('Éducation sélectionnée:', value); // Debug
  }

  // Passage à l'étape suivante
  nextStep(): void {
    if (!this.userId) {
      console.error('Utilisateur non connecté');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.educationSelected) {
      console.error('Aucune éducation sélectionnée');
      return;
    }

    this.Auth.updateEducation(this.userId, this.educationSelected)
      .subscribe({
        next: (res) => {
          console.log("Mise à jour réussie", res);
          this.router.navigate(['/pf2']); // Redirection
        },
        error: (err) => {
          console.error("Erreur de mise à jour", err);
          // Gestion d'erreur améliorée
          if (err.status === 404) {
            alert("Utilisateur non trouvé");
          } else {
            alert("Une erreur est survenue lors de la mise à jour");
          }
        }
      });
  }
}