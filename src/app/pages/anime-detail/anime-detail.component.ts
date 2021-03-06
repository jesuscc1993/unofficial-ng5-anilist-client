import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil, tap } from 'rxjs/operators';

import { AnimeCommands } from '../../modules/anime/commands/anime.commands';
import {
  WithObservableOnDestroy,
} from '../../modules/shared/components/with-observable-on-destroy/with-observable-on-destroy.component';
import { TitleService } from '../../modules/shared/services/title.service';
import { Anime } from '../../modules/shared/types/anilist/media.types';

@Component({
  selector: 'mt-anime-detail',
  templateUrl: './anime-detail.component.html',
  styleUrls: ['./anime-detail.component.scss'],
})
export class AnimeDetailPageComponent extends WithObservableOnDestroy {
  anime: Anime;

  searching: boolean;
  errorGotten: boolean;

  constructor(
    private titleService: TitleService,
    private activatedRoute: ActivatedRoute,
    private animeCommands: AnimeCommands
  ) {
    super();

    this.titleService.setTitle();

    const animeId: number = this.activatedRoute.snapshot.params.id;
    if (animeId && animeId > 0) {
      this.getEntry(animeId);
    }
  }

  private getEntry(animeId: number) {
    this.searching = true;
    this.errorGotten = false;

    this.animeCommands
      .searchAnime({ id: animeId })
      .pipe(
        takeUntil(this.destroyed$),
        tap(
          response => {
            this.anime = response.media.length > 0 && response.media[0];
            this.titleService.setTitle(this.anime.title.romaji);
            this.searching = false;
          },
          () => {
            this.errorGotten = true;
            this.searching = false;
          }
        )
      )
      .subscribe();
  }
}
