import { Component } from '@angular/core';
import { CartSevice } from '../../services/cart-sevice';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart-status',
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-status.html',
  styleUrl: './cart-status.css'
})

export class CartStatus {

  totalPrice: number = 0.00;
  totalQuantity: number = 0;

  constructor(private cartService: CartSevice) {

  }

  ngOnInit(): void {

    this.updateCartStatus();

   

  }

  updateCartStatus() {
    
    this.cartService.totalPrice.subscribe(
      (data: number) => {
        this.totalPrice = data;
      }
    );

    this.cartService.totalQuantity.subscribe(
      (data: number) => {
        this.totalQuantity = data;
      }
    );
  }
}
