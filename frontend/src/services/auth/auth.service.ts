import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthManager} from '../../core/auth/AuthManager';

@Injectable({
  providedIn: 'root',
})
export class AuthService {


  url: string = "/api/"

  private authManager: AuthManager = inject(AuthManager);


  constructor(private http: HttpClient) {
  }


  signIn(data: { email: string, password: string }): Promise<any> {
    return this.http.post(this.url + 'auth/login', data).toPromise().then((res: any) => {
      this.authManager.clear();
      this.authManager.set(res);

      return {
        message:'success'
      }
    });
  }

  signUp(data: { email: string, password: string }): Promise<any> {
    return this.http.post(this.url + 'auth/signup', data).toPromise();
  }

  logout():Promise<void> {
    return this.http.post(this.url + 'auth/logout', {}, {
      headers: {
        authorization: 'Bearer ' + (this.authManager.user.at ?? "")
      }
    }).toPromise().then((_) => this.authManager.clear());

  }

}
