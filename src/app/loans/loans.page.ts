import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { LoanService } from '../shared/loan/loan.service';
import { NavigationEnd, OnSameUrlNavigation, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { Web3Handler } from 'src/web3';
import { LoanResponse } from 'src/web3/types';
import { AddressLike, ZeroAddress } from 'ethers';
import { LoanState } from '../shared/loan/loan';



@Component({
  selector: 'app-loans',
  templateUrl: 'loans.page.html',
  styleUrls: ['loans.page.scss'],
})
export class LoansPage {
  loans: LoanResponse[];
  currentUser: AddressLike;
  status: LoanState;

  constructor(
    private loanService: LoanService,
    private router: Router,
    private authService: AuthService
  ) {
    this.currentUser = Web3Handler.instance.signer.address || ZeroAddress;

    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd && this.router.url == '/tabs/loans') {
        this.updateLoans();
      }
    });

    if (!Web3Handler.connected()) {
      this.router.navigateByUrl('/login');
    }
  }
  
  newLoanClicked(){
    this.router.navigateByUrl('/tabs/new-loan');
  }

  async updateLoans() {
    this.loans = await this.loanService.getAllLoans().then(x => x.map(x => {
      return {
        ...x,
        deadline: x.deadline * 1000n
      }
    }));
  }

  getStatusIcon(status: LoanState): string {
    switch (status) {
      case LoanState.Approved:
        return 'checkmark-circle';
      case LoanState.Rejected:
        return 'close-circle';
      case LoanState.Pending:
        return 'cloud-circle';
      default:
        return 'help-circle'; // or any other icon for default
    }
  }

  getStatusColor(status: LoanState): string {
    switch (status) {
      case LoanState.Approved:
        return 'success';
      case LoanState.Rejected:
        return 'danger';
      case LoanState.Pending:
        return 'warning';
      default:
        return 'medium'; // or any other color for default
    }
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
