import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseUrl } from '../../../shared/environments/base-url';
import { MediaLinks } from '../../../shared/interfaces/media-links';

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
    return  this.httpClient.get(`${BaseUrl.url}/api/Admin/MediaLinks`,{headers});
  }
  updateMediaLinks(form: MediaLinks): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.httpClient.put(`${BaseUrl.url}/api/Admin/UpdateMediaLinks`, form, { headers, responseType: 'text' });
  }

}
