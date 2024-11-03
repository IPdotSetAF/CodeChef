import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MssqlScaffolderComponent } from './mssql-scaffolder.component';

describe('DatabaseToolsComponent', () => {
  let component: MssqlScaffolderComponent;
  let fixture: ComponentFixture<MssqlScaffolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MssqlScaffolderComponent]
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