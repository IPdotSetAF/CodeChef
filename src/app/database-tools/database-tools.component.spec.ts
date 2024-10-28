import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseToolsComponent } from './database-tools.component';

describe('DatabaseToolsComponent', () => {
  let component: DatabaseToolsComponent;
  let fixture: ComponentFixture<DatabaseToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatabaseToolsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatabaseToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
