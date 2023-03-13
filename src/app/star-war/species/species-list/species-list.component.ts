import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { List, SearchData, Specie } from 'src/app/star-war/models';
import { FormBuilder, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'star-war-species-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,],
  templateUrl: './species-list.component.html',
  styleUrls: ['./species-list.component.scss']
})
export class SpeciesListComponent  implements OnInit{
  @Input() data!: List<Specie>;
  @Input() search?: SearchData

  @Output() searchChange = new  EventEmitter<SearchData>();
  @Output() itemSelected = new EventEmitter<Specie>();

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

  protected doSelect(item: Specie): void {
    this.itemSelected.emit(item);
  }
}
