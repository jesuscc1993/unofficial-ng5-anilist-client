import { environment } from '../environments/environment';

export const apiUrl: string = 'https://graphql.anilist.co';
export const apiLoginUrl: string = `https://anilist.co/api/v2/oauth/authorize?client_id=${ environment.anilist_client_id }&response_type=token`;
export const apiTokenPrefix: string = '#access_token=';

export const accessTokenCookieKey: string = 'accessToken';
export const userCookieKey: string = 'user';

export const dashboardUrl: string = '/dashboard';
export const animeSearchUrl: string = '/anime-search';
export const userListUrl: string = '/user-list';
export const rootUrl: string = animeSearchUrl;

export const modalConfig: any = {
  minWidth: '480px',
  width: 'auto',
  maxWidth: '672px'
};