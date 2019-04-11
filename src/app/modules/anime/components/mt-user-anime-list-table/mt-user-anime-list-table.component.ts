import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { ScrollUtil } from '../../../../utils/generic.util';
import { ListEntry, ListEntryStatus } from '../../../shared/types/anilist/listEntry.types';
import { Anime } from '../../../shared/types/anilist/media.types';

@Component({
  selector: 'mt-user-anime-list-table',
  templateUrl: './mt-user-anime-list-table.component.html',
  styleUrls: ['./mt-user-anime-list-table.component.scss'],
})
export class MtUserAnimeListTableComponent implements AfterViewInit, OnChanges {
  @Input() tableStatus: ListEntryStatus;
  @Input() tableData: ListEntry[];
  @Input() favouriteIDs: number[];
  @Input() filter?: string;
  @Output() onEntryUpdate?: EventEmitter<ListEntry> = new EventEmitter<ListEntry>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  tableRows: string[] = [
    'actions',
    'cover-image',
    'title-romaji',
    'format',
    'start-date',
    'genres',
    'score',
    'episodes',
  ];
  dataSource: MatTableDataSource<ListEntry>;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    // TODO: Fix ExpressionChangedAfterItHasBeenCheckedError
    this.initializeDataSource();
    this.bindChildComponents();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.dataSource && changes.filter) {
      this.dataSource.filter = changes.filter.currentValue;
    }
  }

  onUpdate(listEntry?: ListEntry) {
    if (listEntry) {
      this.onEntryUpdate.emit(listEntry);
    }
  }

  onPageChange() {
    ScrollUtil.scrollToRef(this.elementRef);
  }

  private initializeDataSource() {
    this.dataSource = new MatTableDataSource<ListEntry>(this.tableData);
  }

  private bindChildComponents() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (listEntry: ListEntry, property: string) => {
      const anime: Anime = <Anime>listEntry.media;

      return {
        'title-romaji': anime.title.romaji.toLowerCase(),
        format: anime.format.toLowerCase(),
        'start-date': +anime.startDate.year,
        genres: anime.genres.length ? anime.genres[0] : '',
        score: +listEntry.scoreRaw,
        episodes: +anime.episodes,
      }[property];
    };

    this.dataSource.filterPredicate = (listEntry: ListEntry, filter: string) => {
      return listEntry.media.title.romaji
        .trim()
        .toLowerCase()
        .includes(filter.trim().toLowerCase());
    };
  }
}
