import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Md2htmlComponent } from './md2html.component';

describe('Md2htmlComponent', () => {
  let component: Md2htmlComponent;
  let fixture: ComponentFixture<Md2htmlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Md2htmlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Md2htmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
