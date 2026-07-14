import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CounterService {

  constructor(private httpClient:HttpClient) { }
  getCounter():Observable<any>
  {
    return this.httpClient.get(`${environment.apiUrl}/api/Experience/YearsOfExperience`);
  }
}
