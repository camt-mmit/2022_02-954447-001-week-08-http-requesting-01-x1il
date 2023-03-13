import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeciesListPageComponent } from './species-list-page.component';

describe('SpeciesListPageComponent', () => {
  let component: SpeciesListPageComponent;
  let fixture: ComponentFixture<SpeciesListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SpeciesListPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpeciesListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
