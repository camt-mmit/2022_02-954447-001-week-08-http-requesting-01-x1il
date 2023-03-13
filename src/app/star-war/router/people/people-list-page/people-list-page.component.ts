import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { PeopleListComponent } from 'src/app/star-war/people/people-list/people-list.component';
import { List, Person, SearchData } from 'src/app/star-war/models';
import { PeopleService } from 'src/app/star-war/services/people.service';

@Component({
  selector: 'star-war-people-list-page',
  templateUrl: './people-list-page.component.html',
  standalone: true,
  imports: [CommonModule, PeopleListComponent],
  styleUrls: ['./people-list-page.component.scss']
})
export class PeopleListPageComponent {
  protected readonly data$: Observable<List<Person>>;

  protected searchData: SearchData;

  constructor(
    dataService: PeopleService, 
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
  protected doSelect(item: Person): void{
    const paths = item.url.pathname.split('/');
    const id = paths[paths.length - 2];

    this.router.navigate([id],{
      relativeTo:this.route,
    });

  }
}
