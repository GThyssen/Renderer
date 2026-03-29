import { Injectable, signal } from '@angular/core';
import { HttpClient } from '../helpers/HttpClient';

@Injectable({
  providedIn: 'root',
})

export class UserService {

  loggedInUser = signal<User | null>(null);
  
  constructor(private httpClient: HttpClient){
    
  }

  async getUserInfo() : Promise<User | null> {
    let userInfoResult = await this.httpClient.get('/api/users/userinfo');
    if (userInfoResult.success) {
      this.loggedInUser.set(userInfoResult.data as User);
      return userInfoResult.data as User;
    }
    else {
      return null;
    }
  }

  async loginUser(email: string, password: string) : Promise<boolean> {
    const loginRequest = {
      "email" : email,
      "password": password
    };

    const loginResult = await this.httpClient.post('/account/login?useSessionCookies=true', loginRequest, false);
    if (loginResult.success) {
      await this.getUserInfo();
      return true;
    }
    else {
      return false;
    }
  }

  clearUser() {
    this.loggedInUser.set(null);
  }
}

export interface User {
  userName: string;
  NormalizedUserName: string;
  email: string;
  id: string;
  EmailConfirmed: boolean;
  phoneNumber: boolean;
  twoFactorEnabled: boolean;
  loackoutEnabled: boolean;
  roles: string[];
}
