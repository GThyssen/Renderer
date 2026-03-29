import { Component, signal } from '@angular/core';
import { CanvasBox } from "../../components/canvas-box/canvas-box";
import { Menu } from "../../components/menu/menu";
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-model-page',
  imports: [CanvasBox, Menu],
  templateUrl: './model-page.html',
  styleUrl: './model-page.css',
})
export class ModelPage {
  readonly colours = ['red', 'blue', 'green'];
  readonly models = ['cilinder', 'cube', 'sphere', 'torus'];
  
  readonly selectedColour = signal('green');
  readonly selectedModel = signal('torus');

    constructor(private userService: UserService) {}
  
    ngOnInit(): void {
      this.userService.getUserInfo();
    }
  
    setSelectedColour(colour: string) {
      this.selectedColour.set(colour);
    }
  
    setSelectedModel(model: string) {
      this.selectedModel.set(model);
    }
}
