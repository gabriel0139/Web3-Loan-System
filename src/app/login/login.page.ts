import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { ModalController } from '@ionic/angular';
import { Web3Handler } from 'src/web3';
import { DeployContract } from 'src/web3/dev/Deployer';
import { Y28_CONTRACT_ABI } from 'src/web3/abi';
import { MintComponent } from '../mint/mint.component';
import { ACCESS_CARD_META_URL } from 'src/web3/const';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginError: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private modalController: ModalController
    
  ) { }
  ngOnInit() {
  }

  async login() {
    const [userCredential, walletResult] = await this.authService.authenticate();

    if (userCredential.user && walletResult.success) {
      if (walletResult.value.id != -1n) {
        this.router.navigateByUrl(walletResult.value.isManager ? '/tabs/manage' : '/tabs/new-loan');
      }
      else {
        await this.modalController.create({ component: MintComponent }).then(x => x.present())
      }
    } else {
      console.log(walletResult.value.id)
      console.log([userCredential, walletResult.error]);
    }
  }

  async deploy() {
    const [userCredential, walletResult] = await this.authService.authenticate();

    if (userCredential.user && walletResult.success) {

      DeployContract(
        Web3Handler.instance,
        Y28_CONTRACT_ABI.abi,
        Y28_CONTRACT_ABI.bytecode,
        Web3Handler.instance.signer.address,
        ACCESS_CARD_META_URL
      ).then((x) => {
        console.log(x);
      }).catch(err => {
        console.warn(err)
      }); // Deploy the NFT contract
    }
  }

  logout() {
    Web3Handler.disconnectWallet().then(() => {
      this.authService.logout();
    });
  }
}
