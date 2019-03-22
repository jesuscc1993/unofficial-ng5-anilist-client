import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { AnimeApi } from './api/anime/anime.api';
import { AuthApi } from './api/auth/auth.api';
import { AppComponent } from './app.component';
import { AnimeModule } from './modules/anime/anime.module';
import { CoreModule } from './modules/core.module';
import { MaterialModule } from './modules/material/material.module';
import { SharedModule } from './modules/shared/shared.module';
import { AnimeDetailPageComponent } from './pages/anime-detail/anime-detail.component';
import { AnimeSearchPageComponent } from './pages/anime-search/anime-search.component';
import { DashboardPageComponent } from './pages/dashboard/dashboard.component';
import { LoginPageComponent } from './pages/login/login.component';
import { PageNotFoundPageComponent } from './pages/page-not-found/page-not-found.component';
import { UserAnimeListPageComponent } from './pages/user-anime-list/user-anime-list.component';
import { SortPipe } from './pipes/sort';
import { AnimeService } from './services/anime.service';
import { AuthService } from './services/auth.service';
import { AuthStore } from './store/auth.store';

const appRoutes: Routes = [
  { path: '', redirectTo: '/anime-search', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  { path: 'dashboard', component: DashboardPageComponent },
  { path: 'anime-search', component: AnimeSearchPageComponent },
  { path: 'anime-detail/:id', component: AnimeDetailPageComponent },
  { path: 'user-anime-list', component: UserAnimeListPageComponent },
  { path: '**', component: PageNotFoundPageComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundPageComponent,
    LoginPageComponent,
    DashboardPageComponent,
    AnimeSearchPageComponent,
    AnimeDetailPageComponent,
    UserAnimeListPageComponent,
  ],
  imports: [CoreModule, SharedModule, AnimeModule, RouterModule.forRoot(appRoutes)],
  providers: [AnimeService, AuthService, AnimeApi, AuthApi, AuthStore],
  bootstrap: [AppComponent],
})
export class AppModule {}
