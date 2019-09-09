import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { getTaxService } from './checkout-form.service';
import { DataService } from "../data.service";

@Component({
  selector: 'app-checkout-form',
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.scss']
})
export class CheckoutFormComponent implements OnInit {
  showCheckout: boolean = false;
  subTotal = 0;
  finalTotal = 0;
  document: Document;
  taxData: {};
  roomCharges: Number;
  extraOccupancy: Number;
  checkinDate = Object;
  checkoutDate = Object;
  foodBillNumber: Number;
  taxAmount: Number;
  @Input() checkoutData: Object;
  message: string;
  item: {};
  roomObject: {};
  room_id: number;
  customer_id: number;
  @Output() checkoutEvent = new EventEmitter<boolean>();
  constructor(private data: DataService, private gettaxService: getTaxService) { }

  ngOnInit() {
    this.roomCharges = this.checkoutData['room_charges'];
    this.extraOccupancy = this.checkoutData['extra_occupancy'];
    this.foodBillNumber = this.checkoutData['food_bill_number'];
    this.checkinDate = this.checkoutData['checkin_date'];
    this.checkoutDate = this.checkoutData['checkout_date'];
    this.finalTotal = this.checkoutData['total_amount'];
    this.getTaxAmount();
    this.getRoomCustDetails();
    // this.subTotal = parseInt(this.checkoutData['room_charges']) + parseInt(this.checkoutData['extra_occupancy']);
  }

  printInvoice(printArea) {
    var printContents = document.getElementById(printArea).innerHTML;
    var originalContents = document.body.innerHTML;
    // document.body.innerHTML = input;
    document.body.innerHTML = printContents;
    window.print();

    document.body.innerHTML = originalContents;
  }

  callCustomerList() {
    this.checkoutEvent.emit(this.showCheckout);
  }

  getTaxAmount() {
    this.gettaxService.getTaxData()
      .subscribe(
      data => {
        if (data) {
          this.taxData = data[0];
          this.taxAmount = this.taxData['tax_amount'];
          this.finalTotal = this.subTotal + (this.subTotal * parseInt(this.taxData['tax_amount']) / 100);
        } else {
          this.taxData = 0;
        }
      },
      error => {
        console.log(error);
      });
  }

  getRoomCustDetails() {
    this.gettaxService.getRoomCustDetails(this.room_id, this.customer_id)
      .subscribe(
      data => {
        if (data) {
          this.roomObject = data;
        } else {
          this.roomObject = null;
        }
      },
      error => {
        console.log(error);
      });
  }
}
