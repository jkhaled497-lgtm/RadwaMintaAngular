import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseUrl } from '../../../shared/environments/base-url';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private httpClient:HttpClient) { }
  GetAllReviews():Observable<any>
  {
    return this.httpClient.get(`${BaseUrl.url}/api/Review/GetReview`);
  }
  AddReview(form:object):Observable<any>
  {
    return this.httpClient.post(`${BaseUrl.url}/api/Review/AddReview`,form)
  }
}
