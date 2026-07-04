import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseUrl } from '../../../shared/environments/base-url';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private httpClient:HttpClient) { }
  SendMessage(form:object):Observable<any>
  {
    return this.httpClient.post(`${BaseUrl.url}/api/Contact/SendMessage`, form );
  }
}