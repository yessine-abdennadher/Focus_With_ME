import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { CategorieService } from '../../Services/categorie.service';
import { MotivationService } from 'src/Services/motivation.service';
import { GolsService } from 'src/Services/gols.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-solostudy',
  templateUrl: './solostudy.component.html',
  styleUrls: ['./solostudy.component.css']
})
export class SoloStudyComponent implements OnInit, OnDestroy {
  goal: string = '';
  image: string | null = null;
  volume = 0;
  newGoal: string = '';
  goals: any[] = []; // Initialisé comme tableau vide
  nomUtilisateur: string = "";
  nomFamille: string = "";
  // Minuteur
  isRunning = false;
  time = '00:50:00';
  timerInterval: any;
form: FormGroup;
  // Catégories
  selectedCategory: string = '';
  selectedCategoryId: string | null = null;
  categories: any[] = [];

  // Vidéo
  backgroundVideo: string = '';
  videoUrl: string = '';
  sanitizedYoutubeUrl: SafeResourceUrl | null = null;
  isYouTubeVideo: boolean = false;

  // Motivations
  motivationQuotes: any[] = [];
  currentQuote: string = '';
  currentAuthor: string = '';

  // Modales
  showGoalModal = true;
  showTimerModal = true;








  playVideoSound = false;

  @ViewChild('audioPlayer', { static: false }) audioPlayerRef!: ElementRef;
  @ViewChild('categoryContainer', { static: true }) categoryContainer!: ElementRef;
  constructor(
    private categorieService: CategorieService,
    private mot: MotivationService,
    private sanitizer: DomSanitizer,
    private GS: GolsService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      user_id: [''],
      but: ['']
    });
  }

  ngOnInit(
    
  ): void {
    
  // Charger les catégories si ce n’est pas déjà fait
  this.loadCategories();

  // ➤ Sélectionne automatiquement la première catégorie et une vidéo au démarrage
  setTimeout(() => {
    if (this.categories && this.categories.length > 0) {
      this.selectCategory(this.categories[0]);
      const firstVideo = this.filteredVideos?.[4];
      if (firstVideo) {
        this.changerVideo(firstVideo.video);
      }
    }
  }, 500);
   
    this.initTracks();
    const token = localStorage.getItem('token');
    const decoded = this.decodeToken(token);

    if (decoded && decoded.user_id) {
      this.form.patchValue({ user_id: decoded.user_id });
      this.nomUtilisateur = decoded.name || '';
      this.nomFamille = decoded.FamilyName || '';
      this.loadGoals(decoded.user_id);
    }
    this.categorieService.getCategories().subscribe({
      next: (data) => {
        this.categories = data.categories;
      },
      error: (error) => {
        console.error("Erreur lors de la récupération des catégories :", error);
      }
    });
    this.mot.getMotivation().subscribe({
      next: (data) => {
        this.motivationQuotes = data.motivations;
        this.setRandomQuote();
      },
      error: (error) => {
        console.error("Erreur lors de la récupération des motivations :", error);
      }
    });
    this.categoryContainer.nativeElement.addEventListener('wheel', (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        this.categoryContainer.nativeElement.scrollLeft += e.deltaY;
      }
    });


    if (this.videoUrl) {
      this.changerVideo(this.videoUrl);
    }
    
  }
