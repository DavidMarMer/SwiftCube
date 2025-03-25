import { AfterViewInit, Component } from '@angular/core';
import { properties } from 'src/app/aplication.properties';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {
  private intervalId!: any;
  private startTime!: number;
  private elapsedTime!: number;
  private timerInterval!: any;
  private keyPressed: boolean = false;
  private readyToStart: boolean = false;
  private runningTimer: boolean = false;

  async ngAfterViewInit() {
    const cubeNames = <HTMLSelectElement>document.getElementById("cubeNames");
    const notAvailable = <HTMLSelectElement>document.getElementById("notAvailable");
    const visualScrambleDiv = <HTMLSelectElement>document.getElementById("visualScrambleDiv");
    const scrambleDiv = <HTMLDivElement>document.getElementById("scrambleDiv");
    cubeNames?.addEventListener("change", () => {
      const selectedCube = cubeNames.options[cubeNames.selectedIndex].value;

      let heightValue = "";
      switch (selectedCube) {
        case "3x3x3": case "3x3x3 OH": case "3x3x3 BLD": case "2x2x2":
          heightValue = "100px";
          break;
        case "4x4x4":
          heightValue = "130px";
          break;
        case "5x5x5":
          heightValue = "150px";
          break;
        case "6x6x6":
          heightValue = "190px";
          break;
        case "7x7x7":
          heightValue = "230px";
          break;
      }
      scrambleDiv.style.height = heightValue;

      if (selectedCube.indexOf("3x3x3") !== -1) {
        visualScrambleDiv.style.display = "block";
        notAvailable.style.display = "none";
      } else {
        visualScrambleDiv.style.display = "none";
        notAvailable.style.display = "block";
      }
      this.getCubeData(selectedCube);
    });

    const closeControlsInfo = document.getElementById('closeControlsInfo') as HTMLButtonElement;
    const dontShowInfoAgain = document.getElementById('dontShowInfoAgain') as HTMLAnchorElement;
    const controlsInfo = document.getElementById('controlsInfo') as HTMLDialogElement;
    const deleteSolveButton = document.getElementById('deleteSolveButton') as HTMLButtonElement;

    if (localStorage.getItem("noInfo") === "y") controlsInfo.classList.add("noDisplay");

    closeControlsInfo.addEventListener("click", () => {
      controlsInfo.classList.add("noDisplay");
    });

    dontShowInfoAgain.addEventListener("click", () => {
      controlsInfo.classList.add("noDisplay");
      localStorage.setItem("noInfo", "y");
    });

    deleteSolveButton.addEventListener("click", event => {
      const solvePosition = Number.parseInt((event.target as HTMLButtonElement).getAttribute("solve_round")!) - 1
      this.deleteSolve(solvePosition);
    });

    const cubeNameSpan = <HTMLSelectElement>document.getElementById("cubeNameSpan");
    cubeNameSpan?.addEventListener("click", () => { this.generateScramble(); });

    await this.getAllCubes().then(() => {
      this.getCubeData(cubeNames.options[cubeNames.selectedIndex]?.value || "3x3x3");
    });
  }

  constructor() {
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      const time = document.getElementById("time") as HTMLElement;
      if (event.key === ' ') {
        event.preventDefault();
      }
      if (this.runningTimer) {
        this.stopTimer();
      } else if (!this.keyPressed && event.key === ' ') {
        time.textContent = '0.00';
        if (time != null) time.style.color = 'red';
        this.keyPressed = true;
        this.startTime = Date.now();
        this.intervalId = setInterval(() => {
          this.elapsedTime = Date.now() - this.startTime;
          this.readyToStart = this.elapsedTime >= 500;
          if (this.readyToStart) {
            if (time != null) {
              time.style.color = 'green';
            }
          }
        }, 10);
      }
    });

    window.addEventListener('keyup', (event: KeyboardEvent) => {
      const time = document.getElementById("time");
      if (event.key === ' ') {
        this.keyPressed = false;
        clearInterval(this.intervalId);
        this.elapsedTime = Date.now() - this.startTime;
        if (time != null) time.style.color = '';
        if (this.readyToStart) {
          this.readyToStart = false;
          this.startTimer();
        }
      }
    });

    window.addEventListener('mousedown', (event: MouseEvent) => {
      const targetId = (event.target as HTMLElement).id;
      const time = document.getElementById("time") as HTMLElement;

      if (this.runningTimer) {
        this.stopTimer();
      } else if (!this.keyPressed && event.button === 0 && (targetId === "mainDiv" || targetId === "time")) {
        time.textContent = '0.00';
        if (time != null) time.style.color = 'red';
        this.keyPressed = true;
        this.startTime = Date.now();
        this.intervalId = setInterval(() => {
          this.elapsedTime = Date.now() - this.startTime;
          this.readyToStart = this.elapsedTime >= 500;
          if (this.readyToStart) {
            if (time != null) {
              time.style.color = 'green';
            }
          }
        }, 10);
      }
    });

    window.addEventListener('mouseup', (event: MouseEvent) => {
      const targetId = (event.target as HTMLElement).id;
      const time = document.getElementById("time");

      if (event.button === 0 && (targetId === "mainDiv" || targetId === "time")) {
        this.keyPressed = false;
        clearInterval(this.intervalId);
        this.elapsedTime = Date.now() - this.startTime;
        if (time != null) time.style.color = '';
        if (this.readyToStart) {
          this.readyToStart = false;
          this.startTimer();
        }
      }
    });

    window.addEventListener('touchstart', (event: TouchEvent) => {
      const targetId = (event.target as HTMLElement).id;
      const time = document.getElementById("time") as HTMLElement;

      if (this.runningTimer) {
        this.stopTimer();
      } else if ((targetId === "mainDiv" || targetId === "time")) {
        event.preventDefault();
        time.textContent = '0.00';
        if (time != null) time.style.color = 'red';
        this.keyPressed = true;
        this.startTime = Date.now();
        this.intervalId = setInterval(() => {
          this.elapsedTime = Date.now() - this.startTime;
          this.readyToStart = this.elapsedTime >= 500;
          if (this.readyToStart) {
            if (time != null) {
              time.style.color = 'green';
            }
          }
        }, 10);
      }
    });

    window.addEventListener('touchend', (event: TouchEvent) => {
      const targetId = (event.target as HTMLElement).id;
      const time = document.getElementById("time");

      if ((targetId === "mainDiv" || targetId === "time")) {
        event.preventDefault();
        this.keyPressed = false;
        clearInterval(this.intervalId);
        this.elapsedTime = Date.now() - this.startTime;
        if (time != null) time.style.color = '';
        if (this.readyToStart) {
          this.readyToStart = false;
          this.startTimer();
        }
      }
    });
  }

  startTimer() {
    const startTime: number = Date.now();
    this.runningTimer = true;
    this.timerInterval = setInterval(() => { this.updateTimer(startTime) }, 10);
  }

  updateTimer(startTime: number) {
    const elapsedTime = Date.now() - startTime;
    let minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
    let seconds: any = Math.floor((elapsedTime % (1000 * 60)) / 1000);
    let milliseconds: any = (Math.floor((elapsedTime % 1000)) / 10).toFixed(0);
    milliseconds = milliseconds >= 100 ? 0 : milliseconds < 10 ? "0" + milliseconds : milliseconds;

    const time = document.getElementById("time");
    if (time != null) {

      if (minutes <= 0) {
        time.textContent = seconds + "." + milliseconds + " s";

      } else {
        seconds = seconds < 10 ? "0" + seconds : seconds;
        time.textContent = minutes + ":" + seconds + "." + milliseconds + " m";
      }
    }
  }

  stopTimer() {
    clearInterval(this.timerInterval);
    this.runningTimer = false;
    const scramble = (document.getElementById("scramble") as HTMLElement).textContent;
    const cubeNames = <HTMLSelectElement>document.getElementById("cubeNames");
    const cubeName = cubeNames.options[cubeNames.selectedIndex].value;
    this.generateScramble();
    this.saveSolve(scramble, cubeName);
  }

  deleteSolve(solvePosition: Number) {
    const URL = `${properties.apiUrl}/solves?` + new URLSearchParams({
      solve_position: solvePosition.toString(),
      username: localStorage.getItem("user.name")!,
      room_code: localStorage.getItem("room")!
    });

    const response = fetch(URL, {
      method: "DELETE"
    }).then(response => {
      if (response.ok) {
        response.json().then(deletedSolve => {
          window.location.reload();
        });
      }
    });
  }

  saveSolve(scramble: any, cubeName: any) {
    const time = (document.getElementById("time") as HTMLElement).textContent;
    const video = ""
    const username = localStorage.getItem("user.name");
    const room = localStorage.getItem("room");

    const URL = `${properties.apiUrl}/parties`;

    const response = fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ time: time, scramble: scramble, video: video, username: username, room: room, cube_name: cubeName })
    }).then(response => {
      if (response.ok) {
        response.json().then(lastSolve => {
          this.appendSolveToList(lastSolve.lastSolve, lastSolve.solvesAmount);
          this.calculateAvgs(lastSolve.avgs);
          return lastSolve;
        });
      }
    }).catch(error => {
      console.error("Error saving the time:", error);
    });
  }

  showSolvesList(cubeName: any) {
    const timesTable = document.getElementById("currentTimeTable") as HTMLTableElement;
    const timesTableHeader = timesTable.children[0];
    timesTable.innerHTML = "";
    timesTable.appendChild(timesTableHeader);

    const URL = `${properties.apiUrl}/parties/actual?` + new URLSearchParams({
      username: localStorage.getItem("user.name")!,
      room_code: localStorage.getItem("room")!,
      cube_name: cubeName!
    });

    const response = fetch(URL
    ).then(response => {
      if (response.status === 200) {
        response.json().then(party => {
          const solvesList = party.party.solve_ids;
          for (let i = 0; i < solvesList.length; i++) {
            const solvesAmount = i + 1;
            this.appendSolveToList(solvesList[i], solvesAmount);
          }
          this.calculateAvgs(party.avgs);
        });
      }
    }).catch(error => console.log(error));
  }

  calculateAvgs(avgs: Array<string>) {
    const avgsAmount = [3, 5, 12, 25, 50, 100, 200, 500, 1000, 2000, 10000];
    const solvesTds = document.getElementsByClassName("current");

    for (const i in solvesTds) {
      const tr = (solvesTds[i].parentNode as HTMLTableRowElement);
      if (tr !== undefined && tr.id !== "lastTime") tr.classList.add("noDisplay");
    }

    (document.getElementsByClassName("current")[0] as HTMLTableRowElement).textContent = (document.getElementById("time") as HTMLElement).textContent;

    for (let i = 0; i < avgsAmount.length; i++) {
      if (avgs[i] === undefined) break
      else {
        (solvesTds[i + 1].parentNode as HTMLTableRowElement).classList.remove("noDisplay");
        solvesTds[i + 1].textContent = avgs[i];
      }
    }
  }

  appendSolveToList(lastSolve: any, nextSolveid: any) {
    const timesTable = document.getElementById("currentTimeTable") as HTMLTableElement;

    const tr = timesTable.insertRow(1);

    const tdRound = document.createElement("td");
    const tdTime = document.createElement("td");
    const tdScramble = document.createElement("td");
    tr.appendChild(tdRound);
    tr.appendChild(tdTime);
    tr.appendChild(tdScramble);

    tdRound.appendChild(document.createTextNode(nextSolveid));
    tdTime.appendChild(document.createTextNode(lastSolve.time));

    const buttonScramble = document.createElement("button");
    buttonScramble.appendChild(document.createTextNode("view"));
    buttonScramble.className = "viewScrambleButton";
    buttonScramble.setAttribute("round", nextSolveid);
    buttonScramble.setAttribute("time", lastSolve.time);
    buttonScramble.setAttribute("scramble", lastSolve.scramble);
    buttonScramble.setAttribute("data-bs-toggle", "modal");
    buttonScramble.setAttribute("data-bs-target", "#showScramblePopup");
    buttonScramble.addEventListener("click", event => { this.showSolveData(event.target) });

    tdScramble.appendChild(buttonScramble);
  }

  showSolveData(solve: any) {
    const round = solve.getAttribute("round");
    const scramble = solve.getAttribute("scramble");
    const time = solve.getAttribute("time");

    const solveRow = document.getElementById("showScrambleTable")?.children[1] as HTMLTableRowElement;
    const deleteButton = document.getElementById("deleteSolveButton") as HTMLButtonElement;

    solveRow.children[0].textContent = round;
    solveRow.children[1].textContent = time;
    solveRow.children[2].textContent = scramble;

    deleteButton.setAttribute("solve_round", round);

    deleteButton?.addEventListener("onclick", () => {

    })
  }

  generateScramble() {
    const movementTypes = localStorage.getItem("cube.movementTypes") || "";
    const totalMovs = Number.parseInt(localStorage.getItem("cube.movements_number") || "0");

    const possibleMovs = movementTypes.split(" ");
    const numPossibleMovs = possibleMovs.length;
    let scramble = "", actualMov, lastMov = "", secondToLastMov = "", actualMovLetter, lastMoveLetter, secondToLastMovLetter, opsositeSecondToLastMovletter;
    let validMove = false;
    for (let i = 0; i < totalMovs; i++) {
      /* Generates a new letter until it doesn't match the last one generated */
      do {
        actualMov = possibleMovs[Math.floor(Math.random() * (numPossibleMovs - 1))];
        actualMovLetter = actualMov.charAt(0);
        lastMoveLetter = lastMov.charAt(0);
        secondToLastMovLetter = secondToLastMov.charAt(0);
        opsositeSecondToLastMovletter = this.getOpositeLetter(secondToLastMovLetter);

        /* Actual movement is valid when:
         * - Actual and last letters are different
         * - Second to last and third to last letters are not oposite
         * - Second to last and third to last letters are oposite and actual and third to last letters are differents
         */
        validMove = actualMovLetter !== lastMoveLetter && (lastMoveLetter === opsositeSecondToLastMovletter ? actualMovLetter !== secondToLastMovLetter : true);
      } while (!validMove);
      secondToLastMov = lastMov;
      lastMov = actualMov;

      /* Adds the movement to the final scramble */
      scramble += " " + actualMov;
    }
    scramble = scramble.trim();

    /* Prints the new scramble in the web */
    const scrambleText = document.getElementById("scramble");
    if (scrambleText != null) scrambleText.textContent = scramble;

    this.showVisualScramble(scramble);
  }

  showVisualScramble(scramble: any) {
    const scrambleArray = scramble.split(" ");
    const faces = document.getElementsByClassName("face");
    const upFace = faces[0].childNodes,
      leftFace = faces[1].childNodes,
      frontFace = faces[2].childNodes,
      rightFace = faces[3].childNodes,
      backFace = faces[4].childNodes,
      downFace = faces[5].childNodes;
    let upFaceArray: any = [], leftFaceArray: any = [], frontFaceArray: any = [], rightFaceArray: any = [], backFaceArray: any = [], downFaceArray: any = [];

    upFace.forEach(piece => {
      upFaceArray.push((piece as HTMLElement));
      (piece as HTMLElement).className = "colorWhite";
    });
    leftFace.forEach(piece => {
      leftFaceArray.push((piece as HTMLElement));
      (piece as HTMLElement).className = "colorOrange";
    });
    frontFace.forEach(piece => {
      frontFaceArray.push((piece as HTMLElement));
      (piece as HTMLElement).className = "colorGreen";
    });
    rightFace.forEach(piece => {
      rightFaceArray.push((piece as HTMLElement));
      (piece as HTMLElement).className = "colorRed";
    });
    backFace.forEach(piece => {
      backFaceArray.push((piece as HTMLElement));
      (piece as HTMLElement).className = "colorBlue";
    });
    downFace.forEach(piece => {
      downFaceArray.push((piece as HTMLElement));
      (piece as HTMLElement).className = "colorYellow";
    });

    for (const movement of scrambleArray) {
      switch (movement) {
        case "U":
          this.clockwiseMovement(upFaceArray, leftFaceArray, frontFaceArray, rightFaceArray, backFaceArray);
          break;
        case "L":
          this.clockwiseMovement(leftFaceArray, this.rotateArrayAnticlockwise(backFaceArray), this.rotateArrayClockwise(downFaceArray),
            this.rotateArrayClockwise(frontFaceArray), this.rotateArrayClockwise(upFaceArray));
          break;
        case "F":
          this.clockwiseMovement(frontFaceArray, this.rotateArrayAnticlockwise(leftFaceArray), downFaceArray,
            this.rotateArrayClockwise(rightFaceArray), this.rotateArrayDouble(upFaceArray));
          break;
        case "R":
          this.clockwiseMovement(rightFaceArray, this.rotateArrayAnticlockwise(frontFaceArray), this.rotateArrayAnticlockwise(downFaceArray),
            this.rotateArrayClockwise(backFaceArray), this.rotateArrayAnticlockwise(upFaceArray));
          break;
        case "B":
          this.clockwiseMovement(backFaceArray, this.rotateArrayAnticlockwise(rightFaceArray), this.rotateArrayDouble(downFaceArray),
            this.rotateArrayClockwise(leftFaceArray), upFaceArray);
          break;
        case "D":
          this.clockwiseMovement(downFaceArray, this.rotateArrayDouble(leftFaceArray), this.rotateArrayDouble(backFaceArray),
            this.rotateArrayDouble(rightFaceArray), this.rotateArrayDouble(frontFaceArray));
          break;
        case "U'":
          this.antiClockwiseMovement(upFaceArray, leftFaceArray, frontFaceArray, rightFaceArray, backFaceArray);
          break;
        case "L'":
          this.antiClockwiseMovement(leftFaceArray, this.rotateArrayAnticlockwise(backFaceArray), this.rotateArrayClockwise(downFaceArray),
            this.rotateArrayClockwise(frontFaceArray), this.rotateArrayClockwise(upFaceArray));
          break;
        case "F'":
          this.antiClockwiseMovement(frontFaceArray, this.rotateArrayAnticlockwise(leftFaceArray), downFaceArray,
            this.rotateArrayClockwise(rightFaceArray), this.rotateArrayDouble(upFaceArray));
          break;
        case "R'":
          this.antiClockwiseMovement(rightFaceArray, this.rotateArrayAnticlockwise(frontFaceArray), this.rotateArrayAnticlockwise(downFaceArray),
            this.rotateArrayClockwise(backFaceArray), this.rotateArrayAnticlockwise(upFaceArray));
          break;
        case "B'":
          this.antiClockwiseMovement(backFaceArray, this.rotateArrayAnticlockwise(rightFaceArray), this.rotateArrayDouble(downFaceArray),
            this.rotateArrayClockwise(leftFaceArray), upFaceArray);
          break;
        case "D'":
          this.antiClockwiseMovement(downFaceArray, this.rotateArrayDouble(leftFaceArray), this.rotateArrayDouble(backFaceArray),
            this.rotateArrayDouble(rightFaceArray), this.rotateArrayDouble(frontFaceArray));
          break;
        case "U2":
          this.doubleMovement(upFaceArray, leftFaceArray, frontFaceArray, rightFaceArray, backFaceArray);
          break;
        case "L2":
          this.doubleMovement(leftFaceArray, this.rotateArrayAnticlockwise(backFaceArray), this.rotateArrayClockwise(downFaceArray),
            this.rotateArrayClockwise(frontFaceArray), this.rotateArrayClockwise(upFaceArray));
          break;
        case "F2":
          this.doubleMovement(frontFaceArray, this.rotateArrayAnticlockwise(leftFaceArray), downFaceArray,
            this.rotateArrayClockwise(rightFaceArray), this.rotateArrayDouble(upFaceArray));
          break;
        case "R2":
          this.doubleMovement(rightFaceArray, this.rotateArrayAnticlockwise(frontFaceArray), this.rotateArrayAnticlockwise(downFaceArray),
            this.rotateArrayClockwise(backFaceArray), this.rotateArrayAnticlockwise(upFaceArray));
          break;
        case "B2":
          this.doubleMovement(backFaceArray, this.rotateArrayAnticlockwise(rightFaceArray), this.rotateArrayDouble(downFaceArray),
            this.rotateArrayClockwise(leftFaceArray), upFaceArray);
          break;
        case "D2":
          this.doubleMovement(downFaceArray, this.rotateArrayDouble(leftFaceArray), this.rotateArrayDouble(backFaceArray),
            this.rotateArrayDouble(rightFaceArray), this.rotateArrayDouble(frontFaceArray));
          break;
      }
    }
  }

  rotateArrayClockwise(face: any) {
    const newFace = []

    newFace[0] = face[6];
    newFace[6] = face[8];
    newFace[8] = face[2];
    newFace[2] = face[0];

    newFace[1] = face[3];
    newFace[3] = face[7];
    newFace[7] = face[5];
    newFace[5] = face[1];

    return newFace;
  }

  rotateArrayAnticlockwise(face: any) {
    const newFace = []

    newFace[0] = face[2];
    newFace[2] = face[8];
    newFace[8] = face[6];
    newFace[6] = face[0];

    newFace[1] = face[5];
    newFace[5] = face[7];
    newFace[7] = face[3];
    newFace[3] = face[1];

    return newFace;
  }

  rotateArrayDouble(face: any) {
    const newFace = []

    newFace[0] = face[8];
    newFace[8] = face[0];
    newFace[2] = face[6];
    newFace[6] = face[2];

    newFace[1] = face[7];
    newFace[7] = face[1];
    newFace[3] = face[5];
    newFace[5] = face[3];

    return newFace;
  }

  clockwiseMovement(upFace: any, leftFace: any, frontFace: any, rightFace: any, backFace: any) {
    const edgeUpU = upFace[1];
    const edgeUpL = upFace[3];
    const edgeUpR = upFace[5];
    const edgeUpD = upFace[7];

    const edgeLeft = leftFace[1];
    const edgeFront = frontFace[1];
    const edgeRight = rightFace[1];
    const edgeBack = backFace[1];

    const cornerUpUL = upFace[0];
    const cornerUpUR = upFace[2];
    const cornerUpDL = upFace[6];
    const cornerUpDR = upFace[8];

    const cornerLeftUL = leftFace[0];
    const cornerFrontUL = frontFace[0];
    const cornerRightUL = rightFace[0];
    const cornerBackUL = backFace[0];

    const cornerLeftUR = leftFace[2];
    const cornerFrontUR = frontFace[2];
    const cornerRightUR = rightFace[2];
    const cornerBackUR = backFace[2];

    const edgeUpUClassName = edgeUpU.className;
    const edgeLeftClassName = edgeLeft.className;
    const cornerUpULClassName = cornerUpUL.className;
    const cornerLeftULClassName = cornerLeftUL.className;
    const cornerLeftURClassName = cornerLeftUR.className;

    edgeUpU.className = edgeUpL.className;
    edgeUpL.className = edgeUpD.className;
    edgeUpD.className = edgeUpR.className;
    edgeUpR.className = edgeUpUClassName;

    edgeLeft.className = edgeFront.className;
    edgeFront.className = edgeRight.className;
    edgeRight.className = edgeBack.className;
    edgeBack.className = edgeLeftClassName;

    cornerUpUL.className = cornerUpDL.className;
    cornerUpDL.className = cornerUpDR.className;
    cornerUpDR.className = cornerUpUR.className;
    cornerUpUR.className = cornerUpULClassName;

    cornerLeftUL.className = cornerFrontUL.className;
    cornerFrontUL.className = cornerRightUL.className;
    cornerRightUL.className = cornerBackUL.className;
    cornerBackUL.className = cornerLeftULClassName;

    cornerLeftUR.className = cornerFrontUR.className;
    cornerFrontUR.className = cornerRightUR.className;
    cornerRightUR.className = cornerBackUR.className;
    cornerBackUR.className = cornerLeftURClassName;
  }

  antiClockwiseMovement(upFace: any, leftFace: any, frontFace: any, rightFace: any, backFace: any) {
    const edgeUpU = upFace[1];
    const edgeUpL = upFace[3];
    const edgeUpR = upFace[5];
    const edgeUpD = upFace[7];

    const edgeLeft = leftFace[1];
    const edgeFront = frontFace[1];
    const edgeRight = rightFace[1];
    const edgeBack = backFace[1];

    const cornerUpUL = upFace[0];
    const cornerUpUR = upFace[2];
    const cornerUpDL = upFace[6];
    const cornerUpDR = upFace[8];

    const cornerLeftUL = leftFace[0];
    const cornerFrontUL = frontFace[0];
    const cornerRightUL = rightFace[0];
    const cornerBackUL = backFace[0];

    const cornerLeftUR = leftFace[2];
    const cornerFrontUR = frontFace[2];
    const cornerRightUR = rightFace[2];
    const cornerBackUR = backFace[2];

    const edgeUpUClassName = edgeUpU.className;
    const edgeLeftClassName = edgeLeft.className;
    const cornerUpULClassName = cornerUpUL.className;
    const cornerLeftULClassName = cornerLeftUL.className;
    const cornerLeftURClassName = cornerLeftUR.className;

    edgeUpU.className = edgeUpR.className;
    edgeUpR.className = edgeUpD.className;
    edgeUpD.className = edgeUpL.className;
    edgeUpL.className = edgeUpUClassName;

    edgeLeft.className = edgeBack.className;
    edgeBack.className = edgeRight.className;
    edgeRight.className = edgeFront.className;
    edgeFront.className = edgeLeftClassName;

    cornerUpUL.className = cornerUpUR.className;
    cornerUpUR.className = cornerUpDR.className;
    cornerUpDR.className = cornerUpDL.className;
    cornerUpDL.className = cornerUpULClassName;

    cornerLeftUL.className = cornerBackUL.className;
    cornerBackUL.className = cornerRightUL.className;
    cornerRightUL.className = cornerFrontUL.className;
    cornerFrontUL.className = cornerLeftULClassName;

    cornerLeftUR.className = cornerBackUR.className;
    cornerBackUR.className = cornerRightUR.className;
    cornerRightUR.className = cornerFrontUR.className;
    cornerFrontUR.className = cornerLeftURClassName;
  }

  doubleMovement(upFace: any, leftFace: any, frontFace: any, rightFace: any, backFace: any) {
    const edgeUpU = upFace[1];
    const edgeUpL = upFace[3];
    const edgeUpR = upFace[5];
    const edgeUpD = upFace[7];

    const edgeLeft = leftFace[1];
    const edgeFront = frontFace[1];
    const edgeRight = rightFace[1];
    const edgeBack = backFace[1];

    const cornerUpUL = upFace[0];
    const cornerUpUR = upFace[2];
    const cornerUpDL = upFace[6];
    const cornerUpDR = upFace[8];

    const cornerLeftUL = leftFace[0];
    const cornerFrontUL = frontFace[0];
    const cornerRightUL = rightFace[0];
    const cornerBackUL = backFace[0];

    const cornerLeftUR = leftFace[2];
    const cornerFrontUR = frontFace[2];
    const cornerRightUR = rightFace[2];
    const cornerBackUR = backFace[2];

    const edgeUpUClassName = edgeUpU.className;
    const edgeUpLClassName = edgeUpL.className;
    const edgeLeftClassName = edgeLeft.className;
    const edgeFrontClassName = edgeFront.className;
    const cornerUpULClassName = cornerUpUL.className;
    const cornerUpURClassName = cornerUpUR.className;
    const cornerLeftULClassName = cornerLeftUL.className;
    const cornerFrontULClassName = cornerFrontUL.className;
    const cornerLeftURClassName = cornerLeftUR.className;
    const cornerFrontURClassName = cornerFrontUR.className;

    edgeUpU.className = edgeUpD.className;
    edgeUpD.className = edgeUpUClassName;
    edgeUpL.className = edgeUpR.className;
    edgeUpR.className = edgeUpLClassName;

    edgeLeft.className = edgeRight.className;
    edgeRight.className = edgeLeftClassName;
    edgeFront.className = edgeBack.className;
    edgeBack.className = edgeFrontClassName;

    cornerUpUL.className = cornerUpDR.className;
    cornerUpDR.className = cornerUpULClassName;
    cornerUpUR.className = cornerUpDL.className;
    cornerUpDL.className = cornerUpURClassName;

    cornerLeftUL.className = cornerRightUL.className;
    cornerRightUL.className = cornerLeftULClassName;
    cornerFrontUL.className = cornerBackUL.className;
    cornerBackUL.className = cornerFrontULClassName;

    cornerLeftUR.className = cornerRightUR.className;
    cornerRightUR.className = cornerLeftURClassName;
    cornerFrontUR.className = cornerBackUR.className;
    cornerBackUR.className = cornerFrontURClassName;
  }

  getOpositeLetter(letter: string) {
    let opsiteLetter = "";
    switch (letter) {
      case "F":
        opsiteLetter = "B";
        break;
      case "B":
        opsiteLetter = "F";
        break;
      case "U":
        opsiteLetter = "D";
        break;
      case "D":
        opsiteLetter = "U";
        break;
      case "L":
        opsiteLetter = "R";
        break;
      case "R":
        opsiteLetter = "L";
        break;
    }
    return opsiteLetter;
  }

  async getCubeData(cubeName: String) {
    const URL = `${properties.apiUrl}/cubes/${cubeName}`;

    const response = await fetch(URL
    ).then(response => {
      if (response.status === 200) {
        response.json().then(cube => {
          localStorage.setItem("cube.movementTypes", cube.movement_types);
          localStorage.setItem("cube.movements_number", cube.movements_number);
          localStorage.setItem("room", `${localStorage.getItem("room")?.substring(0, localStorage.getItem("room")?.lastIndexOf("-"))}-${cube.name}`);
          this.generateScramble();
          this.showSolvesList(cubeName);
        });
      }
    }).catch(error => {
      console.error("Error getting cube data:", error);
    });
  }

  async getAllCubes() {
    const URL = `${properties.apiUrl}/cubes`;

    const response = await fetch(URL
    ).then(response => {
      if (response.status === 200) {
        response.json().then(cubes => {
          const cubeNames = document.getElementById("cubeNames");
          if (cubeNames != null) {
            cubes.forEach((cube: any) => {
              const newOption = document.createElement("option");
              newOption.value = cube.name;
              newOption.textContent = cube.name;
              cubeNames.appendChild(newOption);
            });
          }
        });
      }
    }).catch(error => {
      console.error("Error getting cube data:", error);
    });
  }
}
