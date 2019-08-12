import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { Observable } from 'rxjs';
import { Participant } from '../models/participant';

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {

  private connection: signalR.HubConnection;
  public clearSize: Observable<any>;

  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('/hub')
      .build();

    this.connection.start().catch(err => console.error(err));
  }

  public createParticipant(sessionKey: string, name: string) {
    this.connection.send('createParticipant', sessionKey, name)
      .then(() => console.log('message sent to create participant'))
      .catch((err) => console.error(err));
  }

  public updateParticipant(participant: Participant) {
    this.connection.send('updateParticipant', participant)
      .then(() => console.log('message sent to update participant'))
      .catch((err) => console.error(err));
  }
}
