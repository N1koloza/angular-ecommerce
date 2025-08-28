import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ProductCategoryMenu } from "./components/product-category-menu/product-category-menu";
import { Search } from "./components/search/search";
import { CartStatus } from "./components/cart-status/cart-status";



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProductCategoryMenu, Search, CartStatus, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular-ecommerce');
}
