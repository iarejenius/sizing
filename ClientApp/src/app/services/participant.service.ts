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
  public connected: Observable<boolean>;
  public participantCreated: Observable<Participant>;

  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('/hub')
      .build();

    this.connected = new Observable<boolean>((observer) => {
      this.connection.start()
        .then(() => observer.next(true), () => observer.next(false))
        .catch(err => console.error(err));

      return () => {
        this.connection.stop();
      };
    });

    this.participantCreated = new Observable<Participant>((observer) => {
      this.connection.on('participantCreated', (participant: Participant) => {
        observer.next(participant);
      });
      return () => {
        this.connection.off('participantCreated', observer.next);
      };
    });
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
