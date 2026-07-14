import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private httpClient: HttpClient) { }

  getAllNews(lang: string = 'en'): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/api/LatNews/AllNews?lang=${lang}`);
  }

  getNewsById(id: number, lang: string = 'en'): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/api/LatNews/NewsById/${id}?lang=${lang}`);
  }

  createNews(newsData: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}/api/LatNews/CreateNews`, newsData);
  }

  updateNews(id: number, newsData: any): Observable<any> {
    return this.httpClient.put(`${environment.apiUrl}/api/LatNews/UpdateNews/${id}`, newsData);
  }

  deleteNews(id: number): Observable<any> {
    return this.httpClient.delete(`${environment.apiUrl}/api/LatNews/DeleteNews/${id}`);
  }

  getTickerNews(lang: string = 'en'): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/api/LatNews/TickerNews?lang=${lang}`);
  }

  toggleTicker(id: number, isTicker: boolean): Observable<any> {
    return this.httpClient.put(`${environment.apiUrl}/api/LatNews/ToggleTicker/${id}`, { isTicker });
  }
}
