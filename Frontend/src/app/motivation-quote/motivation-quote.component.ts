import { Component, OnInit } from '@angular/core';
import { MotivationService } from 'src/Services/motivation.service';

@Component({
  selector: 'app-motivation-quote',
  templateUrl: './motivation-quote.component.html',
  styleUrls: ['./motivation-quote.component.css']
})
export class MotivationQuoteComponent implements OnInit {
  constructor(private mot: MotivationService) {}

  currentQuote: string = '';
  currentAuthor: string = '';
  motivationQuotes: any[] = [];

  ngOnInit(): void {
    this.mot.getMotivation().subscribe(
      (data) => {
        console.log("Réponse brute reçue :", data);

        // ✅ Mise à jour ici
        this.motivationQuotes = data.motivations;

        if (this.motivationQuotes.length > 0) {
          const random = this.getRandomQuote();
          this.currentQuote = random.motivation;
          this.currentAuthor = random.auteur;
        }
      },
      (error) => {
        console.error("Erreur lors de la récupération des citations :", error);
      }
    );
  }

  getRandomQuote() {
    const index = Math.floor(Math.random() * this.motivationQuotes.length);
    return this.motivationQuotes[index];
  }
}
