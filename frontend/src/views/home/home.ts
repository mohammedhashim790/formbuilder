import {ChangeDetectorRef, Component} from '@angular/core';
import {HealthService} from '../../services/health/health.service';

@Component({
  selector: 'app-home', standalone: true, imports: [], templateUrl: './home.html', styleUrl: './home.css'
})
export class Home {


  protected response: string = "";

  constructor(private healthService: HealthService, private cdr: ChangeDetectorRef) {

    this.healthService.health().then((res) => {
      this.response = JSON.stringify(res);
      this.cdr.detectChanges();
    }).catch((error) => console.error(error));
  }

}
