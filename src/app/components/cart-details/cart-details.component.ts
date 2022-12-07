import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;
  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {
    //get a handle to the cart items
    this.cartItems = this.cartService.getCartItems();

    // console.log('cartItems)'+ this.cartItems);
    console.log('this.cartService.getCartItems()' + this.cartService.getCartItems());


    //subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    //subscribe to the cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    //compute cart total price and quantity
    this.cartService.computeCartTotals();

  }


  incrementQuantity(_t20: CartItem) {
    this.cartService.addToCart(_t20);
  }

  decrementQuantity(_t20: CartItem) {
    this.cartService.decrementQuantity(_t20);
  }

  remove(_t20: CartItem) {
    this.cartService.remove(_t20);
  }
}
