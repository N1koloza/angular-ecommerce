import { Component, OnInit, signal } from '@angular/core';
import { ProductService } from '../../services/product-service';
import { Product } from '../../common/product';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-product-list',
   standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list-table.html',
  styleUrl: './product-list.css'
})

export class ProductList {
  products = signal<Product[]>([]);

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProductList().subscribe({
      next: data => this.products.set(data),
      error: err => console.error('HTTP Error:', err)
    });
  }
}
