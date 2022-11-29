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

  products: Product[]=[];
  productCategories: ProductCategory[] = [];
  currentCategoryId : number=1;
  constructor(private productService: ProductService,
         private route : ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>{
      this.listProducts();
    } );
    this.listProductCategories();

  }

  listProducts() {

    //check if id parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId){
      //get the id param string. convert string to number using the "+" symbol
      this.currentCategoryId= +this.route.snapshot.paramMap.get('id')!;
      //make not of !, this is the non-null assertion operator/ tells compiler that the object is not null
    }else {
      // not category id available ... default to cateogry id 1
      this,this.currentCategoryId = 1;
    }

    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.products=data;
      }
    )
  }

  listProductCategories(){

    this.productService.getProductCategoryList().subscribe(
      data => {
        console.log('Product Categories =' + JSON.stringify(data));
        this.productCategories = data;
      }
    );
  }

}
