import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { LoanService } from '../shared/loan/loan.service';
import { Observable, map } from 'rxjs';
import { ModalController, ToastController } from '@ionic/angular';
import { AuthService } from '../shared/services/auth.service';
import { AddAdminComponent } from '../add-admin/add-admin.component';
import { Web3Handler } from 'src/web3';
import { LoanResponse } from 'src/web3/types';
import { LoanState } from '../shared/loan/loan';
import { ITEM_TYPES } from '../shared/item/item.service';

export type { LoanResponse };
export type { LoanState };

@Component({
  selector: 'app-manage',
  templateUrl: 'manage.page.html',
  styleUrls: ['manage.page.scss'],
})
export class ManagePage {
  loan: LoanResponse;
  pendingLoans: LoanResponse[];

  constructor(
    private route: ActivatedRoute,
    private loanService: LoanService,
    private toastController: ToastController,
    private router: Router,
    private authService: AuthService,
    private modalController: ModalController
  ) {
    this.pendingLoans = [];

    if (!Web3Handler.connected()) {
      this.router.navigateByUrl('/login');
    } else {
      this.router.events.subscribe((e) => {
        if (e instanceof NavigationEnd && this.router.url == '/tabs/manage') {
          this.updatePendingLoans();
        }
      });
    }
  }

  async updatePendingLoans() {
    this.pendingLoans = await this.loanService.getPendingLoans();
  }

  stringifyItemId(id: bigint) {
    return ITEM_TYPES.find((x) => x.id == id).name || '';
  }

  async updateLoanState(tokenId: bigint, loanID: bigint, state: string) {
    let loanState = LoanState.Pending;

    switch (state) {
      case 'approved':
        loanState = LoanState.Approved;
        break;
      case 'rejected':
        loanState = LoanState.Rejected;
        break;
    }

    if (loanState != LoanState.Pending) {
      await this.loanService.updateLoanStatus(tokenId, loanID, loanState);
      await this.presentToast(`Loan ${state} (${loanID})`);
      this.router.navigateByUrl('/tabs/manage');
      await this.updatePendingLoans();
    }
  }

  private async presentToast(message: string, color: string = 'default') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'secondary',
      position: 'top',
    });
    await toast.present();
  }

  logout() {
    this.authService
      .logout()
      .then(() => {
        this.router.navigateByUrl('/login');
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  }
}
