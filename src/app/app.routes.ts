import { Routes } from '@angular/router';
import { PageNotFound } from './components/page-not-found/page-not-found';
import { ProductList } from './components/product-list/product-list';
import { ProductDetails } from './components/product-details/product-details';
import { CartDetails } from './components/cart-details/cart-details';

export const routes: Routes = [
    { path: 'cart-details', component: CartDetails },
    { path: 'products/:id', component: ProductDetails },
    { path: 'search/:keyword', component: ProductList },
    { path: 'category/:id', component: ProductList },
    { path: 'category', component: ProductList },
    { path: 'products', component: ProductList },
    { path: '', redirectTo: '/products', pathMatch: 'full' },
    // { path: '**', redirectTo: '/products', pathMatch: 'full' },
    { path: '**', component: PageNotFound }
];
