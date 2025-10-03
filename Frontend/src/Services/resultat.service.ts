import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
  const API_URL = 'http://localhost:8000';
@Injectable({
  providedIn: 'root'
})
export class ResultatService {


  constructor(private http: HttpClient) { 
 
  }
    // Méthode pour créer un utilisateur
    SetEmotion(emotion: any): Observable<any> {
      return this.http.post(`${API_URL}/emotions/`, emotion);
    }
     getEmotionByUser(userId: string): Observable<any> {
       return this.http.get<any>(`${API_URL}/emotions/user/${userId}`);
     } 
}
