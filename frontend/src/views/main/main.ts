import {Component} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {AuthManager} from '../../core/auth/AuthManager';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class Main {


  constructor(private authService:AuthService, private router:Router) {
  }

  protected signOut() {
    this.authService.logout().then(r => this.router.navigate(['login']));
  }
}
