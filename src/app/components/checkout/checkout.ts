import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShopFormService } from '../../services/shop-form-service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { ShopValidators } from '../../validators/shop-validators';


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

  countries = signal<Country[]>([]);
  theShippingStates = signal<State[]>([]);
  theBillingStates = signal<State[]>([]);

  constructor(private formBuilder: FormBuilder,
    private shopFormService: ShopFormService) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group(
      {
        customer: this.formBuilder.group(
          {
            firstName: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
            lastName:  new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
            email: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}')])
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

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved months data: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    this.shopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved years data: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

    this.shopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries.set(data);
      });

  }

  onSubmit() {
    console.log(JSON.stringify(this.checkoutFormGroup.value, null, 2));

    console.log("The shipping addr. country is : " + this.checkoutFormGroup.get('shippingAddress')?.value.country.name);
    console.log("The shipping addr. state is : " + this.checkoutFormGroup.get('shippingAddress')?.value.state.name);

    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched(); // touching all fields triggers the display of the error messages
    }
  }

  onChange() {
    if (this.checkoutFormGroup.get('sameAsShipping')?.value) {
      const shipping = this.checkoutFormGroup.get('shippingAddress')?.value;
      this.checkoutFormGroup.get('billingAddress')?.setValue(shipping);
      console.log(this.checkoutFormGroup.get('customer')?.value);

      this.theBillingStates = this.theShippingStates;
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

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.shopFormService.getStates(countryCode).subscribe(
      data => {

        if (formGroupName === 'shippingAddress') {

          console.log("Retrieved theShippingStates: " + JSON.stringify(data));
          this.theShippingStates.set(data);
        } else {

          console.log("Retrieved theBillingStates: " + JSON.stringify(data));
          this.theBillingStates.set(data);
        }

        if (formGroup?.get('state')) {
          formGroup.get('state')!.setValue(data[0]);
        }

      });


  }

  // Customer
  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }

  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  // Shipping Address
  get shippingStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }

  get shippingCity() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }

  get shippingState() {
    return this.checkoutFormGroup.get('shippingAddress.state');
  }

  get shippingCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }

  get shippingZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }

  // Same As Shipping (boolean checkbox)
  get sameAsShipping() {
    return this.checkoutFormGroup.get('sameAsShipping');
  }

  // Billing Address
  get billingStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }

  get billingCity() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }

  get billingState() {
    return this.checkoutFormGroup.get('billingAddress.state');
  }

  get billingCountry() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }

  get billingZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }

  // Credit Card
  get cardType() {
    return this.checkoutFormGroup.get('creditCard.cardType');
  }

  get nameOnCard() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }

  get cardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }

  get securityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }

  get expirationMonth() {
    return this.checkoutFormGroup.get('creditCard.expirationMonth');
  }

  get expirationYear() {
    return this.checkoutFormGroup.get('creditCard.expirationYear');
  }


}
