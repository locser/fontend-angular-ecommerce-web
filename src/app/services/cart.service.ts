import { TemplateBindingParseResult } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  toltalPrice: Subject<number> = new Subject<number>();
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
    let toltalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalQuantityValue += currentCartItem.quantity;
      toltalPriceValue += currentCartItem.unitPrice * currentCartItem.quantity;
    }

    // push the new value 
    // .next() will  publish  envents to all subscribers  

    this.toltalPrice.next(toltalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    //log(cart)
    this.logCartData(toltalPriceValue, totalQuantityValue);
  }


  logCartData(toltalPriceValue: number, totalQuantityValue: number) {
    for (let currentCartItem of this.cartItems) {
      totalQuantityValue += currentCartItem.quantity;
      toltalPriceValue += currentCartItem.unitPrice;
      console.log(currentCartItem)
    }
  }

  
}
