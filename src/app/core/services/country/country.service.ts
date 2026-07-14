import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CountryDTO } from '../../../shared/interfaces/country';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(private httpClient: HttpClient) { }

  getAllCountries(): Observable<CountryDTO[]> {
    return this.httpClient.get<CountryDTO[]>(`${environment.apiUrl}/api/Country/GetAllCountry`);
  }
}
