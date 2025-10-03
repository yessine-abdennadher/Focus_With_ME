import { Component, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from 'src/Services/api.service';
import { AuthoService } from 'src/Services/authoservice.service';
import { ResultatService } from 'src/Services/resultat.service';

@Component({
  selector: 'app-modal-studystats',
  templateUrl: './modal-studystats.component.html',
  styleUrls: ['./modal-studystats.component.css']
})
export class ModalStudystatsComponent {
  @ViewChild('video', { static: false }) video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;

  predictionResult: any;
  errorMessage: string | null = null;
  running = false;

  chartLabels: string[] = [];
  fatigue2Data: number[] = [];
  fatigue1Data: number[] = [];
  neutreData: number[] = [];
  studyTime = 0;
  studyTimeMinutes!: number;
monitoringActive = false; // état du bouton et de la caméra

  timer: any;

  levelName = '';
  levelRange = '';
  nextLevel = '';
  remainingTime = '';
  levelProgress = 0;

  leaderboardRank = 0;
  currentUserId: string = '';
  usersStudyTime: any[] = [];
  user_id: string = '';

  levels = [
    { name: 'Member', min: 0, max: 10 },
    { name: 'Entry', min: 10, max: 60 },
    { name: 'Intermediate', min: 60, max: 180 },
    { name: 'Advanced', min: 180, max: 600 },
    { name: 'Elite', min: 600, max: 10000 }
  ];

  constructor(private apiService: ApiService, private authoservice: AuthoService ,private resultat:ResultatService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const decoded = this.decodeToken(token);

    if (decoded) {
      this.user_id = decoded.user_id;
      this.currentUserId = decoded.user_id;

      this.authoservice.getUserById(this.user_id).subscribe({
        next: (user) => {
          this.studyTimeMinutes = user.time_par_day || 0;
          this.studyTime = parseFloat((this.studyTimeMinutes / 60).toFixed(1));
          this.calculateLevel();
        }
      });

      this.authoservice.getAllUser().subscribe({
        next: (response) => {
          const users = response.users;

          this.usersStudyTime = users.map((user: any) => ({
            id: user.id,
            name: user.name || 'Inconnu',
            userTime: user.time_par_day || 0
          }));

          this.startTracking();
          this.updateUserTime();
        },
        error: (err) => {
          console.error("Erreur chargement utilisateurs", err);
        }
      });
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  startTracking(): void {
    const token = localStorage.getItem('token');
    const decoded = this.decodeToken(token);

    this.timer = setInterval(() => {
      this.studyTimeMinutes += 0.1;
      decoded.time_par_day = this.studyTimeMinutes;
      this.studyTime = parseFloat((decoded.time_par_day / 60).toFixed(1));
      this.calculateLevel();
      this.updateUserTime();
      this.updateRank(this.currentUserId);
    }, 6000);
  }

  decodeToken(token: string | null): any {
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      console.error("Erreur lors du décodage du token:", e);
      return null;
    }
  }

  updateUserTime(): void {
    const token = localStorage.getItem('token');
    const decoded = this.decodeToken(token);

    if (decoded) {
      decoded.time_par_day = this.studyTimeMinutes;
      this.authoservice.updateStudyTime(decoded.user_id, this.studyTimeMinutes).subscribe({
        next: (res) => {
          console.log('Temps mis à jour avec succès', res);
        },
        error: (err) => {
          console.error('Erreur de mise à jour du temps', err);
        }
      });
    }
  }

  calculateLevel(): void {
    console.log("🔁 Calcul du niveau appelé", this.studyTimeMinutes);
    for (let i = 0; i < this.levels.length; i++) {
      const level = this.levels[i];
      if (this.studyTimeMinutes >= level.min && this.studyTimeMinutes < level.max) {
        this.levelName = level.name;
        this.levelRange = `${level.min}m-${level.max}m`;
        const next = this.levels[i + 1];
        this.nextLevel = next ? `${next.name} (${next.min}m-${next.max}m)` : 'Max Level';
        const remaining = level.max - this.studyTimeMinutes;
        this.remainingTime = (remaining / 60).toFixed(1);
        this.levelProgress = ((this.studyTimeMinutes - level.min) / (level.max - level.min)) * 100;
   
        return;
      }
    }
  }

  

  async startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoEl = this.video.nativeElement;
      videoEl.srcObject = stream;

      await new Promise(resolve => {
        videoEl.onloadedmetadata = () => {
          videoEl.play();
          resolve(null);
        };
      });
    } catch (err) {
      this.errorMessage = 'Erreur caméra';
      console.error(err);
    }
  }

  get formattedStudyTime(): string {
    if (this.studyTimeMinutes < 60) {
      return `${Math.round(this.studyTimeMinutes)} min`;
    } else {
      const hours = (this.studyTimeMinutes / 60).toFixed(1);
      return `${hours} h`;
    }
  }

  async captureLoop(durationSec: number) {
    const intervalSec = 10;
    for (let elapsed = 0; elapsed < durationSec; elapsed += intervalSec) {
      if (!this.running) break;
      await this.captureAndSend();
      await this.waitSeconds(intervalSec);
    }
  }



  addChartPoint(prediction: string, confidence: number) {
    const time = new Date().toLocaleTimeString();
    this.chartLabels.push(time);

    this.fatigue2Data.push(prediction === 'Fatigue2' ? confidence * 100 : 0);
    this.fatigue1Data.push(prediction === 'Fatigue1' ? confidence * 100 : 0);
    this.neutreData.push(prediction === 'Neutre' ? confidence * 100 : 0);

    if (this.chartLabels.length > 20) {
      this.chartLabels.shift();
      this.fatigue2Data.shift();
      this.fatigue1Data.shift();
      this.neutreData.shift();
    }
  }



  waitSeconds(seconds: number) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
  }




  // ✅ Méthode pour mettre à jour le rang d’un utilisateur
