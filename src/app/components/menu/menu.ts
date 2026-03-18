import { Component, input, output, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.html',
  styleUrl: './menu.css',
  imports: [NgIcon],
})

export class Menu {

  colours = input<string[]>();
  selectedColour = output<string>();

  models = input<string[]>();
  selectedModel = output<string>();

  selectColor(colour : string){
    this.selectedColour.emit(colour);
  }

  selectModel(model: string){
    this.selectedModel.emit(model);
  }
}
