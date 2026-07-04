import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseUrl } from '../../../shared/environments/base-url';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private httpClient:HttpClient) { }
  
  getFeaturedProducts():Observable<any>
  {
    return this.httpClient.get(`${BaseUrl.url}/api/Product/GetFirst4Products`);
  } 
  getAllProducts():Observable<any>
  {
    return this.httpClient.get(`${BaseUrl.url}/api/Product/AllProducts`);
  }
  getAllCategories():Observable<any>
  {
    return this.httpClient.get(`${BaseUrl.url}/api/Product/AllCategories`);
  }
  getProductsByCategory(categoryId:any):Observable<any>
  {
    return this.httpClient.get(`${BaseUrl.url}/api/Product/ProductsByCategoryId/${categoryId}`);
  }
  getFeaturedProductsByCategory(categoryId:any,productId:any):Observable<any>
  {
    return this.httpClient.get(`${BaseUrl.url}/api/Product/RelatedProductsByCategoryId/${categoryId}/Exclude/${productId}`);
  }
  getProduct(id:any):Observable<any>
  {
    return this.httpClient.get(`${BaseUrl.url}/api/Product/ProductsById${id}`);
  }
  orderNow(productId:any):Observable<any>
  {
    return  this.httpClient.get(`${BaseUrl.url}/api/Product/whatsapp-order-link/${productId}`);
  }

}
