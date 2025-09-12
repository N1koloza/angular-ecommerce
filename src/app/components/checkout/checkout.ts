import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShopFormService } from '../../services/shop-form-service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { ShopValidators } from '../../validators/shop-validators';
import { CartSevice } from '../../services/cart-sevice';
import { CheckoutService } from '../../services/checkout-service';
import { Router } from '@angular/router';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { Purchase } from '../../common/purchase';


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
    private shopFormService: ShopFormService,
    private cartService: CartSevice,
    private checkoutService: CheckoutService,
    private router: Router) { }

  ngOnInit(): void {

    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group(
      {
        customer: this.formBuilder.group(
          {
            firstName: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
            lastName: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
            email: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}')])
          }
        ),
        shippingAddress: this.formBuilder.group(
          {
            street: new FormControl('', [Validators.required, ShopValidators.notOnlyWhitespace]),
            city: new FormControl('', [Validators.required, ShopValidators.notOnlyWhitespace]),
            state: new FormControl('', [Validators.required]),
            country: new FormControl('', [Validators.required]),
            zipCode: new FormControl('', [Validators.required, ShopValidators.notOnlyWhitespace])
          }
        ),
        sameAsShipping: [false],
        billingAddress: this.formBuilder.group(
          {
            street: new FormControl('', [Validators.required, ShopValidators.notOnlyWhitespace]),
            city: new FormControl('', [Validators.required, ShopValidators.notOnlyWhitespace]),
            state: new FormControl('', [Validators.required]),
            country: new FormControl('', [Validators.required]),
            zipCode: new FormControl('', [Validators.required, ShopValidators.notOnlyWhitespace])
          }
        ),
        creditCard: this.formBuilder.group(
          {
            cardType: new FormControl('', [Validators.required]),
            nameOnCard: new FormControl('', [Validators.required, ShopValidators.notOnlyWhitespace]),
            cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
            securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
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

  reviewCartDetails() {
    // subscribe to cartService.totalQuantity and totalPrice
    this.cartService.totalPrice.subscribe(
      (data: number) => {
        this.totalPrice = data;
      }
    );
    // subscribe to the cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      (data: number) => {
        this.totalQuantity = data;
      }
    );
  }

  onSubmit() {

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched(); // touching all fields triggers the display of the error messages
      return;
    }

    // set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // get cart items
    const cartItems = this.cartService.cartItems;
    // create orderItems from cartItems
    let orderItems: OrderItem[] = cartItems().map(tempCartItem => new OrderItem(tempCartItem));

    // let orderItems: OrderItem[] = [];
    // let items = cartItems();
    // for (let index = 0; index < cartItems.length; index++) {
    //   orderItems[index] = new OrderItem(items[index]);

    // }

    // set up purchase
    let purchase = new Purchase();
    // populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // populate purchase - shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;
    // populate purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;
    // populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // compute payment info
    // call REST API via the CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        // happy / success
        next: (responseFromBackend) => {
          alert(`Your order has been received.\nOrder tracking number: ${responseFromBackend.orderTrackingNumber}`);
          // reset cart
          this.resetCart();
        },
        error: (err) => {
          alert(`There was an error: ${err.messages}`);
        }
      }
    );


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

  resetCart() {
    // reset cart data
    this.cartService.cartItems.set([]);   // reset signal to empty array
    this.cartService.totalPrice.next(0); // reset BehaviorSubject/Observable
    this.cartService.totalQuantity.next(0); // reset BehaviorSubject/Observable
    //this.cartService.persistCartItems();

    // reset the form
    this.checkoutFormGroup.reset();

    // navigate back to the products page
    this.router.navigateByUrl("/products");
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
