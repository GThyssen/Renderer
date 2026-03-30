import { Component, Inject, OnInit } from '@angular/core';
import { NgIcon } from "@ng-icons/core";
import { UserService } from '../../services/user-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [NgIcon],
  templateUrl: './header.html',
  styleUrl: './header.css',
})

export class Header implements OnInit {

  constructor(public userService : UserService, private router: Router) {

  }  

  ngOnInit() {
    const user = this.userService.loggedInUser();

    if (user) {
      console.log(user.email);
    }
  } 

  logout() {
    this.router.navigate(['/login']);
  }

  navigateTo(route: string) {
    this.router.navigate([route])
  }

}
