import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Odds} from '../../interface/odds';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class OddsService {

  constructor(private http: HttpClient) {
  }

  getOdds(term: string, betTypes): Observable<Odds[]> {
    return this.http.get<Odds[]>(API_URL + '/odds/player?term=' + term + '&gameTypes=0&betTypes=' + betTypes);
  }
}
