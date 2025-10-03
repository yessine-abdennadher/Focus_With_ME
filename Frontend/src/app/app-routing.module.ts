import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SoloStudyComponent } from './solostudy/solostudy.component';
import { StudyStatsComponent } from './study-stats/study-stats.component';
import { StudyGoalsComponent } from './study-goals/study-goals.component';
import { ModaleBgComponent } from './modale-bg/modale-bg.component';
import { LoginComponent } from './login/login.component';
import { SingupComponent } from './singup/singup.component';

import { ProfileducationComponent } from './profileducation/profileducation.component';
import { ProfilComponent } from './profil/profil.component';
import { ProfilWelocomeComponent } from './profil-welocome/profil-welocome.component';




  const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', pathMatch: 'full', component: SoloStudyComponent },
    { path: 'stat', pathMatch: 'full', component: StudyStatsComponent },
    { path: 'goal', pathMatch: 'full', component: StudyGoalsComponent },
    { path: 'bg', pathMatch: 'full', component: ProfileducationComponent  },
    { path: 'pf2', pathMatch: 'full', component: ProfilComponent  },
    { path: 'pf3', pathMatch: 'full', component: ProfilWelocomeComponent  },
    { path: 'Login', pathMatch: 'full', component: LoginComponent },
    { path: 'Signup', pathMatch: 'full', component: SingupComponent },
    { path: 'test', pathMatch: 'full', component: HomeComponent },
  ];
  




@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
