import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Participant } from '../models/participant';
import { SignalRConnection } from './signalr-connection.service';

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {

  public sizeCleared: Observable<void>;
  public connected: Observable<boolean>;
  public participantCreated: Observable<Participant>;

  constructor(private connection: SignalRConnection) {

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

    this.sizeCleared = new Observable<void>((observer) => {
      this.connection.on('clearSize', () => {
        observer.next();
      });
      return () => {
        this.connection.off('clearSize', observer.next);
      };
    });
  }

  public createParticipant(sessionKey: string, name: string) {
    this.connection.send('createParticipant', sessionKey, name)
      .catch((err) => console.error(err));
  }

  public updateParticipant(participant: Participant) {
    this.connection.send('updateParticipant', participant)
      .catch((err) => console.error(err));
  }
}
