import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseUrl } from '../../../shared/environments/base-url';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private httpClient:HttpClient) { }

  login(form:object):Observable<any>
  {
    return this.httpClient.post(`${BaseUrl.url}/api/Auth/login`,form);
  }

  forgotPassword(form:object):Observable<any>
  {
    return this.httpClient.post(`${BaseUrl.url}/api/Auth/forgot-password`,form);
  }
   checkCode(form:object):Observable<any>
  {
    return this.httpClient.post(`${BaseUrl.url}/api/Auth/verify-otp`,form);
  }
  resendCode(form:object):Observable<any>
  {
    return this.httpClient.post(`${BaseUrl.url}/api/Auth/resend-otp`,form);
  }
   resetPassword(form: object):Observable<any>
  {
    return this.httpClient.post(`${BaseUrl.url}/api/Auth/reset-password`,form);
  }
}