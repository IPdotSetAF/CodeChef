import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerializedToolComponent } from './serialized-tool.component';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('SerializedToolComponent', () => {
  let component: SerializedToolComponent;
  let fixture: ComponentFixture<SerializedToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SerializedToolComponent],
      providers: [
        provideAnimations()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SerializedToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
