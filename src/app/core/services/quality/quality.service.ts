import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QualityService {

  constructor(private httpClient:HttpClient) { }
  getStages():Observable<any>
  {
    return this.httpClient.get(`${environment.apiUrl}/api/Quality`)
  }
}
