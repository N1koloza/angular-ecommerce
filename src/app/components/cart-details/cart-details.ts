import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartItem } from '../../common/cart-item';
import { CartSevice } from '../../services/cart-sevice';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-cart-details',
   imports: [CommonModule, RouterModule],
  templateUrl: './cart-details.html',
  styleUrl: './cart-details.css'
})
export class CartDetails {

  //cartItems: CartItem[] = [];

  cartItems = signal<CartItem[]>([]);
  totalPrice: number = 0.00;
  totalQuantity: number = 0;

  constructor(private cartService: CartSevice) {

  }

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {
    // get a handle to the cart items
    this.cartItems = this.cartService.cartItems;
    // subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(
      (data: number) => {
        this.totalPrice = data;
      }
    );
    // subscribe to the cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      (data: number) => {
        this.totalQuantity = data;
      }
    );
    // compute cart total price and quantity 
    this.cartService.computeCartTotals();

  }

}
