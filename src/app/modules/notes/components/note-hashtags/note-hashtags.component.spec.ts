import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteHashtagsComponent } from './note-hashtags.component';

describe('NoteHashtagsComponent', () => {
  let component: NoteHashtagsComponent;
  let fixture: ComponentFixture<NoteHashtagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoteHashtagsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteHashtagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
