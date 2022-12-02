import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  // templateUrl: './product-list-table.component.html',
  // templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  searchMode: boolean = false;

  //new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 10;
  previousCategoryId: number = 1;
  previousKeyWord: string = "";

  constructor(private productService: ProductService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }

  }

  handleSearchProducts() {

    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;
    //of we have a different keyword than previous
    // then set thePageNumber to 1
    if (this.previousKeyWord != theKeyword) {
      this.thePageNumber=1;
    }
    this.previousKeyWord= theKeyword;

    console.log(`keyword = ${theKeyword}, thePageNum =${this.thePageNumber}`);


    // now search for the products using keyword\
    this.productService.searchProductsPaginate(
      theKeyword,
      this.thePageNumber-1,
      this.thePageSize
      ).subscribe(this.processResult());
  }

  handleListProducts() {

    // check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get the "id" param string. convert string to a number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }
    else {
      // not category id available ... default to category id 1
      this.currentCategoryId = 1;
    }

    // check if we have a different category than previous
    // Angular will resue a component if it is currently being viewed

    // if we hava a different category id than previous
    // then set the pageNumber back to 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this, this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentcategoryId= ${this.currentCategoryId}, thePageNumebr =${this, this.thePageNumber}`);

    // now get the products for the given category id
    this.productService.getProductListPaginate(this.thePageNumber - 1,
      this.thePageSize,
      this.currentCategoryId)
      .subscribe(
        data => {
          this.products = data._embedded.products;
          this.thePageNumber = data.page.number + 1;
          this.thePageSize = data.page.size;
          this.theTotalElements = data.page.totalElements;
        }
      )
  }
  updatePageSize(pageSize: string){
    this.thePageSize = +pageSize;
    this.thePageNumber= 1;
    this.listProducts();
  }

  processResult() {
    return (data:any ) =>{
      this.products= data._embedded.products;
      this.thePageNumber=data.page.number +1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }
}
