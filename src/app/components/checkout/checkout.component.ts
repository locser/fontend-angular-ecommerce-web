import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { ShopValidators } from 'src/app/validators/shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {



  checkoutFormGroup: FormGroup;

  totalPrice: number = 0.00;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];


  constructor(private formBuilder: FormBuilder,
    private shopFormService: ShopFormService) {
    this.shopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );
  }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',
          [Validators.required, Validators.minLength(2)
            , ShopValidators.notOnlyWhitespace]),
        lastName: new FormControl('',
          [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      }),

      shippingAddress: this.formBuilder.group({
        street: new FormControl('',
          [Validators.required, Validators.minLength(2)
            , ShopValidators.notOnlyWhitespace]),
        city: new FormControl('',
          [Validators.required, Validators.minLength(2)
            , ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),

        country: new FormControl('', [Validators.required]),
        zipcode: new FormControl('',
          [Validators.required, Validators.minLength(6)
            , ShopValidators.notOnlyWhitespace])
      }),

      billingAddress: this.formBuilder.group({
        street: new FormControl('',
          [Validators.required, Validators.minLength(2)
            , ShopValidators.notOnlyWhitespace]),
        city: new FormControl('',
          [Validators.required, Validators.minLength(2)
            , ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),

        country: new FormControl('', [Validators.required]),
        zipcode: new FormControl('',
          [Validators.required, Validators.minLength(6)
            , ShopValidators.notOnlyWhitespace])
      }),
      creditCart: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('',
        [Validators.required, Validators.minLength(2)
          , ShopValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('',[Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('',[Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: [''],
      }),
    });


    //populate credit card months
    const startMonth: number = new Date().getMonth() + 1;
    // console.log("startMonth: " + startMonth);

    this.shopFormService.getCreditCardMonths(1).subscribe(
      data => {
        this.creditCardMonths = data;
        console.log("Retrieved credit card months: " + JSON.stringify(this.creditCardMonths));

      }
    );
    //populate credit card year

    this.shopFormService.getCreditCardYears().subscribe(
      data => {
        this.creditCardYears = data;
        console.log("Retrieved credit card years: " + JSON.stringify(this.creditCardYears));

      }
    );

    this.shopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );

  }

  onSubmit() {
    console.log("Handling the submit button");

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }

    console.log(this.checkoutFormGroup.get('customer').value);


  }

  //get customer
  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }
  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  //get Shippingaddres
  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipcode'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }

  //get billingAdrres
  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipcode'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }

  //get credit card
  get creditCardType() { return this.checkoutFormGroup.get('creditCart.cardType'); }
  get creditNameOnCard() { return this.checkoutFormGroup.get('creditCart.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCart.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCart.securityCode'); }
  

  copyShippingAddressToBillingAddress(event) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      // bug fix for states
      this.billingAddressStates = [];
    }
  }

  handleMonthsAndYears() {

    const creditCardFormgroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormgroup.value.expirationYear);

    //if the current year equals the selected year ,then start with the current month   

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    );

  }

  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(` ${formGroupName} country code: ${countryCode}`);
    console.log(` ${formGroupName} country name: ${countryName}`);

    this.shopFormService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
          console.log(`${countryCode} - states name: ${this.shippingAddressStates}`);

        }
        else {
          this.billingAddressStates = data;
        }

        formGroup.get('state').setValue(data[0]);

      }
    );
  }


}
