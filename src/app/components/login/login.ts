import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {

  userEmail: string | null = null;
  storage: Storage = sessionStorage;

  constructor(public auth: AuthService) {
  }

  ngOnInit(): void {

    // this.auth.user$.subscribe(user => {
    //   console.log('Full user object:', user);
    // });

    this.auth.user$.subscribe(
      user => {
        this.userEmail = user?.email || null;
        console.log('User email =:', this.userEmail);
        this.storage.setItem('userEmail', JSON.stringify(this.userEmail));
      }
    )
  }

  login(): void {
    this.auth.loginWithRedirect();
  }

  logout(): void {
    this.auth.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  }
}