import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Web3Handler } from 'src/web3';
import { WEB3_ERROR_MESSAGES } from 'src/web3/const';

@Component({
  standalone: true,

  selector: 'app-mint',
  templateUrl: './mint.component.html',
  imports: [NgFor, NgIf],
  styleUrls: ['./mint.component.scss'],
})
export class MintComponent implements OnInit {
  loading: boolean;
  error: string;

  constructor(private service: ModalController, private router: Router) {
    this.loading = false;

    if(!Web3Handler.connected()){
      this.router.navigateByUrl('/login');
    }
  }

  ngOnInit() { }

  async register() {
    this.loading = true;
    const current = await this.service.getTop()

    const result = await Web3Handler.mintAccessKey();

    if (result.success) {
      await current.dismiss();
      this.router.navigateByUrl('/tabs/new-loan');
    }
    else {
      this.error = WEB3_ERROR_MESSAGES[result.error];
    }

    this.loading = false;
  }
}
