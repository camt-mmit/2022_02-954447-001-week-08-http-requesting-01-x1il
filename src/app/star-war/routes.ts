import { Route } from "@angular/router";
import { PersonViewPageComponent } from "../people/router/person-view-page/person-view-page.component";
import { PeopleListPageComponent } from "./router/people/people-list-page/people-list-page.component";
import { SpeciesListPageComponent } from "./router/species/species-list-page/species-list-page.component";
import { SpeciesViewPageComponent } from "./router/species/species-view-page/species-view-page.component";
import { StarWarComponent } from "./router/star-war/star-war.component";

export const routes: Route[] = [
    {
        path: '',
        component:StarWarComponent,
        children: [
            {path:'',redirectTo: 'people',pathMatch: 'full'},
            {path:'people',component:PeopleListPageComponent},
            {path:'people/:id',component: PersonViewPageComponent},

            {path:'species',component: SpeciesListPageComponent},
            {path:'species/:id',component: SpeciesViewPageComponent},


        ]
    }
]