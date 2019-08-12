import { Component } from '@angular/core';
import { SessionService } from '../services/session.service';
import { Session } from '../models/session';
import { Participant } from '../models/participant';
import { ParticipantService } from '../services/participant.service';

@Component({
  selector: 'app-counter-component',
  templateUrl: './counter.component.html'
})
export class CounterComponent {
  public currentCount = 0;
  public name: string;
  public sessionKey: string;

  constructor(private sessionService: SessionService, private participantService: ParticipantService) {
    this.sessionService.sessionCreated.subscribe((session: Session) => {
      console.log(session);
    });

    this.sessionService.participantJoined.subscribe((participant: Participant) => {
      console.log('joined');
      console.log(participant);
      participant.size = '3';
      this.participantService.updateParticipant(participant);
    });

    this.sessionService.participantUpdated.subscribe((participant: Participant) => {
      console.log('updated');
      console.log(participant);
    });

    this.sessionService.participantLeft.subscribe((participant: Participant) => {
      console.log('left');
      console.log(participant);
    });
  }

  public incrementCounter() {
    this.sessionService.createSession();
    this.currentCount++;
  }

  // Method to create session
  public createSession() {
    this.sessionService.createSession();
  }

  // Method to create participant
  public createParticipant() {
    // TODO create new service that manages service
    this.participantService.createParticipant(this.sessionKey, this.name);
  }

}
