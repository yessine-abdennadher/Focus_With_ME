import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GolsService } from 'src/Services/gols.service';

@Component({
  selector: 'app-study-goals',
  templateUrl: './study-goals.component.html',
  styleUrls: ['./study-goals.component.css']
})
export class StudyGoalsComponent implements OnInit {
  form: FormGroup;
  goals: any[] = [];
  activeTab: 'open' | 'completed' = 'open';
  today: Date = new Date();
  nomUtilisateur: string = "";
  nomFamille: string = "";
  newGoal: string = '';

  constructor(
    private GS: GolsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      user_id: [''],
      but: ['']
    });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const decoded = this.decodeToken(token);

    if (decoded && decoded.user_id) {
      this.form.patchValue({ user_id: decoded.user_id });
      this.nomUtilisateur = decoded.name || '';
      this.nomFamille = decoded.FamilyName || '';
      this.loadGoals(decoded.user_id);
    }
  }

  loadGoals(userId: string): void {
    this.GS.getButsByUser(userId).subscribe({
      next: (data) => {
        this.goals = data.buts;
        console.log('Buts récupérés:', this.goals);
      },
      error: (error) => {
        console.error("Erreur lors de la récupération des buts :", error);
      }
    });
  }

  submitGoal(): void {
    if (this.form.valid) {
      this.GS.createBut(this.form.value).subscribe({
        next: (res) => {
          console.log('Goal envoyé', res);
          this.form.reset();
          this.ngOnInit();
        },
        error: (err) => {
          console.error("Erreur lors de l'envoi du goal :", err);
        }
      });
    }
  }
  
  removeGoal(goalId: string): void {
    this.GS.deleteBut(goalId).subscribe({
      next: () => {
        console.log('Goal supprimé');
        this.goals = this.goals.filter(goal => goal.id !== goalId);
   
   
      },
      error: (error) => {
        console.error("Erreur lors de la suppression du but :", error);
      }
    });
  }

  decodeToken(token: string | null): any {
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      console.error('Erreur de décodage du token', e);
      return null;
    }
  }
}
