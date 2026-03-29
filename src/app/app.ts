import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./components/header/header";
import { FormsModule } from '@angular/forms';

const COLOURS = ['red', 'blue', 'green'] as const;

@Component({
  selector: 'app-root',
  imports: [Header, RouterOutlet, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})


export class App  {
  
}