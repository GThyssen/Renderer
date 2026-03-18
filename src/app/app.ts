import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CanvasBox } from "./components/canvas-box/canvas-box";
import { Menu } from "./components/menu/menu";

const COLOURS = ['red', 'blue', 'green'] as const;

@Component({
  selector: 'app-root',
  imports: [CanvasBox, Menu],
  templateUrl: './app.html',
  styleUrl: './app.css'
})


export class App {

  readonly colours = ['red', 'blue', 'green'];
  readonly models = ['cilinder', 'cube', 'sphere', 'torus'];

  readonly selectedColour = signal('green');
  readonly selectedModel = signal('torus');

  setSelectedColour(colour: string) {
    this.selectedColour.set(colour);
  }

  setSelectedModel(model: string) {
    this.selectedModel.set(model);
  }
}