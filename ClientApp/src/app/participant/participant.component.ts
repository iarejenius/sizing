import { Component, OnInit } from '@angular/core';
import { SessionService } from '../services/session.service';
import { ParticipantService } from '../services/participant.service';
import { Participant } from '../models/participant';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-participant',
  templateUrl: './participant.component.html'
})
export class ParticipantComponent implements OnInit {

  private joined = false;
  private connected = false;
  public participant: Participant;

  public name = new FormControl('');
  public key = new FormControl('');

  public joinGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    key: new FormControl('', Validators.required)
  });

  constructor(private participantService: ParticipantService) {

    participantService.connected.subscribe(success => {
      if (success) {
        this.connected = true;
      } else {
        console.error('Participant service failed to connect');
      }
    });

    participantService.participantCreated.subscribe(participant => {
      this.participant = participant;
      this.joined = true;
    });
  }

  ngOnInit() {
  }

  public join() {
    console.log('Joined called');
    if (this.connected && !this.joined) {
      this.participantService.createParticipant(this.joinGroup.get('key').value, this.joinGroup.get('name').value);
    }
  }

}
