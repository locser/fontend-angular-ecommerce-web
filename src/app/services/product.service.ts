import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/product-category';


  constructor(private httpClient:HttpClient) {
  }

  getProductList(theCategoryId: number): Observable<Product[]> {
    // TODO
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
    
    return this.httpClient.get<getResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductCategoryList(): Observable<ProductCategory[]> {
    // TODO
    
    return this.httpClient.get<getResponseProductCateogry>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }
}

interface getResponseProducts{
  _embedded:{
    products: Product[];
  }
}

interface getResponseProductCateogry{
  _embedded:{
    productCategory: ProductCategory[];
  }
}