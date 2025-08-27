import { Component, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product-service';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../common/cart-item';
import { CartSevice } from '../../services/cart-sevice';

@Component({
  selector: 'app-product-details',
  standalone: true,   // standalone component
  imports: [CommonModule, RouterModule],
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.css']
})
export class ProductDetails {

  product = signal<Product | null>(null);

  constructor(
    private productService: ProductService,
    private cartService: CartSevice,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });
  }

  addToCart() {
    const theCartItem = new CartItem(this.product()!);
    this.cartService.addToCart(theCartItem);
  }

  handleProductDetails() {
    const theProductId: number = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getProduct(theProductId).subscribe(data => {
      this.product.set(data);  
    });
  }

 
}
