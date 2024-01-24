import { Injectable } from '@angular/core';
import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';
import { Observable, map } from 'rxjs';
import { Web3Handler } from 'src/web3';
import { Web3Result } from 'src/web3/types';

type Role = 'user' | 'manager'

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  constructor() { }

  observeAuthState(
    func: firebase.Observer<any, Error> | ((a: firebase.User | null) => any)
  ) {
    return firebase.auth().onAuthStateChanged(func);
  }

  authenticate() {
    // return firebase.auth().
    return Promise.all([
      firebase.auth().signInAnonymously(),
      Web3Handler.connectWallet()
    ]);
  }

  async logout(): Promise<Web3Result<null>> {
    Web3Handler.disconnectWallet();
    await  firebase.auth().signOut();

    return firebase.auth().signOut().then(() => Web3Handler.disconnectWallet());
  }

  getUserRole(): Observable<Role> {
    return new Observable((observer) => {
      observer.next(Web3Handler.instance.isManager ? 'manager' : 'user')
    });
  }
}