loadCategories() {
  this.categorieService.getCategories().subscribe((cats: any[]) => {
    this.categories = cats;
    // Optionnel : sélection automatique ici aussi
    if (!this.selectedCategoryId && cats.length > 0) {
      this.selectCategory(cats[0]);
    }
  });
}

  ngOnDestroy(): void {
    this.tracks.forEach((track) => {
      track.audio.pause();
      track.audio.currentTime = 0;
      track.playing = false;
    });

    clearInterval(this.timerInterval);
  }

  /** ========== MINUTEUR ========== */
  toggleTimer() {
    if (this.isRunning) {
      clearInterval(this.timerInterval);
    } else {
      this.startTimer();
    }
    this.isRunning = !this.isRunning;
  }

  startTimer() {
    let [hours, minutes, seconds] = this.time.split(':').map(Number);
    this.timerInterval = setInterval(() => {
      if (seconds > 0) {
        seconds--;
      } else if (minutes > 0) {
        minutes--;
        seconds = 59;
      } else if (hours > 0) {
        hours--;
        minutes = 59;
        seconds = 59;
      } else {
        clearInterval(this.timerInterval);
        this.isRunning = false;
      }

      this.time = `${this.formatTime(hours)}:${this.formatTime(minutes)}:${this.formatTime(seconds)}`;
    }, 1000);






  }

  resetTimer() {
    clearInterval(this.timerInterval);
    this.isRunning = false;
    this.time = '00:30:00';
  }

  formatTime(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  /** ========== MUSIQUE ========== */
  tracks = [
    {
      name: '🔥 Fireplace sounds',
      file: 'assets/musics/fire-sound.mp3',
      volume: 50,
      audio: new Audio(),
      playing: false,
    },
    {
      name: '📚 Library ambience',
      file: 'assets/musics/Libraryambience.mp3',
      volume: 50,
      audio: new Audio(),
      playing: false,
    },
    {
      name: '🌠 LoFi beats',
      file: 'assets/musics/LoFi beats.mp3',
      volume: 50,
      audio: new Audio(),
      playing: false,
    },
    {
      name: '🌿 Nature sounds',
      file: 'assets/musics/Nature sounds.mp3',
      volume: 50,
      audio: new Audio(),
      playing: false,
    },
    {
      name: '💧 Rain sounds',
      file: 'assets/musics/rain.mp3',
      volume: 50,
      audio: new Audio(),
      playing: false,
    },
  ];

  initTracks() {
    this.tracks.forEach((track) => {
      track.audio.src = track.file;
      track.audio.load();
      track.audio.volume = track.volume / 100;
    });
  }

  toggleTrack(track: any) {
    track.playing = !track.playing;
  
    if (track.playing) {
      track.audio.play().catch((error: unknown) => {
        console.error('Erreur de lecture:', error);
      });
    } else {
      track.audio.pause();
      track.audio.currentTime = 0;
    }
  }
  

  onTrackVolumeChange(track: any) {
    track.audio.volume = track.volume / 100;
  }

  /** ========== IMAGE ========== */
  handleImageChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.image = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  /** ========== VIDÉO ========== */
  changerVideo(url: string) {
    this.videoUrl = url;
    if (this.isYoutubeVideo(url)) {
      const embedUrl = this.getYoutubeEmbedUrlWithSoundOption(url);
      this.sanitizedYoutubeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    } else {
      this.sanitizedYoutubeUrl = null;
    }

    if (this.playVideoSound) {
      this.tracks.forEach((track) => {
        track.audio.pause();
        track.audio.currentTime = 0;
        track.playing = false;
      });
    }
  }

  getYoutubeEmbedUrlWithSoundOption(url: string): string {
    let videoId = '';
    if (url.includes('youtu.be')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else {
      videoId = url.split('v=')[1]?.split('&')[0] || '';
    }

    const muteParam = this.playVideoSound ? '' : '&mute=1';
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&start=600${muteParam}`;
  }

  isYoutubeVideo(url: string): boolean {
    return url.includes('youtube.com') || url.includes('youtu.be');
  }

  /** ========== MODALES ========== */
  toggleModall(type: string) {


    switch (type) {

      case 'Goal':
        this.showGoalModal = !this.showGoalModal;
        break;
      case 'Timer':
        this.showTimerModal = !this.showTimerModal;
        break;
  
    }
  }
showchatbotModal=false;
    showPicModal = true;
  showMusModal = false;
  showStatModal = false;
  showMotModal = false;
  showMotivationModal = false;
    toggleModal(type: string) {

    this.showMotModal = false;

    switch (type) {
      case 'pic':
        this.showPicModal = !this.showPicModal;

  this.showMusModal = false;
  this.showStatModal = false;
  this.showMotModal = false;
  this.showMotivationModal = false;
  this.showchatbotModal=false;

        break;
             case 'chat':
        this.showchatbotModal = !this.showchatbotModal;
this.showPicModal = false;
  this.showMusModal = false;
  this.showStatModal = false;
  this.showMotModal = false;
  this.showMotivationModal = false;

        break;
      case 'music':
        this.showMusModal = !this.showMusModal;


        this.showchatbotModal=false;
  this.showPicModal = false;
  this.showStatModal = false;
  this.showMotModal = false;
  this.showMotivationModal = false;
        break;
      case 'quote':
        this.showMotModal = !this.showMotModal;
this.showchatbotModal=false;
          this.showPicModal = false;
  this.showStatModal = false;
  this.showMusModal = false;
  this.showMotivationModal = false;
        break;
      case 'stat':
        this.showStatModal = !this.showStatModal;

     this.showchatbotModal=false;    
  this.showPicModal = false;
  this.showMusModal = false;
  this.showMotivationModal = false;
        break;

 
      case 'motivation':
        this.showMotivationModal = !this.showMotivationModal;
this.showchatbotModal=false;
      this.showStatModal = false;             
  this.showPicModal = false;
  this.showMusModal = false;
  this.showStatModal = false;
        break;
    }
  }

  /** ========== CITATIONS ========== */
  showAnotherQuote() {
    this.setRandomQuote();
  }

  setRandomQuote() {
    if (this.motivationQuotes.length > 0) {
      const random = this.shuffle();
      this.currentQuote = random.motivation;
      this.currentAuthor = random.auteur;
    }
  }

  shuffle() {
    const index = Math.floor(Math.random() * this.motivationQuotes.length);
    return this.motivationQuotes[index];
  }

  /** ========== VIDÉOS PAR CATÉGORIE ========== */
  selectCategory(category: any) {
    this.selectedCategoryId = category.id;
    // No direct assignment to filteredVideos; the getter will reflect the change
  }
get filteredVideos() {
  if (!this.selectedCategoryId && this.categories.length > 0) {
    // Par défaut, afficher les vidéos de la première catégorie
    return this.categories[0].videos;
  }

  const selectedCat = this.categories.find(cat => cat.id === this.selectedCategoryId);
  return selectedCat ? selectedCat.videos : [];
}

  /** ========== AUTRES ========== */
  clearGoal() {
    this.goal = '';
  }

  handleExpand() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }
  decodeToken(token: string | null): any {
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      return null;
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
  toggleCompleted(goal: any) {
    goal.completed = !goal.completed;
  }

  get openGoalsCount(): number {
    return this.goals.filter(g => !g.completed).length;
  }

  get completedGoalsCount(): number {
    return this.goals.filter(g => g.completed).length;
  }
}
