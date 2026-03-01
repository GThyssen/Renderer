import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})

export class Menu {

  colours = input<string[]>();
  selectedColour = output<string>();

  selectColor(colour : string){
    this.selectedColour.emit(colour);
  }
}
