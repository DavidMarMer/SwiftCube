import { AfterViewInit, Component } from '@angular/core';
import { User } from '../user.model';
import * as CryptoJS from "crypto-js";
import { properties } from 'src/app/aplication.properties';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    (<HTMLInputElement>document.getElementById("formContainer")).scrollIntoView();
  }

  user: User = this.newUser();

  newUser() {
    return new User("", "", "");
  }

  validPassword() {
    return !document.querySelectorAll("input")[1].classList.contains("ng-dirty") ||
      document.querySelectorAll("input")[1].classList.contains("ng-dirty") &&
      this.user.password.match(/^(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/);
  }

  matchPasswords() {
    return !document.querySelectorAll("input")[2].classList.contains("ng-dirty") ||
      document.querySelectorAll("input")[2].classList.contains("ng-dirty") &&
      this.user.password === this.user.confirmPassword;
  }

  async registerUser() {
    if (this.matchPasswords()) {
      const URL = `${properties.apiUrl}/users`;
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
          window.location.reload();
        }
      }).catch(error => {
        console.error("Error creating an user:", error);
      });
    } else {
      window.location.reload();
    }
  }
}