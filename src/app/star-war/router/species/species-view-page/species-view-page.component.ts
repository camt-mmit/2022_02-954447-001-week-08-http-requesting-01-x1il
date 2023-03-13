import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Specie } from 'src/app/star-war/models';
import { Observable, switchMap } from 'rxjs';
import { SpeciesViewComponent } from 'src/app/star-war/species/species-view/species-view.component';
import { ActivatedRoute } from '@angular/router';
import { SpeciesService } from 'src/app/star-war/services/species.service';

@Component({
  selector: 'star-war-species-view-page',
  standalone: true,
  imports: [CommonModule, SpeciesViewComponent],
  templateUrl: './species-view-page.component.html',
  styleUrls: ['./species-view-page.component.scss']
})
export class SpeciesViewPageComponent {
  protected readonly data$: Observable<Specie>;

  constructor( dataService:SpeciesService, route: ActivatedRoute){
    this.data$ = route.params.pipe(
      switchMap((params) => dataService.get(params['id']))
    )
  }
  back(): void{
      history.back();
  }
}
