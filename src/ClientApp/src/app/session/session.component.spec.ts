import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionComponent } from './session.component';
import { MatFormFieldModule, MatInputModule, MatButtonModule, MatChipsModule, MatCardModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from '../services/session.service';
import { Participant } from '../models/participant';

describe('SessionComponent', () => {
  let component: SessionComponent;
  let fixture: ComponentFixture<SessionComponent>;
  const mockedActivatedRoute = {
    snapshot: {
      paramMap: jasmine.createSpyObj('paramMap', ['has', 'get'])
      }
    };

  const connectedSpy = jasmine.createSpyObj('connected', ['subscribe']);
  const sessionCreatedSpy = jasmine.createSpyObj('sessionCreated', ['subscribe']);
  const participantJoinedSpy = jasmine.createSpyObj('participantJoined', ['subscribe']);
  const participantLeftSpy = jasmine.createSpyObj('participantLeft', ['subscribe']);
  const participantUpdatedSpy = jasmine.createSpyObj('participantUpdated', ['subscribe']);

  const sessionSvcSpy = jasmine.createSpyObj('sessionService', ['createSession', 'clearSizes']);

  sessionSvcSpy.connected = connectedSpy;
  sessionSvcSpy.sessionCreated = sessionCreatedSpy;
  sessionSvcSpy.participantJoined = participantJoinedSpy;
  sessionSvcSpy.participantLeft = participantLeftSpy;
  sessionSvcSpy.participantUpdated = participantUpdatedSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatChipsModule,
        MatCardModule],
      declarations: [SessionComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockedActivatedRoute },
        { provide: SessionService, useValue: sessionSvcSpy }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
  });

  it('should create', () => {
    fixture = TestBed.createComponent(SessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(connectedSpy.subscribe).toHaveBeenCalled();
    expect(sessionCreatedSpy.subscribe).toHaveBeenCalled();
    expect(participantJoinedSpy.subscribe).toHaveBeenCalled();
    expect(participantLeftSpy.subscribe).toHaveBeenCalled();
    expect(participantUpdatedSpy.subscribe).toHaveBeenCalled();
  });


  it('should connect after successful connection', () => {
    connectedSpy.subscribe.and.callFake((next: (value:boolean) => void) => {
      next(true);
    });

    mockedActivatedRoute.snapshot.paramMap.has.and.returnValue(false);

    fixture = TestBed.createComponent(SessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(connectedSpy.subscribe).toHaveBeenCalled();
    expect(sessionSvcSpy.createSession).toHaveBeenCalled();
  });
  
  it('should not connect after unsuccessful connection', () => {
    connectedSpy.subscribe.and.callFake((next: (value:boolean) => void) => {
      next(false);
    });

    fixture = TestBed.createComponent(SessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(connectedSpy.subscribe).toHaveBeenCalled();
  });

  it('should add participant after participant joined', () => {
    const testParticipant = new Participant();
    participantJoinedSpy.subscribe.and.callFake((next: (participant: Participant) => void) => {
      next(testParticipant);
    });

    fixture = TestBed.createComponent(SessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.participants.length).toBe(1);
    expect(component.participants[0]).toBe(testParticipant);
    participantJoinedSpy.subscribe.and.stub(); // reset this fake
  });

  it('should remove participant after partipant left', () => {
    const testParticipant = new Participant();
    testParticipant.id = "testid";
    let observerNext: (partipant: Participant) => void;
    participantLeftSpy.subscribe.and.callFake((next: (participant: Participant) => void) => {
      observerNext = next;
    });

    fixture = TestBed.createComponent(SessionComponent);
    component = fixture.componentInstance;
    component.participants.push(testParticipant);
    fixture.detectChanges();

    expect(component.participants.length).toBe(1);
    observerNext(testParticipant);
    expect(component.participants.length).toBe(0);
    participantLeftSpy.subscribe.and.stub(); // reset this fake
  });

  it('should reveal', () => {
    fixture = TestBed.createComponent(SessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.reveal();

    expect(component.isRevealed).toBe(true);
  });

  it('should clear', () => {
    fixture = TestBed.createComponent(SessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.clear();
    
    expect(component.isRevealed).toBe(false);
    expect(sessionSvcSpy.clearSizes).toHaveBeenCalled();
  });

});
