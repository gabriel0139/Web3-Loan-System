import { Component, DoCheck } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Item } from '../shared/item/item';
import { ItemService } from '../shared/item/item.service';
import { LoanService } from '../shared/loan/loan.service';
import firebase from 'firebase';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { retry } from 'rxjs';
import { Web3Handler } from 'src/web3';
import { LoanResponse } from 'src/web3/types';

@Component({
  selector: 'app-new-loan',
  templateUrl: 'new-loan.page.html',
  styleUrls: ['new-loan.page.scss'],
})

export class NewLoanPage {
  items: Item[];
  loan: LoanResponse;

  private currentUser: string | undefined

  constructor(
    private itemService: ItemService,
    private loanService: LoanService,
    private toastController: ToastController,
    private router: Router,
    private authService: AuthService
  ) {
    this.itemService.getAllAsync().subscribe((result) => (this.items = result));

    if (!Web3Handler.connected()) {
      this.router.navigateByUrl('/login');
    }
  };

  async submit() {
    if (Web3Handler.connected()) {
      await this.toastController.create({
        message: 'Requesting loan...',
        duration: 2000,
        position: 'top',
        color: 'secondary',
      }).then(x => x.present());

      await this.loanService.createLoan(this.items.filter(x => x.quantity > 0)).then(async loan => {
        if (loan != undefined) {
          await this.toastController.create({
            message: 'Loan created with ID ' + loan.id,
            duration: 2000,
            position: 'top',
            color: 'success',
          }).then(x => x.present());
          this.itemService.resetQuantity();
        }
        else {
          await this.toastController.create({
            message: 'Failed to confirm loan',
            duration: 2000,
            position: 'top',
            color: 'danger',
          }).then(x => x.present());
        }
      });
    }
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigateByUrl('/login');
    }).catch((error) => {
      console.error('Logout error:', error);
    });
  }
}
