import {Injectable} from '@angular/core';
import {jwtDecode} from 'jwt-decode';


class User {
  email?: string;
  expiresIn?: number;

  at?: string;

  isSignedIn: boolean = false;

  constructor(email?: string, expiresIn?: number, at?: string) {
    this.email = email;
    this.expiresIn = expiresIn;
    this.isSignedIn = this.email !== undefined;
    this.at = at;
  }


}

@Injectable({
  providedIn: 'root'
})
export class AuthManager {

  user: User = new User();

  load() {

    if (this.user.isSignedIn) return;

    const at = localStorage.getItem('at');
    const expiresIn = localStorage.getItem('expiresIn') ?? '0';

    if (at === null) return;

    const dec = jwtDecode(at) as any;
    this.user = new User(dec['username'], parseInt(expiresIn), at)

  }

  set(res: any) {
    localStorage.setItem('at', res['accessToken'] ?? "");
    localStorage.setItem('rt', res['refreshToken'] ?? "");
    localStorage.setItem('it', res['idToken'] ?? "");
    localStorage.setItem('expiresIn', res['expiresIn'] ?? "");

    this.load();
  }

  clear() {
    localStorage.clear();
  }

}
