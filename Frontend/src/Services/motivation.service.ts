import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
const API_URL = 'http://localhost:8000';
@Injectable({
  providedIn: 'root'
})
export class MotivationService {

  constructor(private http: HttpClient) { }
    // Méthode pour récupérer tous les utilisateurs
    getMotivation(): Observable<any> {
      return this.http.get(`${API_URL}/motivations/`);
    }
}
