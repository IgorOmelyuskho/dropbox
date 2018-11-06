import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentAndToolbarWrapperComponent } from './content-and-toolbar-wrapper.component';

describe('ContentAndToolbarWrapperComponent', () => {
  let component: ContentAndToolbarWrapperComponent;
  let fixture: ComponentFixture<ContentAndToolbarWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentAndToolbarWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentAndToolbarWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
