import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsListComponent } from 'src/app/google/events/events-list/events-list.component';
import { Observable, tap } from 'rxjs';
import { EventsList } from 'src/app/google/models';
import { EventService } from 'src/app/google/services/event.service';

@Component({
  selector: 'google-events-list-page',
  standalone: true,
  imports: [CommonModule,EventsListComponent],
  templateUrl: './events-list-page.component.html',
  styleUrls: ['./events-list-page.component.scss']
})
export class EventsListPageComponent {
  protected data$: Observable<EventsList>;
  constructor(private readonly dataService: EventService){
    this.data$ = this.dataService.getAll().pipe(tap((data) => console.debug('xxxxxx', data)));
  }
}
