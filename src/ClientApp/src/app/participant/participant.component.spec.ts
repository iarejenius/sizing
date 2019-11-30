import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantComponent } from './participant.component';
import { MatFormFieldModule, MatInputModule, MatButtonModule, MatChipsModule, MatCardModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ParticipantService } from '../services/participant.service';
import { Subscription } from 'rxjs';
import { Participant } from '../models/participant';

describe('ParticipantComponent', () => {
  let component: ParticipantComponent;
  let fixture: ComponentFixture<ParticipantComponent>;

  const connectedSpy = jasmine.createSpyObj('connected', ['subscribe']);
  const participantCreatedSpy = jasmine.createSpyObj('participantCreated', ['subscribe']);
  const sizeClearedSpy = jasmine.createSpyObj('sizeCleared', ['subscribe']);

  const participantSvcSpy = jasmine.createSpyObj('participantService', [
    'updateParticipant',
    'createParticipant'
  ]);
  participantSvcSpy.connected = connectedSpy;
  participantSvcSpy.participantCreated = participantCreatedSpy;
  participantSvcSpy.sizeCleared = sizeClearedSpy;

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
      declarations: [ParticipantComponent],
      providers: [
        {provide: ParticipantService, useValue: participantSvcSpy}
      ]
    })
      .compileComponents();


  }));

  beforeEach(() => {
    connectedSpy.subscribe.calls.reset();
  });

  it('should create', () => {

    fixture = TestBed.createComponent(ParticipantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(connectedSpy.subscribe).toHaveBeenCalled();
    expect(participantCreatedSpy.subscribe).toHaveBeenCalled();
    expect(sizeClearedSpy.subscribe).toHaveBeenCalled();
  });

  it('should connect after successful connection', () => {
    connectedSpy.subscribe.and.callFake((next: (value:boolean) => void) => {
      next(true);
    });

    fixture = TestBed.createComponent(ParticipantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(connectedSpy.subscribe).toHaveBeenCalled();
    expect(component.connected).toBe(true);

  });
  
  it('should not connect after unsuccessful connection', () => {
    connectedSpy.subscribe.and.callFake((next: (value:boolean) => void) => {
      next(false);
    });

    fixture = TestBed.createComponent(ParticipantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(connectedSpy.subscribe).toHaveBeenCalled();
    expect(component.connected).toBe(false);
  });

  it('should be joined and have participant after successful participant creation', () => {
    const testParticipant = new Participant();
    participantCreatedSpy.subscribe.and.callFake((next: (value:Participant) => void) => {
      next(testParticipant);
    });

    fixture = TestBed.createComponent(ParticipantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(participantCreatedSpy.subscribe).toHaveBeenCalled();
    expect(component.participant).toBe(testParticipant);
    expect(component.joined).toBe(true);
  });

  it('should clear size after successful size cleared message', () => {
    sizeClearedSpy.subscribe.and.callFake((next: () => void) => {
      next();
    });

    fixture = TestBed.createComponent(ParticipantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(sizeClearedSpy.subscribe).toHaveBeenCalled();
    expect(component.isSizeCleared).toBe(true);
    expect(component.size.value).toBeUndefined();
  });

  it('should call createParticipant after join', () => {
    fixture = TestBed.createComponent(ParticipantComponent);
    component = fixture.componentInstance;
    component.connected = true;
    component.joined = false;
    fixture.detectChanges();
    component.join();
  
    expect(participantSvcSpy.createParticipant).toHaveBeenCalled();
  })

});
