import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class GamePlayService {

  constructor(private http: HttpClient) {
  }

  play(data: any): Observable<any> {
    return this.http.post<any>(API_URL + '/game-play/player/play', data);
  }

  cancelTicket(data: any): Observable<any> {
    return this.http.post<any>(API_URL + '/game-play/player/cancel-ticket', data);
  }

  getTicketsLatest(): Observable<any> {
    return this.http.get<any>(API_URL + '/game-play/player/tickets/latest?limit=5');
  }
}
