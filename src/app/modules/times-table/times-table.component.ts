import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-times-table',
  templateUrl: './times-table.component.html',
  styleUrls: ['./times-table.component.scss']
})
export class TimesTableComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    const loggedUser = localStorage.getItem("loggedUser");

    if (loggedUser === "y") (document.getElementById("loginWarning") as HTMLParagraphElement).classList.add("noDisplay");
  }

}
