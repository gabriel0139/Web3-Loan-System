import { Component, DoCheck, OnChanges, SimpleChanges } from '@angular/core';
import firebase from 'firebase';
import { Web3Handler } from 'src/web3';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements DoCheck {
  platform: any;
  constructor() {
    // Your web app's Firebase configuration
    var firebaseConfig = {
      apiKey: 'AIzaSyCuBvQ8j87macL1CKNhxqm69wpuoR2ZQVc',
      authDomain: 'assignment-1a4f6.firebaseapp.com',
      projectId: 'assignment-1a4f6',
      storageBucket: 'assignment-1a4f6.appspot.com',
      messagingSenderId: '103833588472',
      appId: '1:103833588472:web:0f02a7e4a1833f31eb610d',
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }

  ngDoCheck(): void {
    // console.log(window.ethereum)
  }
  
  initializeApp() {
    this.platform.ready().then(() => {});
  }
}
