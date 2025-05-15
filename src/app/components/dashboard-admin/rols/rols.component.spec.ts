import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolsComponent } from './rols.component';

describe('RolsComponent', () => {
  let component: RolsComponent;
  let fixture: ComponentFixture<RolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
