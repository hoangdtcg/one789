import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Board} from '../../interface/board';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class OddsService {

  constructor(private http: HttpClient) {
  }

  getAllOdds(term: string): Observable<Board[]> {
    return this.http.get<Board[]>(API_URL + '/odds/player?term=' + term + '&gameTypes=0&betTypes=0');
  }
}
