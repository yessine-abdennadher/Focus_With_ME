import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

// PrimeNG
import { KnobModule } from 'primeng/knob';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';

// Charts


// Autres modules
import { NgScrollbarModule } from 'ngx-scrollbar';

// Composants
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HomeComponent } from './home/home.component';

import { SoloStudyComponent } from './solostudy/solostudy.component';

import { ModaleBgComponent } from './modale-bg/modale-bg.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { StudyStatsComponent } from './study-stats/study-stats.component';
import { MotivationQuoteComponent } from './motivation-quote/motivation-quote.component';
import { StudyGoalsComponent } from './study-goals/study-goals.component';
import { QuoteComponent } from './quote/quote.component';
import { LoginComponent } from './login/login.component';
import { SingupComponent } from './singup/singup.component';
import { ProfilComponent } from './profil/profil.component';
import { ProfileducationComponent } from './profileducation/profileducation.component';
import { ProfilWelocomeComponent } from './profil-welocome/profil-welocome.component';
import { NgChartsModule } from 'ng2-charts';
import { ModalStudystatsComponent } from './modal-studystats/modal-studystats.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    SoloStudyComponent,

    ModaleBgComponent,
    ChatbotComponent,
    StudyStatsComponent,
    MotivationQuoteComponent,
    StudyGoalsComponent,
    QuoteComponent,
    LoginComponent,
    SingupComponent,
    ProfilComponent,
    ProfileducationComponent,
    ProfilWelocomeComponent,
    ModalStudystatsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    // Angular Material
    MatGridListModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatIconModule,
    MatTableModule,
    MatMenuModule,
    MatButtonModule,
    MatDialogModule,

    // PrimeNG
    CarouselModule,
    ButtonModule,
    KnobModule,
    InputSwitchModule,

    // Autres
    NgScrollbarModule,
    NgChartsModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
