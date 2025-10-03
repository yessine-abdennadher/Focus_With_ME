import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isDarkMode = false;
  showHeader: boolean = true;
  private hideTimeout: any;
  isLogged: boolean = false;

  // Fonction pour basculer le mode sombre
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }


  constructor(public router: Router) {}

  ngOnInit(): void {
    this.checkAuth();
    this.router.events.subscribe(() => {
      if (this.router.url === '/home') {
        this.startAutoHideHeader();
      } else {
        this.showHeader = true;
        clearTimeout(this.hideTimeout);
      }
    });
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.router.url === '/home') {
      this.showHeader = true;
      clearTimeout(this.hideTimeout);
      this.hideTimeout = setTimeout(() => {
        this.showHeader = false;
      }, 3000); // 3 secondes après mouvement de souris
    }
  }

  startAutoHideHeader() {
    clearTimeout(this.hideTimeout);
    this.hideTimeout = setTimeout(() => {
      this.showHeader = false;
    }, 5000); // Cacher 5 secondes après le chargement de la page
  }



  checkAuth() {
    this.isLogged = !!localStorage.getItem('user_id');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user_id');
  }
  
  logout() {
    localStorage.removeItem('user_id');
    // facultatif : forcer une navigation ou recharger le composant
    location.reload();
  }
  
  login() {
    this.router.navigate(['/Login']);
  }
 showMenu = false;

toggleMenu(event: MouseEvent) {
  event.stopPropagation(); // empêcher la fermeture immédiate
  this.showMenu = !this.showMenu;
}

@HostListener('document:click')
closeMenuOutside() {
  this.showMenu = false;
}


}
