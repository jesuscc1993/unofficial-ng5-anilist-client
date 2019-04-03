import 'rxjs/add/operator/map';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { _throw } from 'rxjs/observable/throw';
import { catchError } from 'rxjs/operators';

import { apiUrl } from '../app.constants';
import { AuthStore } from '../store/auth.store';
import { ServerResponse } from '../types/anilist/response.types';

export class AniListApi {
  private loggingEnabled = false;
  protected apiUrl: string = apiUrl;

  constructor(protected httpClient: HttpClient, protected authStore: AuthStore) {}

  protected getRequestOptions() {
    const accessToken = this.authStore.getAccessToken();
    return { headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {} };
  }

  protected postGraphQlRequest<ResponseType, VariablesType = undefined>(
    query: string,
    variables?: VariablesType
  ): Observable<ServerResponse<ResponseType>> {
    // TODO use after upgrading TS
    // const parsedVariables = { ...variables };
    const parsedVariables = Object.assign({}, variables);
    if (parsedVariables) {
      Object.keys(parsedVariables).forEach(key => {
        const value = parsedVariables[key];

        if (
          value === undefined ||
          value === null ||
          (['string', 'object'].includes(typeof value) && value.length === 0)
        ) {
          delete parsedVariables[key];
        }
      });
    }

    if (this.loggingEnabled) {
      console.debug('query:', query.replace(/\n\s*/g, '\n'));
      console.debug('variables:', parsedVariables);
    }

    return this.httpClient
      .post(
        this.apiUrl,
        {
          query,
          variables: parsedVariables,
        },
        this.getRequestOptions()
      )
      .pipe(this.mapObjectErrorToStringError());
  }

  protected isValidResponse<T>(response: ServerResponse<T>) {
    return !!this.getResponseData(response);
  }

  protected getResponseData<T>(response: ServerResponse<T>) {
    return !!response && response.data;
  }

  protected mapObjectErrorToStringError() {
    return catchError(error => _throw(JSON.stringify(error, undefined, 2)));
  }
}
