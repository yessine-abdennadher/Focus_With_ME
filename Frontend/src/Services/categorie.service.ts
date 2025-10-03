import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8000';
@Injectable({
  providedIn: 'root'
})
export class CategorieService {

  constructor(private http: HttpClient) { }
      
  // Méthode pour récupérer tous les utilisateurs
  getCategories(): Observable<any> {
    return this.http.get(`${API_URL}/categories/`);
  }

  // Méthode pour créer un utilisateur
  createCategories(categorie: any): Observable<any> {
    return this.http.post(`${API_URL}/categories/`, categorie);
  }
}
