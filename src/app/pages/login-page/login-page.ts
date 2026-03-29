import { Component } from '@angular/core';
import { UserService } from '../../services/user-service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  email: string = '';
  password: string = '';
  loading: boolean = false;

  constructor(private userService: UserService, private router: Router) {

  }

  async onSubmit() {
    const loginResult = await this.userService.loginUser(this.email, this.password);
    if (loginResult) {
      this.router.navigate(['/']);
    }
  }

  navigateToRegisterPage() {
    this.router.navigate(['/register']);
  }
}
