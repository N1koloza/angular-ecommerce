import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ShopFormService } from '../../services/shop-form-service';


@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout {

  checkoutFormGroup!: FormGroup;
  totalPrice: number = 0.00;
  totalQuantity: number = 0;
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  constructor(private formBuilder: FormBuilder,
    private shopFormService: ShopFormService) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group(
      {
        customer: this.formBuilder.group(
          {
            firstName: [''],
            lastName: [''],
            email: ['']
          }
        ),
        shippingAddress: this.formBuilder.group(
          {
            street: [''],
            city: [''],
            state: [''],
            country: [''],
            zipCode: ['']
          }
        ),
        sameAsShipping: [false],
        billingAddress: this.formBuilder.group(
          {
            street: [''],
            city: [''],
            state: [''],
            country: [''],
            zipCode: ['']
          }
        ),
        creditCard: this.formBuilder.group(
          {
            cardType: [''],
            nameOnCard: [''],
            cardNumber: [''],
            securityCode: [''],
            expirationMonth: [''],
            expirationYear: ['']
          }
        ),
      }
    );

    // populate credit card months and years
    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved months data: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    )

    this.shopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved years data: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    )

  }

  onSubmit() {
    console.log(JSON.stringify(this.checkoutFormGroup.value, null, 2));
  }

  onChange() {
    if (this.checkoutFormGroup.get('sameAsShipping')?.value) {
      const shipping = this.checkoutFormGroup.get('shippingAddress')?.value;
      this.checkoutFormGroup.get('billingAddress')?.setValue(shipping);
      console.log(this.checkoutFormGroup.get('customer')?.value);
    } else {
      this.checkoutFormGroup.get('billingAddress')?.reset();
    }
  }

  handleMonthesAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);
    let startMonth: number;
    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;

    } else {
      startMonth = 1;
    }

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;

      }
    )

  }


}
