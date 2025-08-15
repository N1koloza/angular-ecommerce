import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product-service';
import { Product } from '../../common/product';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-product-list',
   standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {

  products: Product[] = [];
  productCount = 0;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.listProducts();
  }


  listProducts() {
  this.productService.getProductList().subscribe({
    next: data => {
      this.products = data;
      this.productCount = data.length;  // store the count
    },
    error: err => console.error('Error loading products:', err)
  });
}


}
