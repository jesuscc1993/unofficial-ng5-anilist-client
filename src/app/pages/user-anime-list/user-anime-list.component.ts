import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';

import { rootUrl } from '../../app.constants';
import { AnimeService } from '../../services/anime.service';
import { AuthStore } from '../../store/auth.store';
import { ListEntry, ListEntryStatus } from '../../types/anilist/listEntry.types';
import { User } from '../../types/anilist/user.types';

@Component({
  selector: 'mt-user-anime-list',
  templateUrl: './user-anime-list.component.html',
  styleUrls: ['./user-anime-list.component.scss'],
})
export class UserAnimeListPageComponent {
  user: User;
  statusObjects: { [Status in ListEntryStatus]?: ListEntry[] };
  statuses: { value: ListEntryStatus; shown: boolean }[];
  favouriteIDs: number[];

  loggedIn: boolean;
  ready: boolean;
  error: Error;

  reloadOnUpdate: boolean = true;
  filter: string;

  constructor(private router: Router, private animeService: AnimeService, private authStore: AuthStore) {
    this.user = this.authStore.getUser();
    this.loggedIn = this.user !== undefined;

    if (!this.loggedIn) {
      this.router.navigate([rootUrl]);
    }

    this.updateListData();
  }

  private getUserList() {
    if (this.user) {
      this.animeService
        .getAnimeList(this.user)
        .pipe(
          tap(response => {
            this.statusObjects = response;
            this.statuses = Object.keys(response)
              .sort()
              .map(status => ({
                value: status as ListEntryStatus,
                shown: true,
              }));
            this.ready = true;
          }),
          catchError(error => {
            this.error = error;
            this.ready = true;

            return of();
          })
        )
        .subscribe();
    }
  }

  private getListFavouriteIDs() {
    if (this.user) {
      this.animeService.getAnimeListFavouriteIDs(this.user, favouriteIDs => {
        this.favouriteIDs = favouriteIDs;
      });
    }
  }

  hasDataOfStatus(status: string): boolean {
    return this.statusObjects && this.statusObjects[status] && this.statusObjects[status].length > 0;
  }

  applyFilter(filterValue: string) {
    this.filter = filterValue.trim().toLowerCase();
  }

  getListAsString(): string {
    return JSON.stringify(this.statusObjects, undefined, 2);
  }

  onEntryUpdate(listEntry?: ListEntry) {
    if (this.reloadOnUpdate) {
      this.updateListData();
    }
  }

  private updateListData() {
    this.statusObjects = undefined;
    this.statuses = undefined;
    this.favouriteIDs = undefined;
    this.ready = false;

    this.getUserList();
    this.getListFavouriteIDs();
  }
}