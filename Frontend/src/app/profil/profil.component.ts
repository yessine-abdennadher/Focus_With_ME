import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthoService } from 'src/Services/authoservice.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {

  countryInput: string = '';
  countries: string[] = [];
  filteredCountries: string[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  userId: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthoService
  ) {
    const storedUser = localStorage.getItem('user_id');
    if (storedUser) {
      this.userId = storedUser;
    } else {
      console.error('Aucun utilisateur connecté');
      this.router.navigate(['/login']); // Redirige vers la page de connexion si non connecté
    }
  }

  ngOnInit(): void {
    this.loadCountries();
  }

  loadCountries(): void {
    this.isLoading = true;
    this.http.get<any[]>('https://restcountries.com/v3.1/all')
      .subscribe({
        next: (data) => {
          this.countries = data.map(country => country.name.common).sort();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des pays', error);
          this.errorMessage = "Impossible de charger la liste des pays.";
          this.isLoading = false;
        }
      });
  }

  onInputChange(): void {
    const query = this.countryInput.toLowerCase().trim();
    if (query.length > 0) {
      this.filteredCountries = this.countries
        .filter(country => country.toLowerCase().includes(query))
        .slice(0, 5);
    } else {
      this.filteredCountries = [];
    }
  }

  selectCountry(country: string): void {
    this.countryInput = country;
    this.filteredCountries = [];
  }

  nextStep(): void {
    if (!this.userId) {
      console.error('Utilisateur non connecté.');
      return;
    }

    if (!this.countryInput) {
      console.error('Aucun pays sélectionné.');
      return;
    }

    this.authService.updateCountry(this.userId, this.countryInput)
      .subscribe({
        next: (response) => {
          console.log('Mise à jour du pays réussie', response);
          this.router.navigate(['/pf3']); // Correction : aller à l'étape suivante "pf3"
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour du pays', error);
        }
      });
  }
}
