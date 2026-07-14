import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private httpClient:HttpClient) { }
  
  getFeaturedProducts():Observable<any>
  {
    return this.httpClient.get(`${environment.apiUrl}/api/Product/GetFirst4Products`);
  } 
  getAllProducts():Observable<any>
  {
    return this.httpClient.get(`${environment.apiUrl}/api/Product/AllProducts`);
  }
  getAllCategories():Observable<any>
  {
    return this.httpClient.get(`${environment.apiUrl}/api/Product/AllCategories`);
  }
  getProductsByCategory(categoryId:any):Observable<any>
  {
    return this.httpClient.get(`${environment.apiUrl}/api/Product/ProductsByCategoryId/${categoryId}`);
  }
  getFeaturedProductsByCategory(categoryId:any,productId:any):Observable<any>
  {
    return this.httpClient.get(`${environment.apiUrl}/api/Product/RelatedProductsByCategoryId/${categoryId}/Exclude/${productId}`);
  }
  getProduct(id:any):Observable<any>
  {
    return this.httpClient.get(`${environment.apiUrl}/api/Product/ProductsById${id}`);
  }
  orderNow(productId:any):Observable<any>
  {
    return  this.httpClient.get(`${environment.apiUrl}/api/Product/whatsapp-order-link/${productId}`);
  }
  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('placeholder', '1');
    return this.httpClient.post(`${environment.apiUrl}/api/Upload/Image`, formData);
  }
  
  createProduct(productData: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}/api/Product/CreateProduct`, productData);
  }

  updateProduct(id: any, productData: any): Observable<any> {
    return this.httpClient.put(`${environment.apiUrl}/api/Product/UpdateProduct/${id}`, productData);
  }

  deleteProduct(id: any): Observable<any> {
    return this.httpClient.delete(`${environment.apiUrl}/api/Product/DeleteProduct/${id}`);
  }

}
