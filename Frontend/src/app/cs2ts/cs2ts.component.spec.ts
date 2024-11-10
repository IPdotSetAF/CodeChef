import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cs2tsComponent } from './cs2ts.component';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('Cs2tsComponent', () => {
  let component: Cs2tsComponent;
  let fixture: ComponentFixture<Cs2tsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cs2tsComponent],
      providers:[
        provideAnimations()
      ]
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
