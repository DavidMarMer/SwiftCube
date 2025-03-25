import { AfterViewInit, Component } from '@angular/core';
import { User } from '../user.model';
import * as CryptoJS from "crypto-js";
import { properties } from 'src/app/aplication.properties';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    (<HTMLInputElement>document.getElementById("formContainer")).scrollIntoView();
    this.user.username = localStorage.getItem("user.name") || "";
  }

  user: User = this.newUser();

  newUser() {
    return new User("", "", "");
  }

  validPassword() {
    return !document.querySelectorAll("input")[2].classList.contains("ng-dirty") ||
      document.querySelectorAll("input")[2].classList.contains("ng-dirty") &&
      this.user.password.match(/^(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/);
  }

  async editUser() {
    const URL = `${properties.apiUrl}/users?` + new URLSearchParams({
      oldUsername: localStorage.getItem("user.name") || "",
      newUsername: this.user.username
    });
    const encryptedPassword = CryptoJS.AES.encrypt(this.user.password, "/nm8z3}KkeXVpsL").toString();
    const encryptedConfirmPassword = CryptoJS.AES.encrypt(this.user.confirmPassword, "/nm8z3}KkeXVpsL").toString();

    const response = await fetch(URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ oldPassword: encryptedPassword, newPassword: encryptedConfirmPassword })
    }).then(response => {
      if (response.status === 200) {
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
      console.error("Error updating an user:", error);
    });
  }

  async deleteUser() {
    const URL = `${properties.apiUrl}/users/${localStorage.getItem("user.name")}`;
    const encryptedPassword = CryptoJS.AES.encrypt(this.user.password, "/nm8z3}KkeXVpsL").toString();

    const response = await fetch(URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ password: encryptedPassword })
    }).then(response => {
      if (response.ok) this.toLoggedOutNavigation();
    }).catch(error => {
      console.error("Error updating an user:", error);
    });
  }

  toLoggedOutNavigation() {
    localStorage.setItem("loggedUser", "n");
    localStorage.removeItem("user.data");
    localStorage.removeItem("user.name");
    localStorage.removeItem("room");
    window.location.href = "";
  }
}
