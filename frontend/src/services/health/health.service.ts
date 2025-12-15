import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HealthService {

  url: string = "http://internal-formbuilder-internal-alb-1172368990.us-east-1.elb.amazonaws.com/"


  constructor(private http: HttpClient) {
  }

  health() {
    return this.http.get(this.url + "health").toPromise().then((res) => res as any);
  }
}
