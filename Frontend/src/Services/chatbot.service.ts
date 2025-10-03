import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = 'http://127.0.0.1:8000/chat/';
  private userId = 'user123'; // You can make this dynamic if needed

  constructor(private http: HttpClient) {}

  sendMessage(userMessage: string): Observable<string> {
    return new Observable<string>(observer => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', this.apiUrl, true);
      xhr.setRequestHeader('Content-Type', 'application/json');

      let partialData = '';

      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.LOADING || xhr.readyState === XMLHttpRequest.DONE) {
          const newText = xhr.responseText.substring(partialData.length);
          partialData = xhr.responseText;
          observer.next(newText);
        }

        if (xhr.readyState === XMLHttpRequest.DONE) {
          observer.complete();
        }
      };

      xhr.onerror = () => {
        observer.error('Erreur réseau');
      };

      // Send both message and user_id to match FastAPI schema
      const body = {
        message: userMessage,
        user_id: this.userId
      };

      xhr.send(JSON.stringify(body));
    });
  }
}