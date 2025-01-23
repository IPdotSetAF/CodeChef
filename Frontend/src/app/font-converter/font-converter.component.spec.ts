import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FontConverterComponent } from './font-converter.component';

describe('FontConverterComponent', () => {
  let component: FontConverterComponent;
  let fixture: ComponentFixture<FontConverterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FontConverterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FontConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
