import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthManager} from '../../core/auth/AuthManager';
import {url} from '../utils';

@Injectable({
  providedIn: 'root',
})
export class RecordService {

  constructor(private http: HttpClient, private authManager: AuthManager) {
  }


  create(data: any): Promise<any> {
    return this.http.post(url + 'record/', data).toPromise().then((res) => res as any);
  }

  checkIn(id: any): Promise<any> {
    return this.http.post(url + 'record/checkin/' + id, {}).toPromise().then((res) => res as any);
  }


}
