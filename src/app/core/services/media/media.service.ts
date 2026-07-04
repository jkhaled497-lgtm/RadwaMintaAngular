import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseUrl } from '../../../shared/environments/base-url';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  constructor(private httpClient:HttpClient) { }

  getMediaLinks():Observable<any>
  {
    return this.httpClient.get(`${BaseUrl.url}/api/Media/MediaLinks`);
  }
  getWhatsAppLink():Observable<any>
  {
    return this.httpClient.get(`${BaseUrl.url}/api/Media/WhatsAppLink`)
  }
}