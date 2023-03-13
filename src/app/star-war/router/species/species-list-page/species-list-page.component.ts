import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, switchMap } from 'rxjs';
import { List, SearchData, Specie } from 'src/app/star-war/models';
import { ActivatedRoute, Router } from '@angular/router';
import { SpeciesListComponent } from 'src/app/star-war/species/species-list/species-list.component';
import { SpeciesService } from 'src/app/star-war/services/species.service';

@Component({
  selector: 'star-war-species-list-page',
  standalone: true,
  imports: [CommonModule, SpeciesListComponent],
  templateUrl: './species-list-page.component.html',
  styleUrls: ['./species-list-page.component.scss']
})
export class SpeciesListPageComponent {
  protected readonly data$: Observable<List<Specie>>;

  protected searchData: SearchData;

  constructor(
    dataService: SpeciesService, 
    private route: ActivatedRoute, 
    private readonly router: Router,){
    //this.data$ = dataService.getAll({page:'2'});
    this.searchData = route.snapshot.queryParams;
    this.data$ = route.queryParams.pipe(
      switchMap((params) => dataService.getAll(params)),
    );
  }
  protected search(searchData:SearchData): void{
    this.router.navigate([],{
      queryParams: searchData,
    })
  }
  protected doSelect(item: Specie): void{
    const paths = item.url.pathname.split('/');
    const id = paths[paths.length - 2];

    this.router.navigate([id],{
      relativeTo:this.route,
    });

  }
}
