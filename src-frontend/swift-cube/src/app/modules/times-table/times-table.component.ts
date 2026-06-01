import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { properties } from 'src/app/aplication.properties';

@Component({
  selector: 'app-times-table',
  templateUrl: './times-table.component.html',
  styleUrls: ['./times-table.component.scss']
})
export class TimesTableComponent implements AfterViewInit {

  @Output() averagesReset = new EventEmitter<void>();

  ngAfterViewInit(): void {
    const loggedUser = localStorage.getItem("loggedUser");

    if (loggedUser === "y") (document.getElementById("loginWarning") as HTMLParagraphElement).classList.add("noDisplay");

    document.getElementById("confirmDeleteAllSolvesButton")
    ?.addEventListener("click", () => {
      this.deleteAllSolves();
    });

    const deleteAllSolvesButton = document.getElementById('confirmDeleteAllSolvesButton') as HTMLButtonElement;
    deleteAllSolvesButton.addEventListener("click", event => {
      this.deleteAllSolves();
    });
  }

  deleteAllSolves() {
    const cubeName = document.getElementById("cubeNames") as HTMLSelectElement;

    const selectedCube = cubeName?.options[cubeName.selectedIndex]?.value;

    const URL = `${properties.apiUrl}/parties/all?` + new URLSearchParams({
      username: localStorage.getItem("user.name")!,
      room_code: localStorage.getItem("room")!,
      cube_name: selectedCube
    });

    fetch(URL, { method: "DELETE" })
      .then(res => {
        if (res.ok) {
          const table = document.getElementById("currentTimeTable") as HTMLTableElement;
          this.averagesReset.emit();
        }
      })
      .catch(err => console.error(err));
  }

  openDeleteAllSolves() {
    // solo UI, nada destructivo aquí
  }

  confirmDeleteAllSolves() {
    // aquí llamas al backend real
    this.deleteAllSolves();
  }

}
