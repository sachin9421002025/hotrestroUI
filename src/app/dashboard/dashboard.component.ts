import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { DashboardService } from './dashboard.service';
import { CustomerInfoComponent } from '../customer/customer.component';
import { CustomerService } from '../customer/customer.service';
import { AddTaxDialog } from './tax.component';
import { Router } from '@angular/router';

@Component({
  selector: 'appDashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  selectedMenu = 'dashboard';
  showCustomer = true;
  customerList: {};
  loading = false;
  constructor(private router: Router, private dashboardService: DashboardService, public dialog: MatDialog, private customerService: CustomerService) { }

  ngOnInit() {
    this.viewCustomer();
  }

  activeMenu(menu) {
    this.selectedMenu = menu;
    this.showCustomer = false;
    if (menu === 'dashboard') {
      this.viewCustomer();
      this.showCustomer = true;
    }
  }

  viewCustomer() {
    this.loading = true;
    this.customerService.viewCustomerDetails()
      .subscribe(
        data => {
          if (data) {
            this.loading = false;
            this.customerList = data;
          } else {
            this.loading = false;
            this.customerList = null;
          }
        },
        error => {
          console.log(error);
          this.loading = false;
        });
  }

  openDialog() {
    this.dialog.open(AddTaxDialog, {
      data: {
      }
    });
  }

  logoutUser() {
    this.dashboardService.logout()
      .subscribe(
        data => {
          if (data) {
            this.router.navigate(['login']);
          }
        },
        error => {
          console.log(error);
        });
  }
}