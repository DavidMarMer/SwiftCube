import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-navigation-logged',
  templateUrl: './navigation-logged.component.html',
  styleUrls: ['./navigation-logged.component.scss']
})
export class NavigationLoggedComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    let usernameText = document.getElementById("username");
    if (usernameText != null) usernameText.textContent = localStorage.getItem("user.name");
    this.verifyAdminUser();
  }

  toLoggedOutNavigation() {
    localStorage.setItem("loggedUser", "n");
    localStorage.removeItem("user.data");
    localStorage.removeItem("user.name");
    localStorage.removeItem("room");
    this.toHome();
  }

  verifyAdminUser() {
    const URL = `https://swiftcube-production-2662.up.railway.app/users/${localStorage.getItem("user.name")}`;

    const response = fetch(URL,
    ).then(response => {
      if (response.ok) response.json().then(user => {
        const adminOptionsButton = document.getElementById("controlPanel") as HTMLButtonElement;
        if (user && user.admin) {
          adminOptionsButton.classList.remove("noDisplay");
        } else {
          adminOptionsButton.classList.add("noDisplay");
        }
      });
    }).catch(error => {
      console.error("Error getting the user data:", error);
      window.location.href = "";
    });
  }

  toEditUser() {
    window.location.href = "userdata";
  }

  toHome() {
    window.location.href = "";
  }
}