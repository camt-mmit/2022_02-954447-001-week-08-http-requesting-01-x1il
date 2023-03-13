import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { List, Person, SearchData } from 'src/app/star-war/models';

@Component({
  selector: 'star-war-people-list',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.scss']
})
export class PeopleListComponent implements OnInit {
  @Input() data!: List<Person>;
  @Input() search?: SearchData

  @Output() searchChange = new  EventEmitter<SearchData>();
  @Output() itemSelected = new EventEmitter<Person>();

  protected formGroup!:FormGroup<{
    search:FormControl<string>;
    // page: FormControl<string>;
  }>;

  private fb: NonNullableFormBuilder;
  // private subscription: Subscription | null = null;
  constructor(fb:FormBuilder){
    this.fb =fb.nonNullable;
  }
  
  ngOnInit(): void {
    if(!this.data) {
      throw new Error(`Property 'data' isn required!`);
    }

    this.formGroup = this.fb.group({
      search: this.search?.search ??'',
    });
  }
  // ngOnDestroy(): void {
  //   this.subscription?.unsubscribe();
  // }
 
  protected doSearch(): void {
    const value = this.formGroup.value;

    if (value.search) {
      this.searchChange.emit(this.formGroup.value);
    } else {
      this.doClear();
    }
  }

  protected doClear(): void {
    this.formGroup.setValue({ search: '' });
    this.searchChange.emit({});
  }

  protected changepage(searchParms?: URLSearchParams): void{
    const search = searchParms?.get('search');
    const page = searchParms?.get('page');

    const searchData = {
      ...(search ? {search} :{}),
      ...(page ? {page} :{}),
    };
    this.searchChange.emit(searchData);
  }

  protected doSelect(item: Person): void {
    this.itemSelected.emit(item);
  }
}