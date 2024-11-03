import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MssqlScaffolderComponent } from './mssql-scaffolder.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

describe('MssqlScaffolderComponent', () => {
  let component: MssqlScaffolderComponent;
  let fixture: ComponentFixture<MssqlScaffolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MssqlScaffolderComponent],
      providers: [
        provideAnimations(),
        provideHttpClient(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              url: ["mssqlscaffold"]
            }
          }
        },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MssqlScaffolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
