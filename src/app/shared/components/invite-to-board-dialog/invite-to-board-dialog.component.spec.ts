import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteToBoardDialogComponent } from './invite-to-board-dialog.component';

describe('InviteToBoardDialogComponent', () => {
  let component: InviteToBoardDialogComponent;
  let fixture: ComponentFixture<InviteToBoardDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteToBoardDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteToBoardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
