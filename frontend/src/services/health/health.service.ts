import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {url} from '../utils';

@Injectable({
  providedIn: 'root',
})
export class HealthService {



  constructor(private http: HttpClient) {
  }

  health() {
    return this.http.get(url + "health").toPromise().then((res) => res as any);
  }
}
