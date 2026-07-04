import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseUrl } from '../../../shared/environments/base-url';

@Injectable({
  providedIn: 'root'
})
export class CounterService {

  constructor(private httpClient:HttpClient) { }
  getCounter():Observable<any>
  {
    return this.httpClient.get(`${BaseUrl.url}/api/Experience/YearsOfExperience`);
  }
}
