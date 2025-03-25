import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() buttonText: string = "text";
  @Input() buttonClass: string = "";
  @Input() isDisabled: boolean = false;
  @Input() buttonType: "button" | "menu" | "reset" | "submit" = "button";

  disabled = false;

  ngOnChanges() {
    this.disabled = this.isDisabled;
  }
}
