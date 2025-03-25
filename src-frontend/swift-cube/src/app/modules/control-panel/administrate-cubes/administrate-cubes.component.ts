import { AfterViewInit, Component, Renderer2 } from '@angular/core';
import { properties } from 'src/app/aplication.properties';

@Component({
  selector: 'app-administrate-cubes',
  templateUrl: './administrate-cubes.component.html',
  styleUrls: ['./administrate-cubes.component.scss']
})
export class AdministrateCubesComponent implements AfterViewInit {

  constructor(private renderer: Renderer2) { }

  ngAfterViewInit(): void {
    this.getAllCubes();

    const newCubeButton = document.getElementById("newCubeButton") as HTMLButtonElement;
    newCubeButton.addEventListener("click", () => { this.generateNewRow() });
  }

  async getAllCubes() {
    const URL = `${properties.apiUrl}/cubes`;

    const response = await fetch(URL
    ).then(response => {
      if (response.status === 200) {
        response.json().then(cubes => {
          cubes.forEach((cube: any) => {
            this.createCubeEditRow(cube);
          });
        });
      }
    }).catch(error => {
      console.error("Error getting cubes data:", error);
    });
  }

  createCubeEditRow(cubeData: any) {
    const cubeName = cubeData.name;
    const cubeMovementTypes = cubeData.movement_types;
    const cubeMovementsNumber = cubeData.movements_number;

    const cubesList = document.getElementById("cubesList") as HTMLDivElement;

    const rowDiv = this.renderer.createElement("div");
    rowDiv.className = "row align-items-center";
    cubesList.appendChild(rowDiv);

    /* Name input */
    let div = this.renderer.createElement("div") as HTMLDivElement;
    let label = this.renderer.createElement("label") as HTMLLabelElement;
    let input = this.renderer.createElement("input") as HTMLInputElement;
    this.renderer.appendChild(rowDiv, div);
    this.renderer.appendChild(div, label);
    this.renderer.appendChild(div, input);

    div.className = "col-3";
    label.htmlFor = "name";
    label.className = "dynamicLabel";
    label.textContent = "Name";
    input.type = "text";
    input.id = "name";
    input.name = "name";
    input.disabled = true;
    input.value = cubeName;
    input.setAttribute("initial_value", cubeName);

    /* Movement types input */
    div = this.renderer.createElement("div") as HTMLDivElement;
    label = this.renderer.createElement("label") as HTMLLabelElement;
    input = this.renderer.createElement("input") as HTMLInputElement;
    this.renderer.appendChild(rowDiv, div);
    this.renderer.appendChild(div, label);
    this.renderer.appendChild(div, input);

    div.className = "col-3";
    label.htmlFor = "movement_types";
    label.classList.add("dynamicLabel");
    label.textContent = "Movement types";
    input.type = "text";
    input.id = "movement_types";
    input.name = "movement_types";
    input.disabled = true;
    input.value = cubeMovementTypes;

    /* Movements number input */
    div = this.renderer.createElement("div") as HTMLDivElement;
    label = this.renderer.createElement("label") as HTMLLabelElement;
    input = this.renderer.createElement("input") as HTMLInputElement;
    this.renderer.appendChild(rowDiv, div);
    this.renderer.appendChild(div, label);
    this.renderer.appendChild(div, input);

    div.className = "col-3";
    label.htmlFor = "movements_number";
    label.classList.add("dynamicLabel");
    label.textContent = "Movements number";
    input.type = "number";
    input.id = "movements_number";
    input.name = "movements_number";
    input.disabled = true;
    input.value = cubeMovementsNumber;

    /* Options buttons */
    let button = this.renderer.createElement("button") as HTMLButtonElement;
    this.renderer.appendChild(rowDiv, button);
    button.className = "dynamicButton col-1";
    button.textContent = "Edit";
    button.addEventListener("click", function (event) { AdministrateCubesComponent.enableEdition(event); });

    button = this.renderer.createElement("button") as HTMLButtonElement;
    this.renderer.appendChild(rowDiv, button);
    button.className = "dynamicButton col-1 d-none";
    button.textContent = "Save";
    button.addEventListener("click", function (event) { AdministrateCubesComponent.updateCube(event); });

    button = this.renderer.createElement("button") as HTMLButtonElement;
    this.renderer.appendChild(rowDiv, button);
    button.className = "dynamicButton col-1";
    button.textContent = "Delete";
    button.addEventListener("click", function (event) {
      if (confirm(`Are you sure you want to delete the cube ${cubeName}? If it is recreated, users will still lose their times`)) AdministrateCubesComponent.deleteCube(event);
    });
  }

