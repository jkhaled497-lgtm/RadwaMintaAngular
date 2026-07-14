import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private httpClient:HttpClient) { }
  SendMessage(form:object):Observable<any>
  {
    return this.httpClient.post(`${environment.apiUrl}/api/Contact/SendMessage`, form );
  }
}