import { Component, AfterViewInit } from '@angular/core';
import { properties } from 'src/app/aplication.properties';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss']
})
export class ControlPanelComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    this.verifyAdminUser();
  }

  verifyAdminUser() {
    const URL = `${properties.apiUrl}/users/${localStorage.getItem("user.name")}`;

    const response = fetch(URL,
    ).then(response => {
      if (response.ok) response.json().then(user => {
        const adminOptionsButton = document.getElementById("controlPanel") as HTMLButtonElement;
        if (user && !user.admin) {
          window.location.href = "";
        }
      });
    }).catch(error => {
      console.error("Error getting the user data:", error);
      window.location.href = "";
    });
  }
}
