import { Injectable } from '@angular/core';
import { Item } from '../item/item';

import firebase from 'firebase/app';
import 'firebase/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { resolve } from 'dns';
import { time } from 'console';
import { Web3Handler } from 'src/web3';
import { ContractTransactionResponse, getNumber, parseEther } from 'ethers';
import { LoanResponse } from 'src/web3/types';
import { LoanState } from './loan';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  private refreshNeeded = new BehaviorSubject<void>(null);
  public refreshNeeded$ = this.refreshNeeded.asObservable();
  constructor() {}

  async createLoan(items: Item[]): Promise<LoanResponse | undefined> {
    if (items.length > 0) {
      let userId = Web3Handler.instance.id;
      let deadline = BigInt(getDeadline(14)).valueOf(); // Due date is 2 weeks after today
      let details = items.map((x) => [x.id, BigInt(x.quantity).valueOf()]);

      console.log('requesting loan...');

      let loanId =
        new Date().valueOf() *
        (await Web3Handler.instance.provider.getBlockNumber());
      return await Web3Handler.instance.userContract.requestLoan(
        userId,
        BigInt(loanId),
        deadline,
        details
      );
    }

    return undefined;
  }

  async getAllLoans() {
    return await Web3Handler.instance.userContract.getAllLoansByTokenId(
      Web3Handler.instance.id
    );
  }

  getPendingLoans() {
    return Web3Handler.instance.userContract.getPendingLoans();
  }

  async updateLoanStatus(
    tokenId: bigint,
    loanID: bigint,
    state: LoanState
  ): Promise<void> {
    await Web3Handler.instance.userContract.updateLoanState(
      tokenId,
      loanID,
      state
    );
  }
}

function getDeadline(days: number) {
  let duedate = new Date(); // Today
  duedate.setHours(0, 0, 0, 0); // Midnight
  duedate.setDate(duedate.getDate() + days); // 2 weeks later
  return duedate.valueOf() / 1e3;
}
