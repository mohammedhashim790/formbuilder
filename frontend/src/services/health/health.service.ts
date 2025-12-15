import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HealthService {

  url: string = "http://localhost:4000/"


  constructor(private http: HttpClient) {
  }

  health() {
    return this.http.get(this.url + "health").toPromise().then((res) => res as any);
  }
}
