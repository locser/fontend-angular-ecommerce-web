import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(theCartItem: CartItem) {
    //check if we already have the item in our cart

    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    if (this.cartItems.length > 0) {
      //find the item in the cart base on item id
      /* for (let tempCartItem of this.cartItems) {
        if (tempCartItem.id === theCartItem.id) {
          existingCartItem = tempCartItem;
          break;
        }
      }
      */ 
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);
      alreadyExistsInCart = (existingCartItem != undefined);
    }
    if (alreadyExistsInCart) {
      //increate  quantity
      existingCartItem.quantity++;
    } else {
      //add item to cart
      this.cartItems.push(theCartItem);
    }
    this.computeCartTotals();

  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalQuantityValue += currentCartItem.quantity;
      totalPriceValue += currentCartItem.unitPrice * currentCartItem.quantity;
    }

    // push the new value 
    // .next() will  publish  envents to all subscribers  

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    //log(cart)
    // this.logCartData(totalPriceValue, totalQuantityValue);
  }

  // logCartData(totalPriceValue: number, totaQuantityValue: number) {
  //   for (let currentCartItem of this.cartItems) {
  //     totaQuantityValue += currentCartItem.quantity;
  //     totalPriceValue += currentCartItem.unitPrice;
  //     console.log(currentCartItem)
  //   }
  // }

  getCartItems() : CartItem[]{
    return this.cartItems;
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;

    if (theCartItem.quantity===0){
      this.remove(theCartItem);
    }
    else{
      this.computeCartTotals();
    }
  }
  
  remove(theCartItem: CartItem) {
    const itemIndex  = this.cartItems.findIndex(tempCartItem => tempCartItem.id=== theCartItem.id);

    if(itemIndex >-1){
      this.cartItems.splice(itemIndex,1);
      this.computeCartTotals
    
    }
  }

}
