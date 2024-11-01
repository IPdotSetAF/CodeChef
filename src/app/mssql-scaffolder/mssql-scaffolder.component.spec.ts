import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MssqlScaffoldComponent } from './mssql-scaffolder.component';

describe('DatabaseToolsComponent', () => {
  let component: MssqlScaffoldComponent;
  let fixture: ComponentFixture<MssqlScaffoldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MssqlScaffoldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MssqlScaffoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
