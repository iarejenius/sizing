import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from '../services/session.service';
import { Session } from '../models/session';
import { Participant } from '../models/participant';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})
export class SessionComponent implements OnInit {

  public key: string;
  public isRevealed: boolean;
  public participantUrl = window.location.origin + '/' + 'participant';
  private participants: Participant[] = [];

  constructor(private activatedRoute: ActivatedRoute, private sessionService: SessionService) {
    this.isRevealed = false;

    this.sessionService.sessionCreated.subscribe((session: Session) => {
      console.log(session);
      this.key = session.key;
    });

    this.sessionService.connected.subscribe(success => {
      if (success) {
        if (this.activatedRoute.snapshot.paramMap.has('key')) {
          this.key = this.activatedRoute.snapshot.paramMap.get('key');
        } else {
          this.sessionService.createSession();
        }
      } else {
        console.error('Failed to connect');
      }
    });

    // Set up participant handlers here.
    this.sessionService.participantJoined.subscribe(participant => {
      console.log(`${participant.name} joined`);
      this.participants.push(participant);
    });

    this.sessionService.participantLeft.subscribe(participant => {
      console.log(`${participant.name} left`);
      const index = this.participants.findIndex(p => p.id === participant.id);
      this.participants.splice(index, 1);
    });

    this.sessionService.participantUpdated.subscribe(participant => {
      console.log(`${participant.name} updated`);
      const participantToUpdate = this.participants.find((p, i) => {
        if (p.id === participant.id) {
          return true;
        }
      });
      if (participantToUpdate !== null) {
        participantToUpdate.size = participant.size;
      }
    });
  }

  ngOnInit() { }

  public reveal() {
    this.isRevealed = true;
  }

  public clear() {
    this.sessionService.clearSizes(this.key);
    this.isRevealed = false;
  }

}
