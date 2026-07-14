import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MediaLinks } from '../../../shared/interfaces/media-links';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private httpClient:HttpClient) { }

  getMediaLinks():Observable<any>
  {
    const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return  this.httpClient.get(`${environment.apiUrl}/api/Admin/MediaLinks`,{headers});
  }
  updateMediaLinks(form: MediaLinks): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.httpClient.put(`${environment.apiUrl}/api/Admin/UpdateMediaLinks`, form, { headers, responseType: 'text' });
  }

}
