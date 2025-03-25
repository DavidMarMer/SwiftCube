import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-visual-scramble',
  templateUrl: './visual-scramble.component.html',
  styleUrls: ['./visual-scramble.component.scss']
})
export class VisualScrambleComponent implements AfterViewInit {

  private showVisualScramble: boolean = true;

  ngAfterViewInit(): void {
    const visualCubeScramble = document.getElementById("visualCubeScramble") as HTMLDivElement;
    const visualScrambleDiv = document.getElementById("visualScrambleDiv") as HTMLDivElement;
    const hideIcon = document.getElementById("hideIcon") as HTMLDivElement;

    hideIcon.addEventListener("click", () => {
      if (this.showVisualScramble) {
        hideIcon.style.transform = "rotate(-90deg)";
        visualScrambleDiv.style.display = "none";
        visualCubeScramble.style.height = "25px";
      } else {
        hideIcon.style.transform = "";
        visualScrambleDiv.style.display = "";
        visualCubeScramble.style.height = "";
      }
      this.showVisualScramble = !this.showVisualScramble;

    });
  }

}
