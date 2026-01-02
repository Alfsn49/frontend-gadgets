import { bootstrapApplication } from '@angular/platform-browser';
import * as Sentry from "@sentry/angular";
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

Sentry.init({
  dsn: "https://57744b559cad24b7ffe8a011d4b0a1ec@o4509698577334272.ingest.us.sentry.io/4509698579300352",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true
});
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
