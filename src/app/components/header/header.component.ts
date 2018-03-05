import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AnimeService } from '../../providers/anime.service';
import { User } from '../../models/anilist/user';
import { environment } from '../../../environments/environment';
import { apiLoginUrl, rootUrl, apiTokenPrefix, userListUrl } from '../../app.constants';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnDestroy {
  rootUrl: string = rootUrl;
  apiLoginUrl: string = apiLoginUrl;

  user: User;
  onRoot: boolean;
  loginAvailable: boolean;

  private userChangeSubscription: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private animeService: AnimeService
  ) {
    this.checkAndStoreAccessToken();
    this.subscribeToNavigation();

    this.loginAvailable = environment.anilist_client_id >= 0;
    this.user = this.animeService.getUser();

    this.userChangeSubscription = this.animeService.userChange.subscribe((user: User) => {
      this.user = user;
    });
  }

  ngOnDestroy(): void {
    this.userChangeSubscription.unsubscribe();
  }

  navigateToAnilistProfile(): void {
    window.open(`https://anilist.co/user/${this.user.name}`);
  }

  navigateToUserList(replaceUrl?: boolean): void {
    this.router.navigate([userListUrl], {
      replaceUrl: replaceUrl
    });
  }

  private navigateToHomePage(replaceUrl?: boolean): void {
    this.router.navigate([rootUrl], {
      replaceUrl: replaceUrl
    });
  }

  private logOut(): void {
    this.animeService.logOut();
    this.user = undefined;
    this.loginAvailable = environment.anilist_client_id >= 0;
    this.navigateToHomePage();
  }

  private subscribeToNavigation(): void {
    this.router.events.subscribe(() => {
      this.onRoot = location.href.indexOf(rootUrl) >= 0;
    });
  }

  private checkAndStoreAccessToken(): void {
    if (location.href.indexOf(apiTokenPrefix) >= 0) {
      const locationParts: string[] = location.href.split('&')[0].split(apiTokenPrefix);
      history.replaceState({}, 'Login success', locationParts[0]);
      this.animeService.logIn(locationParts[1]);
      this.navigateToHomePage(true);
    }
  }

}