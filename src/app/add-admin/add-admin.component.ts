import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Web3Handler } from 'src/web3';

@Component({
  standalone: true,
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.scss'],
  imports: [IonicModule, ReactiveFormsModule, CommonModule ]
})
export class AddAdminComponent implements OnInit {
  addressForm: FormGroup;
  loading: boolean;

  constructor(
    private router: Router,
    private authService: AuthService,
    private modalController: ModalController
  ) {
    this.addressForm = new FormGroup({
      address: new FormControl('')
    })

    if(!Web3Handler.connected()){
      this.router.navigateByUrl('/login');
    }

    this.loading = false;
  }

  ngOnInit() { }

  async submit(){
    this.loading = true;
    const tx = await Web3Handler.instance.userContract.safeMintAdminAccessToken(this.addressForm.value.address)
    const txResult = await tx.wait();
    this.loading = false;
  }
}
