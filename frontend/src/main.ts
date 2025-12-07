import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './views/app/app.config';
import { App } from './views/app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
