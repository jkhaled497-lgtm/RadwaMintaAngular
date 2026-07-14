import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Client {
  id: string;
  userType: number;
  countryNameEN?: string;
  countryNameAr?: string;
  countryCode?: string;
  dateBirthDate?: string;
  imageUrl?: string;
  address?: string;
  fullName?: string;
  phoneNumber?: string;
  email?: string;
}

export interface PagedClientResult {
  items: Client[];
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getClients(pageNumber: number = 1, pageSize: number = 50, name?: string, country?: string, userType?: string): Observable<PagedClientResult> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (name) {
      params = params.set('name', name);
    }
    if (country) {
      params = params.set('country', country);
    }
    if (userType) {
      params = params.set('userType', userType);
    }

    return this.http.get<PagedClientResult>(`${this.apiUrl}/api/Client/clients`, { params });
  }
}
