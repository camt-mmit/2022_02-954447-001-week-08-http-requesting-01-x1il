import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizationPagComponent } from './authorization-pag.component';

describe('AuthorizationPagComponent', () => {
  let component: AuthorizationPagComponent;
  let fixture: ComponentFixture<AuthorizationPagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AuthorizationPagComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorizationPagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
