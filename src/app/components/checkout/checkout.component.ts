import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { ShopFormService } from 'src/app/services/shop-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {



  checkoutFormGroup: FormGroup;

  totalPrice: number = 0.00;
  totalQuantity: number=0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[]= [];

  shippingAddressStates : State[] = [];
  billingAddressStates : State[] = [];


  constructor(private formBuilder : FormBuilder,
    private shopFormService : ShopFormService) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),

      shippingAddress: this.formBuilder.group({
        street : [''],
        city : [''],
        state : [''],
        country : [''],
        zipcode : [''],
      }),

      billingAddress: this.formBuilder.group({
        street : [''],
        city : [''],
        state : [''],
        country : [''],
        zipcode : [''],
      }),
      creditCart: this.formBuilder.group({
        cardType : [''],
        nameOnCard : [''],
        cardNumber : [''],
        securityCode : [''],
        expirationMonth : [''],
        expirationYear : [''],
      }),
    });


    //populate credit card months
    const startMonth : number= new Date().getMonth() +1;
    // console.log("startMonth: " + startMonth);

    this.shopFormService.getCreditCardMonths(1).subscribe(
      data => {
        this.creditCardMonths = data;
        console.log("Retrieved credit card months: " + JSON.stringify(this.creditCardMonths));

      }
    ) ;
    //populate credit card year
 
    this.shopFormService.getCreditCardYears().subscribe(
      data => {
        this.creditCardYears = data;
        console.log("Retrieved credit card years: " + JSON.stringify(this.creditCardYears));

      }
    );
    
    this.shopFormService.getCountries().subscribe(
      data=> {
        console.log("Retrieved countries: " +JSON.stringify(data));
        this.countries= data;
      }
    );

  }

  onSubmit() {
    console.log("Handling the submit button");
    console.log(this.checkoutFormGroup.get('customer').value);
  }

  copyShippingAddressToBillingAddress(event) {
    if(event.target.checked){
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

        this.billingAddressStates = this.shippingAddressStates;
    }else{
      this.checkoutFormGroup.controls['billingAddress'].reset();
            // bug fix for states
            this.billingAddressStates = [];
    }
  }

  handleMonthsAndYears() {

    const creditCardFormgroup = this.checkoutFormGroup.get('creditCard');

    const currentYear : number = new Date().getFullYear();
    const selectedYear : number = Number(creditCardFormgroup.value.expirationYear);

    //if the current year equals the selected year ,then start with the current month   

    let startMonth: number;

    if (currentYear === selectedYear){
      startMonth = new Date().getMonth() +1;
    }else {
      startMonth =1;
    }

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths=data;
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
        if(formGroupName ==='shippingAddress') {
          this.shippingAddressStates = data;
          console.log(`${countryCode} - states name: ${this.shippingAddressStates}`);

        }
        else{
          this.billingAddressStates=data;
        }
        
        formGroup.get('state').setValue(data[0]);
        
      }
    );
  }
    

}
