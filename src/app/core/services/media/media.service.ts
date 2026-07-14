import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  constructor(private httpClient:HttpClient) { }

  getMediaLinks():Observable<any>
  {
    return this.httpClient.get(`${environment.apiUrl}/api/Media/MediaLinks`);
  }
  getWhatsAppLink():Observable<any>
  {
    return this.httpClient.get(`${environment.apiUrl}/api/Media/WhatsAppLink`)
  }
}