import { Component, AfterViewInit } from '@angular/core';
import { User } from '../user.model';
import * as CryptoJS from "crypto-js";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    const formContainer = document.getElementById("formContainer");
    if (formContainer != null) formContainer.scrollIntoView();
  }

  user: User = this.newUser();

  newUser() {
    return new User("", "", "");
  }

  async loginUser() {
    const URL = "https://swiftcube-production-2662.up.railway.app/users/login";
    const encryptedPassword = CryptoJS.AES.encrypt(this.user.password, "/nm8z3}KkeXVpsL").toString();

    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username: this.user.username, password: encryptedPassword })
    }).then(response => {
      if (response.status === 200) {
        localStorage.setItem("loggedUser", "y");
        response.json().then(user => {
          localStorage.setItem("user.data", user.username);
          localStorage.setItem("user.name", this.user.username);
          localStorage.setItem("room", `${this.user.username}-local-3x3x3`);
        });
        window.location.href = "";
      } else {
        location.reload();
      }
    }).catch(error => {
      console.error("Error loging in an user:", error);
    });
  }
}
