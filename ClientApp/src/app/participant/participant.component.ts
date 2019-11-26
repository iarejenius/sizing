import { Component, OnInit } from '@angular/core';
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
  private isSizeCleared = false;
  public participant: Participant;

  public joinGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    key: new FormControl('', Validators.required)
  });

  public size = new FormControl('');

  public sizeGroup = new FormGroup({
    size: this.size
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

      this.size.valueChanges.subscribe(value => {
        this.participant.size = value;
        this.participantService.updateParticipant(this.participant);
      });
    });

    participantService.sizeCleared.subscribe(() => {
      this.size.setValue(undefined);
      this.isSizeCleared = true;
      setTimeout(() => {
        this.isSizeCleared = false;
      }, 3000);
    });
  }

  ngOnInit() {
    // Force key input to be upper case
    this.joinGroup.get('key').valueChanges.subscribe((value: string) => {
      this.joinGroup.get('key').setValue(value.toUpperCase(), { emitEvent: false });
    });
  }

  public join() {
    if (this.connected && !this.joined) {
      this.participantService.createParticipant(this.joinGroup.get('key').value, this.joinGroup.get('name').value);
    }
  }

}
