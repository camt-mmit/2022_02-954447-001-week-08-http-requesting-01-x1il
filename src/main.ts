import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './routes';
import {
  ConfigurationToken as GoogleConfigurationToken,
  StorageToken,
} from './app/google/models';
import { googleconfiguration } from './configurations';
import { StorageService } from './app/google/services/storage.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    {
      provide: GoogleConfigurationToken,
      useValue: googleconfiguration,
    },
    {
      provide: StorageToken,
      useClass: StorageService,
    },
  ],
}).catch((err) => console.error(err));