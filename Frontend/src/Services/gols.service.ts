import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8000'; // Adresse de ton backend FastAPI

@Injectable({
  providedIn: 'root'
})
export class GolsService {
  constructor(private http: HttpClient) {}

  getAllButs(): Observable<any> {
    return this.http.get<any>(`${API_URL}/buts/`);
  }

  createBut(but: any): Observable<any> {
    return this.http.post<any>(`${API_URL}/buts/`, but);
  }

  getButsByUser(userId: string): Observable<any> {
    return this.http.get<any>(`${API_URL}/buts/user/${userId}`);
  }

  deleteBut(butId: string): Observable<void> {
    return this.http.delete<void>(`${API_URL}/buts/${butId}`);
  }
}
