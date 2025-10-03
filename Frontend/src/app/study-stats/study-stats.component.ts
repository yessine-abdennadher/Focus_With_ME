import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartOptions } from 'chart.js';
import { ApiService } from 'src/Services/api.service';
import { ResultatService } from 'src/Services/resultat.service';
import { AuthoService } from 'src/Services/authoservice.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartType } from 'chart.js';



@Component({
  selector: 'app-study-stats',
  templateUrl: './study-stats.component.html',
  styleUrls: ['./study-stats.component.css']
})
export class StudyStatsComponent implements OnInit {

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  nomUtilisateur: string = "";
  nomfaimly: string = "";
  education: string = "";
  country: string = "";
  user_id: string = '';
  time_par_day: number = 0;
  rang: number = 0;
  studyTime = 0;
  time: number = 0;
  currentChartType: 'line' | 'bar' | 'doughnut' = 'line';
  currentEmotionChartType: 'doughnut' | 'bar' = 'doughnut';

  chartLabels: string[] = [];
  usersStudyTime: { name: string, rang: number, time: number }[] = [];

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['exhausted', 'Tired', 'Concentrated'],

    datasets: [
      { 
        data: [], 
        label: 'Emotion Frequency', 
      
      }
    ]
  };
public pieChartType: ChartType = 'doughnut';
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {

  };

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      { data: [],  },
      { data: [], },
      { data: []}
    ]
  };

  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Emotion Evolution Over Time'
      }
    },
  scales: {
  y: {
    beginAtZero: true,
    suggestedMax: 100,
    title: { display: true, text: 'Concentration (%)' },
    ticks: {
      callback: (value) => value + '%'
    }
  }
}
,
    elements: {
      line: {
        tension: 0.4,
        borderWidth: 2
      },
      point: {
        radius: 4,
        hoverRadius: 6
      }
    }
  };

public pieChartData: ChartConfiguration<'doughnut'>['data'] = {
  labels: ['Concentrated', 'Not Concentrated'],
  datasets: [{
    data: [60, 40],

  }]
};


public pieChartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#374151' // Couleur du texte
      }
    },
    title: {
      display: true,
      text: 'Concentration Distribution',
      color: '#374151'
    }
  }
};


  constructor(
    private apiService: ApiService,
    private resultat: ResultatService,
    private authoservice: AuthoService
  ) {}

  ngOnInit(): void {
    
     this.currentEmotionChartType = 'doughnut'; 
    const token = localStorage.getItem('token');
    const decoded = this.decodeToken(token);

    if (decoded) {
      this.nomUtilisateur = decoded.name;
      this.nomfaimly = decoded.FamilyName;
      this.education = decoded.education;
      this.country = decoded.country;
      this.time_par_day = decoded.time_par_day || 0;
      this.studyTime = parseFloat((decoded.time_par_day / 60).toFixed(1));
      this.time = parseFloat(((this.studyTime * 0.60) % 1).toFixed(1));
      this.rang = decoded.rang || 0;
      this.user_id = decoded.user_id;

      this.loadEmotionsForUser(this.user_id);
        this.loadEmotionsForUserr(this.user_id);
         this.loadEmotionsForUserrr(this.user_id);  
      this.loadLeaderboard();
    }
  }



  setEmotionChartType(type: 'bar' | 'doughnut'): void {
    this.currentEmotionChartType = type;
  }



  decodeToken(token: string | null): any {
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      console.error("Error decoding token:", e);
      return null;
    }
  }

loadEmotionsForUserr(user_id: string): void {
  this.resultat.getEmotionByUser(user_id).subscribe({
    next: (emotions) => {
      console.log('Emotions:', emotions);

      emotions.sort((a: any, b: any) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      const emotionByTime: {
        [key: string]: { Fatigue1: number; Fatigue2: number; Neutre: number };
      } = {};

      for (let em of emotions) {
        const timeLabel = new Date(em.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        });

        if (!emotionByTime[timeLabel]) {
          emotionByTime[timeLabel] = { Fatigue1: 0, Fatigue2: 0, Neutre: 0 };
        }

        if (em.emotion in emotionByTime[timeLabel]) {
          emotionByTime[timeLabel][em.emotion as keyof typeof emotionByTime[string]] += 1;
        }
      }

      const labels: string[] = Object.keys(emotionByTime).sort();
      const fatigue2: number[] = [];
      const fatigue1: number[] = [];
      const neutre: number[] = [];
      const concentration: number[] = [];

      for (const time of labels) {
        const f2 = emotionByTime[time].Fatigue2;
        const f1 = emotionByTime[time].Fatigue1;
        const n = emotionByTime[time].Neutre;

        const total = f2 + f1 + n;
        const weighted =
          total > 0 ? (f2 * 0 + f1 * 1 + n * 3) / total : 0;

        fatigue2.push(f2);
        fatigue1.push(f1);
        neutre.push(n);
        concentration.push(parseFloat(weighted.toFixed(2)));
      }

// 🎯 Courbe unique : concentration logique
const concentrationValues: number[] = [];
for (const time of labels) {
  const total = emotionByTime[time].Fatigue2 + emotionByTime[time].Fatigue1 + emotionByTime[time].Neutre;
  const score = total > 0
    ? (
        emotionByTime[time].Fatigue2 * 0 +
        emotionByTime[time].Fatigue1 * 0.5 +
        emotionByTime[time].Neutre * 1
      ) / total
    : 0;
  concentrationValues.push(Math.round(score * 100)); // Convert to %
}

this.lineChartData = {
  labels,
  datasets: [
    {
      data: concentrationValues,
      label: 'Concentration (%)',
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      fill: true,
      tension: 0.4
    }
  ]
};
// concentrationScore = (Fatigue2 * 0 + Fatigue1 * 0.5 + Neutre * 1) / total
// concentrationPourcentage = concentrationScore * 100



      // 🔢 Graphe en barres (compte total par émotion)
      const fatigue2Total = fatigue2.reduce((acc, val) => acc + val, 0);
      const fatigue1Total = fatigue1.reduce((acc, val) => acc + val, 0);
      const neutreTotal = neutre.reduce((acc, val) => acc + val, 0);

 



      if (this.chart) this.chart.update();
    },
    error: (err) => {
      console.error('Error loading emotions', err);
    }
  });
}

