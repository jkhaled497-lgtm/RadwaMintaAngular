import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private httpClient:HttpClient) { }
  GetAllReviews():Observable<any>
  {
    return this.httpClient.get(`${environment.apiUrl}/api/Review/GetReview`);
  }
  AddReview(form:object):Observable<any>
  {
    return this.httpClient.post(`${environment.apiUrl}/api/Review/AddReview`,form)
  }
}
