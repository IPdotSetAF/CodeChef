import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cs2tsComponent } from './cs2ts.component';

describe('Cs2tsComponent', () => {
  let component: Cs2tsComponent;
  let fixture: ComponentFixture<Cs2tsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cs2tsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cs2tsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