loadEmotionsForUserrr(user_id: string): void {
  this.resultat.getEmotionByUser(user_id).subscribe({
    next: (emotions) => {
      console.log('Emotions:', emotions);

      let totalScore = 0;
      let totalCount = 0;

      for (let em of emotions) {
        // Calcul du score de concentration
        if (em.emotion === 'Neutre') {
          totalScore += 100;
          totalCount += 1;
        } else if (em.emotion === 'Fatigue1') {
          totalScore += 50;
          totalCount += 1;
        } else if (em.emotion === 'Fatigue2') {
          totalScore += 0;
          totalCount += 1;
        }
      }

      // Calcul du pourcentage global de concentration
      const concentration = totalCount > 0 ? Math.round(totalScore / totalCount) : 0;
      const nonConcentration = 100 - concentration;

      // Mise à jour du pie chart avec 2 parties : Concentré vs Non Concentré
this.pieChartData = {
  labels: ['Concentrated', 'Not Concentrated'],
  datasets: [{
    data: [concentration, nonConcentration],
    backgroundColor: ['#3F84F6', '#f87171'],
    hoverBackgroundColor: ['#3B82F6', '#ef4444'],
     hoverBorderColor: ['#3B82F6', '#ef4444'], // couleur de la bordure (blanc par exemple)
    borderWidth: 2           // épaisseur de la bordure
  }]
};


      if (this.chart) this.chart.update();
    },
    error: (err) => {
      console.error('Error loading emotions', err);
    }
  });
}




  
  loadEmotionsForUser(user_id: string): void {
    this.resultat.getEmotionByUser(user_id).subscribe({
      next: (emotions) => {
        console.log('Emotions:', emotions);

        emotions.sort((a: any, b: any) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        const emotionByTime: { [key: string]: { Fatigue1: number; Fatigue2: number; Neutre: number } } = {};

        for (let em of emotions) {
          const timeLabel = new Date(em.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          });

          if (!emotionByTime[timeLabel]) {
            emotionByTime[timeLabel] = { Fatigue1: 0, Fatigue2: 0, Neutre: 0 };
          }

          if (em.emotion in emotionByTime[timeLabel]) {
            emotionByTime[timeLabel][em.emotion as keyof typeof emotionByTime[string]] += 1;
          }
        }

        const labels: string[] = Object.keys(emotionByTime).sort();
        const fatigue2: number[] = [];
        const fatigue1: number[] = [];
        const neutre: number[] = [];

        for (const time of labels) {
          fatigue2.push(emotionByTime[time].Fatigue2);
          fatigue1.push(emotionByTime[time].Fatigue1);
          neutre.push(emotionByTime[time].Neutre);
        }



        const fatigue2Total = fatigue2.reduce((acc, val) => acc + val, 0);
        const fatigue1Total = fatigue1.reduce((acc, val) => acc + val, 0);
        const neutreTotal = neutre.reduce((acc, val) => acc + val, 0);

   this.barChartData = {
  labels: ['Exhausted', 'Tired', 'Focused'],
  datasets: [{
    backgroundColor: ['#DD093B', '#f87171', '#60a5fa'],
    hoverBackgroundColor: ['#B80A2D', '#f87171', '#3B82F6'],
    hoverBorderColor: ['#B80A2D', '#f87171', '#3B82F6'], // couleur de la bordure (blanc par exemple)
    data: [fatigue2Total, fatigue1Total, neutreTotal],
  }]
};

this.barChartOptions = {
  responsive: true,
  maintainAspectRatio: false, // Optionnel, utile pour une meilleure adaptation à la taille du conteneur
  scales: {
    x: {
      title: {
        display: true,
       
        font: {
          size: 14
        }
      },
      ticks: {
        font: {
          size: 12
        }
      }
    },
    y: {
      beginAtZero: true,
      max: 100,
      title: {
        display: true,
        
        font: {
          size: 14
        }
      },
      ticks: {
        stepSize: 10,
        callback: function (value) {
          return value + '%';
        },
        font: {
          size: 12
        }
      }
    }
  },
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: true,
      text: 'Drowsy Frequency Distribution',
      position: 'top',
      font: {
        size: 12
      },
      padding: {
        top: 10,
        bottom: 20
      }
    },
    tooltip: {
      callbacks: {
        label: function (ctx) {
          return ctx.raw + '%';
        }
      }
    }
  },
  animation: {
    duration: 1000,
    easing: 'easeOutBounce'
  }
};






        if (this.chart) this.chart.update();
      },
      error: (err) => {
        console.error('Error loading emotions', err);
      }
    });
  }

  loadLeaderboard(): void {
    this.authoservice.getAllUser().subscribe({
      next: (response) => {
        const users = response.users || [];

        const sorted = users
          .map((user: any) => ({
            name: `${user.name} ${user.FamilyName || ''}`,
            time: user.time_par_day || 0
          }))
          .sort((a: { name: string; time: number }, b: { name: string; time: number }) => b.time - a.time);

        this.usersStudyTime = sorted.map((u: { name: string; time: number }, i: number) => ({
          name: u.name,
          time: u.time,
          rang: i + 1
        }));
      },
      error: (err) => {
        console.error('Error loading users', err);
      }
    });
  }


}