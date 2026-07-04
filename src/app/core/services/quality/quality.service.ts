import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseUrl } from '../../../shared/environments/base-url';

@Injectable({
  providedIn: 'root'
})
export class QualityService {

  constructor(private httpClient:HttpClient) { }
  getStages():Observable<any>
  {
    return this.httpClient.get(`${BaseUrl.url}/api/Quality`)
  }
}
