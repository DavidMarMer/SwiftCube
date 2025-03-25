import { Component } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  toLoggedInNavigation() {
    window.location.href = "login";
  }

  toHome() {
    window.location.href = "";
  }
}