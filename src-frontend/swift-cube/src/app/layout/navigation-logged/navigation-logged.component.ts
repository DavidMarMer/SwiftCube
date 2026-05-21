import { Component, OnInit } from '@angular/core';
import { properties } from 'src/app/aplication.properties';

@Component({
  selector: 'app-navigation-logged',
  templateUrl: './navigation-logged.component.html',
  styleUrls: ['./navigation-logged.component.scss']
})
export class NavigationLoggedComponent implements OnInit {

  username: string | null = null;
  isAdmin = false;

  ngOnInit(): void {
    this.username = localStorage.getItem("user.name");
    this.verifyAdminUser();
  }

  toLoggedOutNavigation(): void {
    localStorage.setItem("loggedUser", "n");
    localStorage.removeItem("user.data");
    localStorage.removeItem("user.name");
    localStorage.removeItem("room");
    this.toHome();
  }

  async verifyAdminUser(): Promise<void> {
    const username = localStorage.getItem("user.name");
    if (!username) return;

    const URL = `${properties.apiUrl}/users/${username}`;

    try {
      const response = await fetch(URL);

      if (!response.ok) {
        this.isAdmin = false;
        return;
      }

      const user = await response.json();
      this.isAdmin = !!user?.admin;

    } catch (error) {
      console.error("Error getting the user data:", error);
      window.location.href = "";
    }
  }

  toEditUser(): void {
    window.location.href = "userdata";
  }

  toHome(): void {
    window.location.href = "";
  }
}