import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  imports: [],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
})

export class RegisterPage {
  loading: boolean = false;

  constructor(private router : Router) {

  }

  toLoginPage() {
    this.router.navigate(['login']);
  }
}
