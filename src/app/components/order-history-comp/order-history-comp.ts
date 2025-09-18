import { Component, OnInit, signal } from '@angular/core';
import { OrderHistory } from '../../common/order-history';
import { OrderHistoryService } from '../../services/order-history-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-history-comp',
  imports: [CommonModule],
  templateUrl: './order-history-comp.html',
  styleUrl: './order-history-comp.css'
})
export class OrderHistoryComp implements OnInit {


  orderHistoryList = signal<OrderHistory[]>([]);
  storage: Storage = sessionStorage;

  private readonly USER_EMAIL_KEY = 'userEmail';

  constructor(public orderHistoryService: OrderHistoryService) {
  }

  ngOnInit(): void {
    this.handleOrderHistory();
  }

  handleOrderHistory() {
    const raw = this.storage.getItem(this.USER_EMAIL_KEY);
    const data = raw ? JSON.parse(raw) : [];
    const theEmail = data;

    this.orderHistoryService.getOrderHistory(theEmail).subscribe(
      data => { this.orderHistoryList.set(data._embedded.orders); }
    );
  }

}
