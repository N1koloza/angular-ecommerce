import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout {

  checkoutFormGroup!: FormGroup;

  constructor(private formBuilder: FormBuilder) {

  }

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
  }

  onSubmit() {
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log(this.checkoutFormGroup.value.sameAsShipping);
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


}
