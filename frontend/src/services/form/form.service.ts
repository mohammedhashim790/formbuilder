import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormFromDb} from '../../models/form.model';
import {AuthManager} from '../../core/auth/AuthManager';

@Injectable({
  providedIn: 'root',
})
export class FormService {

  url: string = "http://internal-formbuilder-internal-alb-1172368990.us-east-1.elb.amazonaws.com/"

  constructor(private http: HttpClient, private authManager: AuthManager) {
  }


  list(): Promise<FormFromDb[]> {
    return this.http.get(this.url + "forms").toPromise().then((res) => res as FormFromDb[]);
  }


  get(shortId: string) {
    return this.http.get(this.url + "forms/getByShortId/" + shortId).toPromise().then((res) => res as FormFromDb);
  }

  getById(id: string) {
    return this.http.get(this.url + 'forms/' + id).toPromise().then((res) => res as FormFromDb);
  }


  create(data: any): Promise<FormFromDb> {
    return this.http.post(this.url + 'forms/', data, {
      headers: {
        Authorization: 'Bearer ' + (this.authManager.user.at ?? '')
      }
    }).toPromise().then((res) => res as FormFromDb);
  }


}
