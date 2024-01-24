import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoanService } from '../shared/loan/loan.service';
import { ToastController } from '@ionic/angular';
import { Web3Handler } from 'src/web3';
import { LoanResponse } from 'src/web3/types';
import { ITEM_TYPES } from '../shared/item/item.service';

import { LoanState } from '../shared/loan/loan';
export type { LoanState }

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage {
  loan: LoanResponse;
  loanId: string = '';

  constructor(
    private route: ActivatedRoute,
    private loanService: LoanService,
    private toastController: ToastController,
    private router: Router
  ) {
    this.loanId = this.route.snapshot.params['id'];


    if (!Web3Handler.connected()) {
      this.router.navigateByUrl('/login');
    }
    else {
      Web3Handler.instance.userContract.getLoanDetails(Web3Handler.instance.id, BigInt(this.loanId)).then(x => {
        this.loan = {
          ...x,
          deadline: x.deadline * 1000n
        };
      })
    }
  }

  stringifyState() {
    switch (this.loan?.state) {
      case LoanState.Pending: return "Pending"
      case LoanState.Approved: return "Accepted"
      case LoanState.Rejected: return "Denied"
      default: return "";
    }
  }

  stringifyItemId(id: bigint) {
    return ITEM_TYPES.find(x => x.id == id).name || "";
  }

  async cancelLoan(loanId: bigint) {
    await this.toastController.create({
      message: 'Cancelling loan with id: ' + loanId,
      duration: 2000,
      position: 'top',
      color: 'warning',
    }).then(x => x.present());

    if (await Web3Handler.instance.userContract.cancelLoan(Web3Handler.instance.id, loanId)) {
      this.router.navigateByUrl('/tabs/loans');
    }
  }
}
