import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeciesViewPageComponent } from './species-view-page.component';

describe('SpeciesViewPageComponent', () => {
  let component: SpeciesViewPageComponent;
  let fixture: ComponentFixture<SpeciesViewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SpeciesViewPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpeciesViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
