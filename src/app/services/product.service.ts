import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
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


  constructor(private httpClient: HttpClient) { }

  getProductList(theCategoryId: number): Observable<Product[]> {
    // need to build URL based on category id 
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.getProducts(searchUrl);
  }

  searchProducts(theKeyword: string): Observable<Product[]> {
    // need to build URL base on the keyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.getProducts(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<getResponseProducts>(searchUrl).pipe(map(response => response._embedded.products));
  }

  getProductCategoryList(): Observable<ProductCategory[]> {

    return this.httpClient.get<getResponseProductCateogry>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }


}

interface getResponseProducts {
  _embedded: {
    products: Product[];
  }
}

interface getResponseProductCateogry {
  _embedded: {
    productCategory: ProductCategory[];
  }
}