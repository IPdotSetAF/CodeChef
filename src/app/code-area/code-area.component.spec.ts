import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeAreaComponent } from './code-area.component';

describe('CodeAreaComponent', () => {
  let component: CodeAreaComponent;
  let fixture: ComponentFixture<CodeAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeAreaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
