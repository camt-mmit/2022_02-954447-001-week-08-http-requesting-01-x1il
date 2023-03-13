import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PeopleListPageComponent } from './star-war/router/people/people-list-page/people-list-page.component';
import { SpeciesComponent } from './star-war/species/species.component';

@NgModule({
  declarations: [
    AppComponent,
    PeopleListPageComponent,
    SpeciesComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
