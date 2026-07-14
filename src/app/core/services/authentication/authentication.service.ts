import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private httpClient:HttpClient) { }

  login(form:object):Observable<any>
  {
    return this.httpClient.post(`${environment.apiUrl}/api/Auth/login`,form);
  }

  register(form:object):Observable<any>
  {
    return this.httpClient.post(`${environment.apiUrl}/api/Auth/register`,form);
  }

  forgotPassword(form:object):Observable<any>
  {
    return this.httpClient.post(`${environment.apiUrl}/api/Auth/forgot-password`,form);
  }
   checkCode(form:object):Observable<any>
  {
    return this.httpClient.post(`${environment.apiUrl}/api/Auth/verify-otp`,form);
  }
  resendCode(form:object):Observable<any>
  {
    return this.httpClient.post(`${environment.apiUrl}/api/Auth/resend-otp`,form);
  }
   resetPassword(form: object):Observable<any>
  {
    return this.httpClient.post(`${environment.apiUrl}/api/Auth/reset-password`,form);
  }

  getProfile():Observable<any>
  {
    return this.httpClient.get(`${environment.apiUrl}/api/Auth/profile`);
  }

  updateProfile(form: object):Observable<any>
  {
    return this.httpClient.put(`${environment.apiUrl}/api/Auth/profile`, form);
  }

  uploadImage(file: File):Observable<any>
  {
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post(`${environment.apiUrl}/api/Upload/image`, formData);
  }
}