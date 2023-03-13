import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { EventQueryParams, EventsList } from '../models';
import { TokenService } from './token.service';

const url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(
    private readonly tokenService:TokenService,
    private readonly http: HttpClient
  ) { }

  getAll(params?:EventQueryParams):Observable<EventsList>{
    console.debug('getAll');
    return this.tokenService.getAuthorizationHeader().pipe(
      switchMap((authorizationHeader) => this.http.get<EventsList>(url,{
        headers:{
          authorization: authorizationHeader
        },
        params:params,
      }),
      ),
    );
  }
}