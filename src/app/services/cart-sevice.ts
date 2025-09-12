import { Injectable, signal } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartSevice {
  
  //cartItems: CartItem[] = [];
  cartItems = signal<CartItem[]>([]);


  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  constructor() { }

  // addToCart(theCartItem: CartItem) {
  //   let alreadyExistsInCart: boolean = false;
  //   let existingCartItem: CartItem | undefined = undefined;


  //   if (this.cartItems.length > 0) {

  //     existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);

  //     alreadyExistsInCart = (existingCartItem != undefined);
  //   }

  //   if (alreadyExistsInCart && existingCartItem != undefined) {
  //     existingCartItem.quantity++;
  //   } else {
  //     this.cartItems.push(theCartItem);
  //   }

  //   this.computeCartTotals();

  // }

  addToCart(theCartItem: CartItem) {
  this.cartItems.update(items => {
    // Check if item already exists
    const existingCartItem = items.find(item => item.id === theCartItem.id);

    if (existingCartItem) {
      // If exists, increase quantity
      existingCartItem.quantity++;
      return [...items]; // return a new array reference
    } else {
      // If not exists, add it
      return [...items, theCartItem];
    }
  });

  this.computeCartTotals();
}

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems()) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // publish events with the new values ... all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {

    console.log('Contents of the cart');
    for (let tempCartItem of this.cartItems()) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log('----');
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;

    if (theCartItem.quantity === 0) {
      this.remove(theCartItem);
    }else{
      this.computeCartTotals();
    }
  }

  remove(theCartItem: CartItem) {
    let itemId: number = theCartItem.id;
    this.cartItems.update(items => 
      items.filter(item => item.id !== itemId)
    );
    
  }
}

