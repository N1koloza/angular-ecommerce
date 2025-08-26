import { Component, OnInit, signal } from '@angular/core';
import { ProductService } from '../../services/product-service';
import { Product } from '../../common/product';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NgbPaginationModule],
  templateUrl: './product-list-grid.html',
  styleUrls: ['./product-list.css']
})

export class ProductList {
  products = signal<Product[]>([]);
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  //Pagination
  thePageNumber: number = 1;
  thePageSize: number = 10;
  theTotalElements: number = 0;
 

  constructor(private productService: ProductService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(() => { this.listProducts(); });

  }

  public listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;
    this.productService.searchProducts(theKeyword).subscribe({
      next: data => this.products.set(data),
      error: err => console.error('HTTP Error:', err)
    });
  }

  handleListProducts() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    } else {
      this.currentCategoryId = 1;
    }

    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, thePAgeNumber=${this.thePageNumber}`);

    this.productService.getProductListPaginate(this.thePageNumber-1, 
                                              this.thePageSize,  
                                              this.currentCategoryId).subscribe({
      next: data => { this.products.set(data._embedded.products);
                      this.thePageNumber = data.page.number + 1;
                      this.thePageSize = data.page.size;
                      this.theTotalElements = data.page.totalElements;
       },
      error: err => console.error('HTTP Error:', err)
    });
  }

}
