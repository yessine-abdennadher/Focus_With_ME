import { Component, OnInit } from '@angular/core';
import { CategorieService } from 'src/Services/categorie.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-modale-bg',
  templateUrl: './modale-bg.component.html',
  styleUrls: ['./modale-bg.component.css']
})
export class ModaleBgComponent implements OnInit {
  categories: any[] = [];
  videoUrl: string = '';
  sanitizedYoutubeUrl: SafeResourceUrl | null = null;

  constructor(
    private categorieService: CategorieService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.categorieService.getCategories().subscribe(
      (data) => {
        console.log("Catégories reçues :", data.categories);
        this.categories = data.categories;
      },
      (error) => {
        console.error("Erreur lors de la récupération des catégories :", error);
      }
    );
  }

  selectedCategoryId: string | null = null;
filteredVideos: any[] = [];


selectCategory(category: any) {
  this.selectedCategoryId = category.id;
  this.filteredVideos = category.videos;
}

  changerVideo(url: string) {
    this.videoUrl = url;

    if (this.isYoutubeVideo(url)) {
    this.sanitizedYoutubeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.getYoutubeEmbedUrl(url)
    );
    }
  }

  isYoutubeVideo(url: string): boolean {
    return url.includes('youtube.com') || url.includes('youtu.be');
  }

getYoutubeEmbedUrl(url: string): string {
  const videoId = url.split("v=")[1]?.split("&")[0] || "";
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&start=600`;
}



}
