import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage implements OnDestroy{
  isManager = false;
  isUser = false;
  private authSub: () => void;

  constructor(private authService: AuthService) {
    this.authSub = this.authService.observeAuthState((user) => {
      if (user) {
        this.authService.getUserRole().subscribe((role) => {
          this.isUser = (role == 'user')
          this.isManager = (role == 'manager')
        });
      } else {
        // User is logged out
        this.isManager = false;
        this.isUser = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub();
    }
  }
}
