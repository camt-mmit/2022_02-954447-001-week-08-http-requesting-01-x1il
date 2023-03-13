import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Specie } from 'src/app/star-war/models';

@Component({
  selector: 'star-war-person-view-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './person-view-page.component.html',
  styleUrls: ['./person-view-page.component.scss']
})
export class PersonViewPageComponent implements OnInit {
  @Input() data!: Specie;
  ngOnInit(): void {
    if(!this.data){
      throw new Error('Method not implemented.');
    }
  }
}
