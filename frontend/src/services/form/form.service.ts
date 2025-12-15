import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormFromDb} from '../../models/form.model';
import {AuthManager} from '../../core/auth/AuthManager';
import {url} from '../utils';

@Injectable({
  providedIn: 'root',
})
export class FormService {


  constructor(private http: HttpClient, private authManager: AuthManager) {
  }


  list(): Promise<FormFromDb[]> {
    return this.http.get(url + "forms").toPromise().then((res) => res as FormFromDb[]);
  }


  get(shortId: string) {
    return this.http.get(url + "forms/getByShortId/" + shortId).toPromise().then((res) => res as FormFromDb);
  }

  getById(id: string) {
    return this.http.get(url + 'forms/' + id).toPromise().then((res) => res as FormFromDb);
  }


  create(data: any): Promise<FormFromDb> {
    return this.http.post(url + 'forms/', data, {
      headers: {
        Authorization: 'Bearer ' + (this.authManager.user.at ?? '')
      }
    }).toPromise().then((res) => res as FormFromDb);
  }


}
