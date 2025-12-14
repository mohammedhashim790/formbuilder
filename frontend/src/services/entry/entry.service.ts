import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthManager} from '../../core/auth/AuthManager';

@Injectable({
  providedIn: 'root',
})
export class EntryService {

  url: string = "http://localhost:4000/"

  constructor(private http: HttpClient, private authManager: AuthManager) {
  }

  list(formId: string) {
    return this.http.get(this.url + "record/" + formId).toPromise().then((res) => (res as Array<any>).map((item) => item));
  }


}
