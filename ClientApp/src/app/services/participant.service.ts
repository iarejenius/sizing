import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {

  private connection: signalR.HubConnection;

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
}
