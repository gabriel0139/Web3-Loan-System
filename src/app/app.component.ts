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
      apiKey: '<API_KEY>',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: '',
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