  generateNewRow() {
    const cubesList = document.getElementById("cubesList") as HTMLDivElement;

    const rowDiv = this.renderer.createElement("div");
    rowDiv.className = "row align-items-center";
    cubesList.appendChild(rowDiv);
    rowDiv.scrollIntoView();

    /* Name input */
    let div = this.renderer.createElement("div") as HTMLDivElement;
    let label = this.renderer.createElement("label") as HTMLLabelElement;
    let input = this.renderer.createElement("input") as HTMLInputElement;
    this.renderer.appendChild(rowDiv, div);
    this.renderer.appendChild(div, label);
    this.renderer.appendChild(div, input);

    div.className = "col-3";
    label.htmlFor = "name";
    label.className = "dynamicLabel";
    label.textContent = "Name";
    input.type = "text";
    input.id = "name";
    input.name = "name";
    input.focus();

    /* Movement types input */
    div = this.renderer.createElement("div") as HTMLDivElement;
    label = this.renderer.createElement("label") as HTMLLabelElement;
    input = this.renderer.createElement("input") as HTMLInputElement;
    this.renderer.appendChild(rowDiv, div);
    this.renderer.appendChild(div, label);
    this.renderer.appendChild(div, input);

    div.className = "col-3";
    label.htmlFor = "movement_types";
    label.classList.add("dynamicLabel");
    label.textContent = "Movement types";
    input.type = "text";
    input.id = "movement_types";
    input.name = "movement_types";

    /* Movements number input */
    div = this.renderer.createElement("div") as HTMLDivElement;
    label = this.renderer.createElement("label") as HTMLLabelElement;
    input = this.renderer.createElement("input") as HTMLInputElement;
    this.renderer.appendChild(rowDiv, div);
    this.renderer.appendChild(div, label);
    this.renderer.appendChild(div, input);

    div.className = "col-3";
    label.htmlFor = "movements_number";
    label.classList.add("dynamicLabel");
    label.textContent = "Movements number";
    input.type = "number";
    input.id = "movements_number";
    input.name = "movements_number";

    /* Options buttons */
    let button = this.renderer.createElement("button") as HTMLButtonElement;
    this.renderer.appendChild(rowDiv, button);
    button.className = "dynamicButton col-1 d-none";
    button.textContent = "Edit";
    button.addEventListener("click", function (event) { AdministrateCubesComponent.enableEdition(event); });

    button = this.renderer.createElement("button") as HTMLButtonElement;
    this.renderer.appendChild(rowDiv, button);
    button.className = "dynamicButton col-1";
    button.textContent = "Save";
    button.addEventListener("click", function (event) { AdministrateCubesComponent.createCube(event); });

    button = this.renderer.createElement("button") as HTMLButtonElement;
    this.renderer.appendChild(rowDiv, button);
    button.className = "dynamicButton col-1";
    button.textContent = "Delete";
    button.addEventListener("click", function (event) {
      if (confirm(`Are you sure you want to stop creating this cube?`)) AdministrateCubesComponent.deleteCube(event);
    });
  }

  static enableEdition(event: Event) {
    const rowElements = (event.target as HTMLElement).parentNode!.children as HTMLCollection;

    const name = (rowElements[0].children[1] as HTMLInputElement);
    const movement_types = (rowElements[1].children[1] as HTMLInputElement);
    const movements_number = (rowElements[2].children[1] as HTMLInputElement);

    name.disabled = false;
    movement_types.disabled = false;
    movements_number.disabled = false;

    const editButton = rowElements[3] as HTMLButtonElement;
    const saveButton = rowElements[4] as HTMLButtonElement;
    editButton.classList.add("d-none");
    saveButton.classList.remove("d-none");
  }

  static disableEdition(event: Event) {
    const rowElements = (event.target as HTMLElement).parentNode!.children as HTMLCollection;

    const name = (rowElements[0].children[1] as HTMLInputElement);
    const movement_types = (rowElements[1].children[1] as HTMLInputElement);
    const movements_number = (rowElements[2].children[1] as HTMLInputElement);

    name.disabled = true;
    movement_types.disabled = true;
    movements_number.disabled = true;

    const editButton = rowElements[3] as HTMLButtonElement;
    const saveButton = rowElements[4] as HTMLButtonElement;
    editButton.classList.remove("d-none");
    saveButton.classList.add("d-none");
  }

  static createCube(event: Event) {
    const rowElements = (event.target as HTMLElement).parentNode!.children as HTMLCollection;

    const name = (rowElements[0].children[1] as HTMLInputElement);
    const movementTypes = (rowElements[1].children[1] as HTMLInputElement);
    const movementsNumber = (rowElements[2].children[1] as HTMLInputElement);

    const URL = `${properties.apiUrl}/cubes`;

    const response = fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: name.value, movement_types: movementTypes.value, movements_number: movementsNumber.value })
    }).then(response => {
      if (response.ok) response.json().then(cube => {
        name.value = cube.name;
        movementTypes.value = cube.movement_types;
        movementsNumber.value = cube.movements_number;
      });
    }).catch(error => { console.log("Error while creating a cube:", error); });

    this.disableEdition(event);
  }

  static updateCube(event: Event) {
    const rowElements = (event.target as HTMLElement).parentNode!.children as HTMLCollection;

    const oldName = (rowElements[0].children[1] as HTMLInputElement).getAttribute("initial_value");
    const newName = (rowElements[0].children[1] as HTMLInputElement).value;
    const movementTypes = (rowElements[1].children[1] as HTMLInputElement).value;
    const movementsNumber = (rowElements[2].children[1] as HTMLInputElement).value;

    const URL = `${properties.apiUrl}/cubes/${oldName}`;

    const response = fetch(URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: newName, movement_types: movementTypes, movements_number: movementsNumber })
    }).catch(error => { console.log("Error while updating a cube:", error); });

    this.disableEdition(event);
  }

  static deleteCube(event: Event) {
    const rowElements = (event.target as HTMLElement).parentNode!.children as HTMLCollection;

    const name = (rowElements[0].children[1] as HTMLInputElement).value;

    const URL = `${properties.apiUrl}/cubes/${name}`;

    const response = fetch(URL, {
      method: "DELETE"
    }).then(response => {
      if (response.ok) ((event.target as HTMLElement).parentNode as HTMLDivElement).remove();
    }).catch(error => { console.log("Error while deleting a cube:", error); });
  }
}
