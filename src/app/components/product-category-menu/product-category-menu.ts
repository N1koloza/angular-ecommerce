import { Component, signal } from '@angular/core';
import { ProductCategory } from '../../common/product-category';
import { ProductService } from '../../services/product-service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-category-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-category-menu.html',
  styleUrls: ['./product-category-menu.css'] // fixed: styleUrls instead of styleUrl
})
export class ProductCategoryMenu {

  // Use a signal for reactive state
  productCategories = signal<ProductCategory[]>([]);

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.listProductCategories();
  }

  listProductCategories() {
    this.productService.getProductCategories().subscribe(data => {
      console.log('Product Categories= ' + JSON.stringify(data));
      this.productCategories.set(data); // update signal
    });
  }
}
