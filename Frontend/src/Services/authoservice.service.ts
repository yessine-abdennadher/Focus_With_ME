import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8000/users'; 

@Injectable({
  providedIn: 'root'
})
export class AuthoService {
  constructor(private http: HttpClient) {}

  // Créer un nouvel utilisateur (inscription initiale)
  signUp(email: string, password: string, name: string, FamilyName: string): Observable<any> {
    return this.http.post(`${API_URL}/register/`, { email, password, name, FamilyName });
  }

  // Authentification
  signInWithEmailAndPassword(email: string, password: string): Observable<any> {
    return this.http.post(`${API_URL}/login/`, { email, password });
  }


  updateEducation(userId: string, education: string): Observable<any> { 
    return this.http.put(`${API_URL}/${userId}/education`, { education });
  }

  updateCountry(userId: string, country: string): Observable<any> { 
    return this.http.put(`${API_URL}/${userId}/country`, { country });
  }
// services/api.service.ts

updateStudyTime(userId: string, timeInMinutes: number) {
  return this.http.put(`http://localhost:8000/users/${userId}/time`, {
    time_par_day: timeInMinutes
  });
}

  updaterang(userId: string, rang: number): Observable<any> { 
    return this.http.put(`${API_URL}/${userId}/rang`, { rang });
  }
     getAllUser(): Observable<any> {
         return this.http.get<any>(`${API_URL}/`);
       } 
getUserById(userId: string): Observable<any> {
    return this.http.get<any>(`${API_URL}/${userId}`);
  }




}