updateRank(user_id: string): void {
  const sorted = [...this.usersStudyTime].sort((a, b) => b.userTime - a.userTime);
  const rank = sorted.findIndex(u => u.id === user_id) + 1;

  if (rank > 0) {
    this.leaderboardRank = rank;

    this.authoservice.updaterang(user_id, rank).subscribe({
      next: (res) => {
       
      },
      error: (err) => {
        console.error(`❌ Erreur lors de la mise à jour du rang de l'utilisateur "${user_id}"`, err);
      }
    });
  }
}
async startCycle() {
  this.monitoringActive = true;
  this.running = true;
  await this.startCamera();
  this.captureLoop(3 * 60);
}

stopCycle() {
  this.monitoringActive = false;
  this.running = false;
  this.stopCamera();
}
async stopCamera() {
  if (!this.video) return;
  const videoEl = this.video.nativeElement;
  const stream = videoEl.srcObject as MediaStream;
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    videoEl.srcObject = null;
  }
}





  
async captureAndSend() {
  const videoEl = this.video.nativeElement;
  const canvasEl = this.canvas.nativeElement;
  const ctx = canvasEl.getContext('2d');

  if (!ctx) {
    console.error("Impossible d'accéder au contexte du canvas");
    return;
  }

  canvasEl.width = videoEl.videoWidth;
  canvasEl.height = videoEl.videoHeight;
  ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);

  canvasEl.toBlob((blob) => {
    if (!blob) {
      console.warn("Blob vide, image non capturée");
      return;
    }

    const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });

    // --- Étape 1 : Prédiction ---
    this.apiService.predictImage(file).subscribe({
      next: (response) => {
        console.log("✅ Prédiction reçue :", response);
        this.predictionResult = response;
        this.errorMessage = null;
        this.addChartPoint(response.prediction, response.confidence);

        // --- Étape 2 : Récupérer le user_id ---
        const token = localStorage.getItem('token');
        const decoded = this.decodeToken(token);
console.log("🔴 Décodage du token :", decoded);
        if (!decoded || !decoded.user_id) {
          console.error("❌ Impossible de récupérer l'user_id depuis le token");
          return;
        }

        const userId = decoded.user_id;

        // --- Étape 3 : Envoi vers MongoDB ---
        const emotionData = {
          user_id: userId,
          emotion: response.prediction,
          confidence: response.confidence,
          timestamp: new Date().toISOString()
        };

        console.log("📩 Tentative d'enregistrement de l'émotion :", emotionData);

        const emotionObs = this.resultat.SetEmotion(emotionData);

        if (!emotionObs || typeof emotionObs.subscribe !== 'function') {
          console.error("❌ SetEmotion ne retourne pas un Observable valide !");
          return;
        }

        emotionObs.subscribe({
          next: () => {
            console.log("✅ Émotion enregistrée avec succès !");
          },
          error: (err) => {
            console.error("❌ Erreur lors de l'enregistrement de l'émotion :", err);
          }
        });
      },
      error: (error) => {
        console.error("❌ Erreur lors de la prédiction :", error);
        this.errorMessage = 'Erreur prédiction';
      }
    });
  }, 'image/jpeg');
}
  
}